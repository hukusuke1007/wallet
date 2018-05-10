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
                :input-value="selectMosaic.supplyMutable"
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
          <v-subheader>アカウントのQRコード</v-subheader><v-btn color="pink" class="white--text" @click="showNemAccount">表示</v-btn>
          <v-subheader>送金先アドレス</v-subheader><v-card-text>{{ walletItem.account.address.value }}</v-card-text>
          <v-subheader>公開鍵</v-subheader><v-card-text>{{ pairKey.publicKey }}</v-card-text>
          <v-subheader>秘密鍵</v-subheader><v-btn color="grey" class="black--text" @click="showPrivateKey">表示</v-btn>
          <v-flex>
            <v-btn icon @click.native="showDeleteWallet()">
              <v-icon color="primary">delete</v-icon>
            </v-btn>
          </v-flex>
          <!-- ダイアログ -->
          <NemAccountShow v-bind:dialogVal="isShowNemAccount"
                          v-bind:name="name"
                          v-on:dialog-nem-account-show-event-close="tapNemAccountClose"></NemAccountShow>
          <!-- 確認ダイアログ -->
          <dialogPositiveNegative v-bind:dialogVal="isShowDialogPositiveNegative"
                         titleVal="ウォレットの削除"
                         v-bind:messageVal="dialogPositiveNegativeMessage"
                         positiveVal="削除する"
                         negativeVal="いいえ"
                         v-on:dialog-positive-negative-event-tap="tapSendPositiveNegative"></dialogPositiveNegative>
          <!-- ダイアログ -->
          <dialogConfirm v-bind:dialogVal="isShowDialog"
                         v-bind:titleVal="dialogTitle"
                         v-bind:messageVal="dialogMessage"
                         v-on:dialog-confirm-event-tap-positive="tapPositive"></dialogConfirm>
        </v-flex>
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
  import { mapGetters } from 'vuex'

  export default {
    data: () => ({
      valid: true,
      selectMosaic: null,
      qrValue: '',
      isShowNemAccount: false,
      isShowDialog: false,
      isShowDialogPositiveNegative: false,
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
      'dialogPositiveNegative': DialogPositiveNegative,
      'dialogConfirm': DialogConfirm
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
        this.dialogTitle = '秘密鍵'
        this.dialogMessage = this.pairKey.privateKey
        this.selectDialog = 'private_key'
        this.isShowDialog = true
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
      showDeleteWallet () {
        console.log('delete')
        this.selectDialog = 'delete_wallet'
        this.isShowDialogPositiveNegative = true
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
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
