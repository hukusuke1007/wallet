<template>
    <v-card flat>
      <div class="w-break">
        <v-subheader>ウォレット</v-subheader><v-card-text><h3>{{ name }}</h3></v-card-text>
        <v-subheader>残高</v-subheader><v-card-text><h2 class="font-color-shamrock">{{ balance }} xem</h2></v-card-text>
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-text-field
            box
            label="送金先"
            v-model="senderAddr"
            :rules="senderAddrRules"
            :counter="40"
            required
          ></v-text-field>
          <v-text-field
            box
            label="送金量"
            v-model="amount"
            :rules="amountRule"
            required
          ></v-text-field>
          <v-text-field
            box
            multi-line
            label="メッセージ"
            v-model="message"
            :rules="messageRules"
            :counter="1024"
          ></v-text-field>
        </v-form>
        <v-flex>
           <v-btn color="orange darken-1" class="white--text" @click.stop="showQRreader" block>QRコード読み取り</v-btn>
          <v-btn color="info" @click="submit" :disabled="!valid">送金</v-btn>
          <v-btn @click="clear">クリア</v-btn>
        </v-flex>
        <br>
        <!-- ダイアログ -->
        <dialogConfirm v-bind:dialogVal="isShowDialog"
                       titleVal="送金"
                       v-bind:messageVal="dialogMessage"
                       v-on:dialog-confirm-event-tap-positive="tapPositive"></dialogConfirm>
        <!-- QRコードダイアログ -->
        <dialogQRreader v-bind:dialogVal="isShowDialogQRreader"
                        v-bind:pauseVal="paused"
                        typeVal="invoice"
                        v-on:qr-reader-event-scan-success="getQRContent"
                        v-on:qr-reader-event-tap-close="tapQRClose"></dialogQRreader>
      </v-flex>
      </div>
    </v-card>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import DialogConfirm from '@/components/DialogConfirm'
  import DialogQRreader from '@/components/QRreader'

  export default {
    data: () => ({
      valid: false,
      date: '',
      balance: 0,
      name: '',
      amount: 0,
      message: '',
      senderAddr: '',
      publicKey: '',
      privateKey: '',
      isShowDialog: false,
      dialogMessage: '送金しました。',
      isShowDialogQRreader: false,
      paused: false,
      content: '',
      senderAddrRules: [
        value => (value.length !== 40) || '送金先アドレスは40文字です。'
      ],
      amountRule: [
        value => !!value || '金額を入力してください'
      ],
      messageRules: [
        value => (value.length <= 1024) || '最大文字数を超えています。'
      ]
    }),
    components: {
      'dialogConfirm': DialogConfirm,
      'dialogQRreader': DialogQRreader
    },
    mounted () {
      this.reloadItem()
    },
    props: {
      id: {
        type: String,
        default: -1
      }
    },
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          console.log('submit')
        }
      },
      clear () {
        this.$refs.form.reset()
      },
      reloadItem () {
        let id = Number.parseInt(this.id)
        // console.log('reloadItem:' + id)
        dbWrapper.getItemArray(dbWrapper.KEY_WALLET_INFO, id)
          .then((result) => {
            this.date = result[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_CREATION_DATE]
            this.name = result[dbWrapper.VALUE_NAME]
            this.address = result[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_ADDRESS]['value']
            let pairKey = nemWrapper.getPairKey(result[dbWrapper.VALUE_WALLET_ACCOUNT])
            this.publicKey = pairKey[nemWrapper.PUBLICK_KEY]
            this.privateKey = pairKey[nemWrapper.PRIVATE_KEY]
            nemWrapper.getAccount(this.address)
              .then((result) => {
                this.balance = result.balance.balance / nemWrapper.NEM_UNIT
              })
          }).catch((err) => {
            console.log(err)
          })
      },
      showPrivateKey () {
        this.isShowDialog = true
      },
      tapPositive (message) {
        this.isShowDialog = false
      },
      showQRreader () {
        this.paused = false
        this.isShowDialogQRreader = true
      },
      getQRContent (content) {
        console.log(content)
        this.paused = true
        this.isShowDialogQRreader = false
      },
      tapQRClose (message) {
        if (this.isShowDialogQRreader === true) {
          console.log(message)
          this.paused = true
          this.isShowDialogQRreader = false
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
