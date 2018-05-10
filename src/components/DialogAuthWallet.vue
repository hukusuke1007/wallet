<template>
  <v-dialog v-model="dialog"
   fullscreen
   hide-overlay
   transition="dialog-bottom-transition"
   scrollable
  >
  <v-card flat>
      <v-container
        fluid
        style="min-height: 0;"
        grid-list-lg
        >
      <v-flex xs12 sm6 offset-sm3>
        <v-card flat>
        <div class="w-break sideOffset">
          <v-layout row wrap column>
            <v-flex v-if="!isExistPass">
              <v-card-text><h3>パスワードを設定してください</h3></v-card-text>
              <v-form v-model="valid" ref="form" lazy-validation>
                    <v-text-field
                      label="新規パスワードを入力"
                      v-model="password"
                      :rules="[rules.passwordLimit, rules.passwordInput]"
                      min="4"
                      :append-icon ="hiddenPass ? 'visibility' : 'visibility_off'"
                      :append-icon-cb="() => (hiddenPass = !hiddenPass)"
                      :type="hiddenPass ? 'number' : 'password'"
                      required
                      placeholder=""
                      pattern="[0-9]*"
                    ></v-text-field>
                    <v-text-field
                      label="確認用パスワードを入力"
                      v-model="comPassword"
                      :rules="[rules.passwordLimit, rules.passwordInput]"
                      min="4"
                      :append-icon="hiddenCheckPass ? 'visibility' : 'visibility_off'"
                      :append-icon-cb="() => (hiddenCheckPass = !hiddenCheckPass)"
                      :type="hiddenCheckPass ? 'number' : 'password'"
                      required
                      placeholder=""
                      pattern="[0-9]*"
                    ></v-text-field>
              </v-form>
            </v-flex>
            <v-flex v-else>
              <v-card-text><h3>パスワードを入力してください</h3></v-card-text>
              <v-form v-model="valid" ref="form" lazy-validation>
                    <v-text-field
                      label="パスワードを入力"
                      v-model="password"
                      :rules="[]"
                      min="4"
                      :append-icon="hiddenPass ? 'visibility' : 'visibility_off'"
                      :append-icon-cb="() => (hiddenPass = !hiddenPass)"
                      :type="hiddenPass ? 'number' : 'password'"
                      required
                      placeholder=""
                      pattern="[0-9]*"
                    ></v-text-field>
              </v-form>
            </v-flex>
            <v-btn color="info" @click="submit" :disabled="!valid">完了</v-btn>
            <v-btn @click="clear">クリア</v-btn>
            <v-flex>
             <v-btn color="grey" class="white--text" @click="close">閉じる</v-btn>
            </v-flex>

            <!-- 完了ダイアログ -->
            <DialogConfirm v-bind:dialogVal="isShowDialogConfirm"
                           v-bind:titleVal="dialogTitle"
                           v-bind:messageVal="dialogMessage"
                           v-on:dialog-confirm-event-tap-positive="tapConfirm"></DialogConfirm>
          </v-layout>
        </div>
        </v-card>
      </v-flex>
    </v-container>
  </v-card>
  </v-dialog>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import DialogConfirm from '@/components/DialogConfirm'
  import cryptoWrapper from '@/js/crypto_wrapper'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data: () => ({
      dialog: false,
      valid: false,
      isError: false,
      isExistPass: false,
      password: '',
      comPassword: '',
      hiddenPass: true,
      hiddenCheckPass: true,
      rules: {
        passwordLimit: (value) => (value && value.length >= 4) || 'パスワードは4文字以上です',
        passwordInput: (value) => {
          const pattern = /^[0-9]+$/
          return pattern.test(value) || '数字を入力してください'
        }
      },
      isShowDialogConfirm: false,
      dialogTitle: '',
      dialogMessage: ''
    }),
    components: {
      DialogConfirm
    },
    computed: {
      ...mapGetters('Auth', ['isAuth', 'authPassword'])
    },
    mounted () {
      this.reloadItem()
    },
    props: {
      dialogVal: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      dialogVal (val) {
        this.dialog = val
      }
    },
    methods: {
      ...mapActions('Auth', ['doAuth', 'doAuthPassword']),
      setStateStore (isAuth, password) {
        this.doAuth(isAuth)
        this.doAuthPassword(password)
      },
      reloadItem () {
        dbWrapper.getItem(dbWrapper.KEY_AUTH_PASSWORD)
          .then((result) => {
            if (result) {
              this.isExistPass = true
            } else {
              this.isExistPass = false
            }
          }).catch((err) => {
            console.log(err)
            this.isExistPass = false
          })
      },
      createData () {
        this.dialogTitle = 'パスワードの設定'
        let password = this.password + '0000' // NEM libraryの仕様により8文字以上にする.
        let encPass = cryptoWrapper.encryptAES(password, password)
        console.log(password, encPass)
        dbWrapper.setItem(dbWrapper.KEY_AUTH_PASSWORD, encPass)
          .then((result) => {
            this.dialogMessage = 'パスワードを設定しました。'
            this.isShowDialogConfirm = true
          }).catch((err) => {
            console.log(err)
            this.dialogMessage = 'ERROR:データ保存に失敗しました。'
            this.isShowDialogConfirm = true
          })
      },
      checkPassword () {
        this.dialogTitle = 'パスワード'
        dbWrapper.getItem(dbWrapper.KEY_AUTH_PASSWORD)
          .then((result) => {
            let password = this.password + '0000' // NEM libraryの仕様により8文字以上にする.
            let decPass = cryptoWrapper.decryptAES(result, password)
            console.log(decPass)
            if (password === decPass) {
              this.isError = false
              this.setStateStore(true, password)
              this.clear()
              this.$emit('dialog-auth-wallet-notify', 'auth_success')
              this.$emit('dialog-auth-wallet-close', 'close')
            } else {
              this.isError = true
              this.dialogMessage = 'パスワードが違います。'
              this.isShowDialogConfirm = true
            }
          }).catch((err) => {
            console.log(err)
            this.isError = true
            this.dialogMessage = 'ERROR:データ取得に失敗しました。'
            this.isShowDialogConfirm = true
          })
      },
      submit () {
        if (this.isExistPass === true) {
          if (this.password !== '') {
            this.checkPassword()
          } else {
            this.isError = true
            this.dialogTitle = 'パスワード'
            this.dialogMessage = 'パスワードを入力してください。'
            this.isShowDialogConfirm = true
          }
        } else {
          if (this.password === this.comPassword) {
            this.createData()
          } else {
            this.isError = true
            this.dialogTitle = 'パスワード'
            this.dialogMessage = '確認用パスワードと一致しません。'
            this.isShowDialogConfirm = true
          }
        }
      },
      clear () {
        this.password = ''
        this.comPassword = ''
      },
      close () {
        this.clear()
        this.$emit('dialog-auth-wallet-close', 'close')
      },
      tapConfirm () {
        console.log(this.isShowDialogConfirm)
        if (this.isShowDialogConfirm === true && this.isError === false) {
          this.clear()
          this.isShowDialogConfirm = false
          this.$emit('dialog-auth-wallet-notify', 'created')
          this.$emit('dialog-auth-wallet-close', 'close')
        } else if (this.isError === true) {
          this.isShowDialogConfirm = false
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.itemNum {
  float: right;
}
</style>
