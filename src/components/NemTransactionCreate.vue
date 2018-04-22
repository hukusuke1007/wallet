<template>
    <v-card flat>
      <v-container fluid>
        <div class="w-break">
          <v-subheader>ウォレット</v-subheader><v-card-text><h3>{{ name }}</h3></v-card-text>
          <v-subheader>残高</v-subheader><v-card-text><h2 class="font-color-shamrock">{{ balance }} xem</h2></v-card-text>
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
              label="送金先"
              v-model="senderAddr"
              :rules="[rules.senderAddrLimit, rules.senderAddrInput]"
              :counter="40"
              required
              placeholder="例. NBHWRG6STRXL2FGLEEB2UOUCBAQ27OSGDTO44UFC"
            ></v-text-field>
            <v-text-field
              box
              label="送金量"
              v-model="amount"
              :rules="[rules.amountLimit, rules.amountInput]"
              required
            ></v-text-field>
            <v-text-field
              box
              multi-line
              label="メッセージ"
              v-model="message"
              :rules="[rules.messageRules]"
              :counter="1024"
              placeholder="メッセージは手数料が別途かかります"
            ></v-text-field>
            <v-text-field
              label="手数料(xem)"
              v-model="fee"
              required
              disabled
            ></v-text-field>
          </v-form>
          <v-flex>
            <v-btn color="orange darken-1" class="white--text" @click.stop="showQRreader" block>QRコード読み取り</v-btn>
          </v-flex>
          <br>
          <v-flex>
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
     </v-container>
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
      mosaics: [ 'nem:xem', 'testMosaic' ],
      selectMosaic: 'nem:xem',
      amount: 0,
      fee: 0,
      message: '',
      senderAddr: '',
      publicKey: '',
      privateKey: '',
      isShowDialog: false,
      dialogMessage: '送金しました。',
      isShowDialogQRreader: false,
      paused: false,
      content: '',
      rules: {
        senderAddrLimit: (value) => (value && (value.length === 46 || value.length === 40)) || '送金先アドレス(-除く)は40文字です。',
        senderAddrInput: (value) => {
          const pattern = /^[a-zA-Z0-9-]+$/
          return pattern.test(value) || '入力が不正です'
        },
        amountLimit: (value) => !!value || '金額を入力してください',
        amountInput: (value) => {
          const pattern = /^[0-9.]+$/
          return pattern.test(value) || '入力が不正です'
        },
        messageRules: (value) => (value.length <= 1024) || '最大文字数を超えています。'
      }
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
    watch: {
      senderAddr (val) {
        this.showFee()
      },
      amount (val) {
        this.showFee()
      },
      message (val) {
        this.showFee()
      }
    },
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          console.log('submit')
          this.senderAddr = this.senderAddr.replace(/-/g, '')
          console.log(this.senderAddr)
        }
      },
      clear () {
        this.senderAddr = ''
        this.message = ''
        this.selectMosaic = 'nem:xem'
        this.amount = 0
        this.fee = 0
        // this.$refs.form.reset()
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
      showFee () {
        if ((this.rules.senderAddrLimit(this.senderAddr) === true) &&
            (this.rules.senderAddrInput(this.senderAddr) === true)) {
          console.log('amount OK')
          this.fee = nemWrapper.getFeeTransferXem(this.senderAddr, this.amount, this.message)
        }
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
