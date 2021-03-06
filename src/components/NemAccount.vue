<template>
    <v-card flat>
      <v-container fluid>
        <div class="w-break">
          <div class="subTitle">残高 (nem)</div>
          <v-card-text>
            <h2 class="font-color-shamrock">{{ nemBalance }} xem</h2>
          </v-card-text>
          <div v-if="selectMosaic">
            <div class="subTitle">モザイク残高 ({{ selectMosaic.namespaceId }})</div>
            <v-card-text>
              <h2 class="font-color-shamrock">{{ selectMosaic.amount }} {{ selectMosaic.name }}</h2>
            </v-card-text>
            <v-card-actions>
              <v-checkbox
                label="譲渡許可"
                :input-value="selectMosaic.transferable"
                color="success"
              ></v-checkbox>
              <v-checkbox
                label="徴収要求"
                :input-value="selectMosaic.levy"
                color="success"
              ></v-checkbox>
            </v-card-actions>
          </div>
            <v-flex justify-center>
            <v-select
              :items="mosaics"
              label="モザイク"
              v-model="selectMosaic"
              prepend-icon="view_quilt"></v-select>
            </v-flex>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field
              box
              label="ウォレット名"
              v-model="name"
              :rules="nameRules"
              :counter="16"
              required
            ></v-text-field>
          </v-form>
          <v-card-actions>
            <v-card-title class="subTitle">アカウントのQRコード</v-card-title>
          </v-card-actions>
          <v-btn color="select" class="buttonFont white--text" @click="showNemAccount">表示</v-btn>
          <v-card-actions>
            <v-card-title class="subTitle">送金先アドレス</v-card-title>
            <v-spacer></v-spacer>
            <v-btn icon
                  v-clipboard:copy="walletItem.account.address.value"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
            ><v-icon color="primary">assignment</v-icon></v-btn>
          </v-card-actions>
          <v-card-text>{{ walletItem.account.address.value }}</v-card-text>
          <v-card-actions>
            <v-card-title class="subTitle">公開鍵</v-card-title>
            <v-spacer></v-spacer>
            <v-btn icon
                  v-clipboard:copy="pairKey.publicKey"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
            ><v-icon color="primary">assignment</v-icon></v-btn>
          </v-card-actions>
          <v-card-text>{{ pairKey.publicKey }}</v-card-text>
          <v-card-actions>
            <v-card-title class="subTitle">秘密鍵</v-card-title>
          </v-card-actions>
          <v-btn color="grey" class="buttonFont white--text" @click="showPrivateKey">表示</v-btn>
          <v-flex>
            <v-btn icon @click.native="showDeleteWallet()">
              <v-icon color="grey">delete</v-icon>
            </v-btn>
          </v-flex>
          <!-- ダイアログ -->
          <NemAccountShow v-bind:dialogVal="isShowNemAccount"
                          v-bind:name="name"
                          v-on:dialog-nem-account-show-event-close="tapNemAccountClose"></NemAccountShow>
          <!-- 確認ダイアログ -->
          <DialogPositiveNegative v-bind:dialogVal="isShowDialogPositiveNegative"
                         titleVal="ウォレットの削除"
                         v-bind:messageVal="dialogPositiveNegativeMessage"
                         positiveVal="削除する"
                         negativeVal="いいえ"
                         v-on:dialog-positive-negative-event-tap="tapSendPositiveNegative"></DialogPositiveNegative>
          <!-- ダイアログ -->
          <DialogConfirm v-bind:dialogVal="isShowDialog"
                         v-bind:titleVal="dialogTitle"
                         v-bind:messageVal="dialogMessage"
                         v-on:dialog-confirm-event-tap-positive="tapPositive"></DialogConfirm>
          <!-- パスワード -->
          <DialogAuthWallet v-bind:dialogVal="isShowAuthWallet"
                       v-on:dialog-auth-wallet-close="tapAuthWalletClose"
                       v-on:dialog-auth-wallet-notify="tapAuthWalletNotify"></DialogAuthWallet>
        </div>
      </v-container>
    </v-card>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import NemAccountShow from '@/components/NemAccountShow'
  import DialogPositiveNegative from '@/components/DialogPositiveNegative'
  import DialogConfirm from '@/components/DialogConfirm'
  import DialogAuthWallet from '@/components/DialogAuthWallet'
  import { mapGetters } from 'vuex'

  export default {
    data: () => ({
      valid: true,
      selectMosaic: null,
      qrValue: '',
      isShowNemAccount: false,
      isShowDialog: false,
      isShowDialogPositiveNegative: false,
      isShowAuthWallet: false,
      dialogPositiveNegativeMessage: 'ウォレットを削除しますか？',
      dialogTitle: '',
      dialogMessage: '削除しました。',
      selectDialog: '',
      nameRules: [
        value => !!value || '名前を入力してください',
        value => (value && value.length <= 16) || '最大文字数を超えています。'
      ],
      descriptionRules: [
        value => (value.length <= 1024) || '最大文字数を超えています。'
      ]
    }),
    computed: {
      ...mapGetters('Nem', ['walletItem', 'pairKey', 'nemBalance', 'mosaics', 'transactionStatus', 'isLoading'])
    },
    components: {
      NemAccountShow,
      DialogPositiveNegative,
      DialogConfirm,
      DialogAuthWallet
    },
    mounted () {
      this.reloadItem()
    },
    props: {
      id: {
        type: Number,
        default: -1
      },
      name: {
        type: String,
        default: ''
      }
    },
    watch: {
      mosaics (after, before) {
        console.log(after)
        console.log(before)
        this.reloadItem()
      }
    },
    methods: {
      reloadItem () {
        if (this.mosaics.length > 0) {
          this.selectMosaic = this.mosaics[0]
        }
        this.qrValue = nemWrapper.getJSONInvoiceForQRcode(2, 1, this.name, this.walletItem.account.address.value, 0, '')
      },
      showPrivateKey () {
        this.selectDialog = 'private_key'
        this.isShowAuthWallet = true
      },
      showDeleteWallet () {
        this.selectDialog = 'delete_wallet'
        this.isShowAuthWallet = true
      },
      tapPositive (message) {
        if (this.isShowDialog === true) {
          this.isShowDialog = false
          if (this.selectDialog === 'delete_wallet') {
            this.$router.push({ name: 'WalletList' })
          }
        }
      },
      deleteWallet () {
        this.dialogTitle = 'ウォレットの削除'
        dbWrapper.removeItemArray(dbWrapper.KEY_WALLET_INFO, this.id)
          .then((result) => {
            this.dialogMessage = '削除しました'
          }).catch((err) => {
            console.log(err)
            this.dialogMessage = 'ERROR：削除に失敗しました'
          })
      },
      tapSendPositiveNegative (isPositive, message) {
        this.isShowDialogPositiveNegative = false
        if (isPositive) {
          this.deleteWallet()
          this.isShowDialog = true
        }
      },
      showNemAccount () {
        this.isShowNemAccount = true
      },
      tapNemAccountClose () {
        this.isShowNemAccount = false
      },
      tapAuthWalletClose () {
        this.isShowAuthWallet = false
      },
      tapAuthWalletNotify (status) {
        this.isShowAuthWallet = false
        if (status === 'auth_success') {
          if (this.selectDialog === 'delete_wallet') {
            this.isShowDialogPositiveNegative = true
          } else if (this.selectDialog === 'private_key') {
            this.dialogTitle = '秘密鍵'
            this.dialogMessage = this.pairKey.privateKey
            this.isShowDialog = true
          }
        }
      },
      onCopy () {
        let msg = 'コピーしました。'
        this.$toast(msg)
      },
      onError () {
        let msg = 'コピーに失敗しました。'
        this.$toast(msg)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
