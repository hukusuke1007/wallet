<template>
  <v-card flat>
      <v-container
        fluid
        style="min-height: 0;"
        grid-list-lg
        >
        <div class="w-break">
          <v-layout row wrap column>
            <v-flex>
              <v-card flat>
              <div class="sideOffset">
                <v-form v-model="valid" ref="form" lazy-validation>
                  <v-text-field
                    label="送金先"
                    v-model="senderAddr"
                    :rules="[]"
                    :counter="40"
                    required
                    placeholder="例. NBHWRG6STRXL2FGLEEB2UOUCBAQ27OSGDTO44UFC"
                  ></v-text-field>
                  <v-text-field
                    label="メッセージ"
                    v-model="message"
                    :rules="[rules.messageRules]"
                    :counter="1024"
                    placeholder="メッセージを付与すると手数料が加算されます"
                  ></v-text-field>
                </v-form>
              </div>
              </v-card>
            </v-flex>

           <!--  NEM -->
           <v-flex>
            <v-card>
              <div class="sideOffset">
              <v-card-title primary-title><h2 style="color: green">NEM</h2></v-card-title>
              <div class="subTitle">残高</div>
              <v-card-text>
                <h2 class="font-color-shamrock">{{ nemBalance }} xem</h2>
              </v-card-text>
              <div><font color="gray">時価総額: {{ totalJpyXem }} 円</font></div>
              <div><font color="gray">レート: {{ rateJpyXem }} 円/XEM</font></div>
              <v-form v-model="validNem" ref="formNem" lazy-validation>
                <v-text-field
                  box
                  :label="amountLabel"
                  v-model="amount"
                  :rules="[rules.amountLimit, rules.amountInput]"
                  type="number"
                  required
                ></v-text-field>
              </v-form>
              <v-flex>
               <div class="grey--text" style="font-size: 1.2em;">手数料 {{ fee }} xem</div>
              </v-flex>
              <v-btn color="orange darken-1" class="white--text" @click.stop="showQRreader" block>QRコード読み取り</v-btn>
              <v-btn color="select" class="buttonFont white--text" @click="submit" :disabled="!valid">送金</v-btn>
              <v-btn class="buttonFont" @click="clear">クリア</v-btn>
            </div>
            </v-card>
          </v-flex>

          <!--  モザイク -->
          <v-flex>
            <v-card>
            <div class="sideOffset">
              <v-card-title primary-title><h2 style="color: blue">モザイク</h2></v-card-title>
              <v-form v-model="validMosaic" ref="formMosaic" lazy-validation>
                <div v-for="item in senderMosaics" :key="item.id">
                   <div class="subTitle">残高 ({{ item.namespaceId }})</div>
                   <v-card-text>
                    <h2 class="font-color-shamrock">{{ item.quantity }} {{ item.name }}</h2>
                  </v-card-text>
                   <v-text-field
                    :label="`送金量 (${item.name})`"
                    v-model="item.sendAmount"
                    :rules="[rules.amountLimit, rules.amountInput]"
                    type="number"
                   ></v-text-field>
                </div>
              </v-form>
              <div v-show="mosaics">
                <v-flex>
                 <div class="grey--text" style="font-size: 1.2em;">手数料 {{ feeMosaics }} xem</div>
                </v-flex>
                <v-btn color="select" class="buttonFont white--text" @click="submitMosaic" :disabled="!valid">送金</v-btn>
                <v-btn class="buttonFont" @click="clearMosaic">クリア</v-btn>
              </div>
            </div>
            </v-card>
          </v-flex>
        </v-layout>
          <!-- プログレス -->
          <progressCircular v-bind:isShowVal="isShowProgress"></progressCircular>

          <!-- 送金確認ダイアログ -->
          <dialogPositiveNegative v-bind:dialogVal="isShowDialogPositiveNegative"
                         titleVal="送金確認"
                         v-bind:messageVal="dialogPositiveNegativeMessage"
                         positiveVal="送金する"
                         negativeVal="いいえ"
                         v-on:dialog-positive-negative-event-tap="tapSendPositiveNegative"></dialogPositiveNegative>
          <!-- 完了ダイアログ -->
          <dialogConfirm v-bind:dialogVal="isShowDialogConfirm"
                         v-bind:titleVal="dialogTitle"
                         v-bind:messageVal="dialogMessage"
                         v-on:dialog-confirm-event-tap-positive="tapConfirm"></dialogConfirm>
          <!-- QRコードダイアログ -->
          <dialogQRreader v-bind:dialogVal="isShowDialogQRreader"
                          v-bind:pauseVal="paused"
                          typeVal="invoice"
                          v-on:qr-reader-event-scan-success="getQRContent"
                          v-on:qr-reader-event-tap-close="tapQRClose"></dialogQRreader>
      </div>
    </v-container>
  </v-card>
</template>

<script>
  // import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import DialogPositiveNegative from '@/components/DialogPositiveNegative'
  import DialogConfirm from '@/components/DialogConfirm'
  import DialogQRreader from '@/components/QRreader'
  import ProgressCircular from '@/components/ProgressCircular'
  import exWrapper from '@/js/exchange_wrapper'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data: () => ({
      valid: false,
      validNem: false,
      validMosaic: false,
      trMosaics: { item: [], other: [] },
      amountLabel: '送金量 (xem)',
      amount: 0,
      fee: 0,
      feeMosaics: 0,
      message: '',
      senderAddr: '',
      senderMosaics: [],
      isShowDialogPositiveNegative: false,
      dialogPositiveNegativeMessage: '',
      isShowDialogConfirm: false,
      dialogTitle: '送金',
      dialogMessage: '送金しました。',
      transactionType: 'nem',
      isShowDialogQRreader: false,
      paused: true,
      content: '',
      isShowProgress: false,
      totalJpyXem: 0,
      rateJpyXem: 0,
      isError: false,
      rules: {
        senderAddrLimit: (value) => (value && (value.length === 46 || value.length === 40)) || '送金先アドレス(-除く)は40文字です。',
        senderAddrInput: (value) => {
          const pattern = /^[a-zA-Z0-9-]+$/
          return pattern.test(value) || '入力が不正です'
        },
        amountLimit: (value) => (value >= 0) || '金額を入力してください',
        amountInput: (value) => {
          const pattern = /^[0-9.]+$/
          return (pattern.test(value) && !isNaN(Number(value))) || '入力が不正です'
        },
        messageRules: (value) => (value.length <= 1024) || '最大文字数を超えています。'
      }
    }),
    computed: {
      ...mapGetters('Nem', ['walletItem', 'pairKey', 'nemBalance', 'mosaics', 'transactionStatus', 'isLoading'])
    },
    components: {
      'dialogPositiveNegative': DialogPositiveNegative,
      'dialogConfirm': DialogConfirm,
      'dialogQRreader': DialogQRreader,
      'progressCircular': ProgressCircular
    },
    mounted () {
      this.reloadItem()
      exWrapper.getRateJpyXem()
        .then((result) => {
          console.log('rateJpyXem: ' + result)
          this.rateJpyXem = Math.round(result * 1000) / 1000
        }).catch((err) => {
          console.error(err)
        })
    },
    props: {
      id: {
        type: Number,
        default: -1
      }
    },
    watch: {
      senderAddr (val) {
        this.showFee()
        this.showFeeMosaics(false)
      },
      amount (val) {
        this.showFee()
      },
      message (val) {
        this.showFee()
        this.showFeeMosaics(false)
      },
      mosaics (after, before) {
        console.log(after)
        console.log(before)
        this.reloadItem()
      },
      rateJpyXem (val) {
        this.totalJpyXem = nemWrapper.getTotalAmountJpyXem(this.nemBalance, val, 0)
      },
      nemBalance (val) {
        this.totalJpyXem = nemWrapper.getTotalAmountJpyXem(val, this.rateJpyXem, 0)
      }
    },
    methods: {
      ...mapActions('Nem', ['doUpdateNemBalance', 'doUpdateMosaicsBalance', 'doObserveTransaction', 'doTransactionStatus']),
      submit () {
        if (this.$refs.form.validate() && this.$refs.formNem.validate() && (this.amount > 0)) {
          console.log('submit')
          this.transactionType = 'nem'
          this.senderAddr = this.senderAddr.replace(/-/g, '')
          console.log(this.senderAddr)
          let total = Number(this.amount) + Number(this.fee)
          let n = 6 // 下6桁まで残す.
          total = Math.floor(total * Math.pow(10, n)) / Math.pow(10, n)
          if (Number(this.nemBalance) < total) {
            this.isError = true
            this.dialogTitle = '送金エラー'
            this.dialogMessage = 'NEMの残高が足りません。'
            this.isShowDialogConfirm = true
          } else {
            this.isError = false
            this.dialogPositiveNegativeMessage = '送金しますか？<br><br>' +
              '送金量:<br>' + this.amount + ' xem' + '<br>' +
              '手数量:<br>' + this.fee + ' xem' + '<br>' +
              '合計:<br>' + total + ' xem' + '<br><br>' +
              '送金先:<br>' + this.senderAddr + '<br><br>' +
              'メッセージ:<br>' + this.message
            this.isShowDialogPositiveNegative = true
          }
        } else {
          this.isError = true
          this.dialogTitle = '送金エラー'
          this.dialogMessage = '記入欄を確認してください。'
          this.isShowDialogConfirm = true
        }
      },
      clear () {
        this.senderAddr = ''
        this.message = ''
        this.amount = 0
        this.fee = 0
      },
      clearMosaic () {
        this.senderAddr = ''
        this.message = ''
        this.fee = 0
        this.senderMosaics.forEach((element) => {
          element.sendAmount = 0
        })
      },
      submitMosaic () {
        if (this.$refs.form.validate() && (this.senderAddr !== '')) {
          if (Number(this.nemBalance) === 0) {
            this.isError = true
            this.dialogTitle = '送金エラー'
            this.dialogMessage = 'NEMの残高が足りません。モザイク送信時はNEMの手数料が必要です。'
            this.isShowDialogConfirm = true
          } else {
            console.log('submitMosaic')
            this.transactionType = 'mosaics'
            this.trMosaics = { item: [], other: [] }
            this.senderAddr = this.senderAddr.replace(/-/g, '')
            // validation
            let mlist = []
            this.senderMosaics.forEach((element) => {
              let tmp = {
                namespaceId: element.namespaceId,
                name: element.name,
                quantity: element.sendAmount
              }
              let msgLimit = this.rules.amountLimit(element.sendAmount)
              let msgInput = this.rules.amountInput(element.sendAmount)
              let msgOver = true
              if (Number(element.sendAmount) > Number(element.amount)) { msgOver = '残高が足りません。' }
              console.log(element.sendAmount + '>' + element.amount)
              if (msgLimit !== true) { tmp.errLimit = msgLimit }
              if (msgInput !== true) { tmp.errInput = msgInput }
              if (msgOver !== true) { tmp.errOver = msgOver }
              mlist.push(tmp)
            })

            // エラー以外のデータを入れる.
            mlist.forEach((element) => {
              console.log(element)
              if (!('errLimit' in element) && !('errInput' in element) && !('errOver' in element)) {
                if (element.quantity !== 0) {
                  let item = {
                    namespaceId: element.namespaceId,
                    name: element.name,
                    quantity: element.quantity
                  }
                  this.trMosaics.item.push(item)
                }
              }
            })
            console.log(this.trMosaics)
            if (this.trMosaics.item.length !== 0) {
              this.isError = false
              this.showFeeMosaics(true)
            } else {
              console.log('error')
              this.isError = true
              this.dialogTitle = '送金エラー'
              this.dialogMessage = 'モザイクの入力欄を確認してください。'
              this.isShowDialogConfirm = true
            }
          }
        } else {
          this.isError = true
          this.dialogTitle = '送金エラー'
          this.dialogMessage = '記入欄を確認してください。'
          this.isShowDialogConfirm = true
        }
      },
      reloadItem () {
        this.senderMosaics = []
        this.mosaics.forEach((element) => {
          let item = {
            namespaceId: element.namespaceId,
            name: element.name,
            quantity: element.amount,
            sendAmount: 0
          }
          this.senderMosaics.push(item)
        })
      },
      showFee () {
        if ((this.rules.senderAddrLimit(this.senderAddr) === true) &&
            (this.rules.senderAddrInput(this.senderAddr) === true)) {
          console.log('showFee OK')
          this.fee = nemWrapper.getFeeTransferXem(this.senderAddr, this.amount, this.message)
        }
      },
      showFeeMosaics (isShowSendMosaic) {
        if ((this.rules.senderAddrLimit(this.senderAddr) === true) &&
            (this.rules.senderAddrInput(this.senderAddr) === true)) {
          console.log('showFeeMosaics OK')
          nemWrapper.getFeeTransferMosaics(this.senderAddr, this.trMosaics.item, this.message)
            .then((result) => {
              this.feeMosaics = result
              console.log(this.feeMosaics)
              if (isShowSendMosaic) {
                this.showSendMosaicConfirm(this.feeMosaics)
              }
            }).catch((err) => {
              console.error(err)
              this.feeMosaics = 0
            })
        }
      },
      showSendMosaicConfirm (feeMosaics) {
        this.dialogPositiveNegativeMessage = 'モザイクを送金しますか？<br><br>'
        this.trMosaics.item.forEach((element) => {
          let message = '[' + element.namespaceId + ':' + element.name + ']' + '<br>' +
                   '送金量:<br>' + element.quantity + ' ' + element.name + '<br><br>'
          this.dialogPositiveNegativeMessage += message
        })
        this.dialogPositiveNegativeMessage += '手数量:<br>' + feeMosaics + ' xem' + '<br><br>' +
          '送金先:<br>' + this.senderAddr + '<br><br>' + 'メッセージ:<br>' + this.message
        this.isShowDialogPositiveNegative = true
      },
      tapSendPositiveNegative (isPositive, message) {
        if (this.isShowDialogPositiveNegative === true) {
          if (isPositive) {
            console.log(message)
            this.sendTransaction()
          } else {
            console.log(message)
          }
          this.isShowDialogPositiveNegative = false
        }
      },
      tapConfirm (message) {
        console.log(message)
        if (this.isShowDialogConfirm === true) {
          if (this.isError === false) {
            this.clear()
            this.clearMosaic()
          }
          this.isShowDialogConfirm = false
        }
      },
      showQRreader () {
        this.paused = false
        this.isShowDialogQRreader = true
      },
      getQRContent (content) {
        this.senderAddr = content.data.addr
        this.message = content.data.msg
        if ('office_nem' in content.data) {
          this.isShowProgress = true
          exWrapper.getRateJpyXem()
            .then((result) => {
              this.rateJpyXem = result
              this.amount = nemWrapper.getTotalAmountXemJpy(content.data.office_nem.amount, this.rateJpyXem, 6)
              this.isShowProgress = false
            }).catch((err) => {
              console.error(err)
              this.isShowProgress = false
            })
        } else {
          if ('amount' in content.data) {
            this.amount = Number(content.data.amount) / Math.pow(10, 6)
          } else {
            this.amount = 0
          }
          // モザイク(オリジナルQR仕様)
          if ('mosaics' in content.data) {
            let mosaics = content.data.mosaics
            mosaics.forEach((data) => {
              this.senderMosaics.forEach((element) => {
                if ((data.namespaceId === element.namespaceId) && (data.name === element.name)) {
                  element.amount = data.amount / Math.pow(10, Number(element.divisibility))
                }
              })
            })
          }
        }
        this.paused = true
        this.isShowDialogQRreader = false
      },
      tapQRClose (message) {
        if (this.isShowDialogQRreader === true) {
          console.log(message)
          this.paused = true
          this.isShowDialogQRreader = false
        }
      },
      sendTransaction () {
        let successMsg = '送金しました。<br>反映されるまで数分かかることがあります。' + '<br><br>'
        let errorMsg = 'ERROR:入力欄を確認してください。'
        this.isShowProgress = true
        if (this.transactionType === 'nem') {
          // NEM送金
          console.log('nem')
          nemWrapper.transferTransaction(this.senderAddr, this.amount, this.message, this.pairKey.privateKey)
            .then((result) => {
              console.log(result)
              this.dialogTitle = '送金'
              if (result.message === 'SUCCESS') {
                this.dialogMessage = successMsg + 'Hash:<br>' + result.transactionHash.data + '<br>'
              } else {
                this.dialogMessage = result.message
              }
              this.isShowProgress = false
              this.isShowDialogConfirm = true
            }).catch((err) => {
              this.isError = true
              this.dialogTitle = '送金エラー'
              this.dialogMessage = errorMsg
              this.isShowProgress = false
              this.isShowDialogConfirm = true
              console.error(err.error.message)
            })
        } else if (this.transactionType === 'mosaics') {
          // モザイク送金
          console.log('mosaics')
          nemWrapper.transferTransactionMosaics(this.senderAddr, this.trMosaics.item, this.message, this.pairKey.privateKey)
            .then((result) => {
              console.log(result)
              this.dialogTitle = '送金'
              if (result.message === 'SUCCESS') {
                this.dialogMessage = successMsg + 'Hash:<br>' + result.transactionHash.data + '<br>'
              } else {
                this.dialogMessage = result.message
              }
              this.isShowProgress = false
              this.isShowDialogConfirm = true
            }).catch((err) => {
              this.isError = true
              this.dialogTitle = '送金エラー'
              this.dialogMessage = errorMsg
              this.isShowProgress = false
              this.isShowDialogConfirm = true
              console.error(err.error.message)
            })
        } else {
          console.log(this.transactionType)
          this.isShowProgress = false
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.feeLabel {
 font-size: 1.0em;
 position: absolute;
 color: #b2bec3;
 left: 40px;
}
</style>
