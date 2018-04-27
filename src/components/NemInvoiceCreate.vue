<template>
  <v-card flat>
      <v-container
        fluid
        style="min-height: 0;"
        grid-list-lg
        >
        <div class="w-break">
          <v-layout row wrap column>
            <!--  請求書情報 -->
            <v-flex>
              <v-card>
              <div class="sideOffset">
                <v-form v-model="valid" ref="form" lazy-validation>
                  <v-text-field
                    box
                    label="請求書名"
                    v-model="invoiceName"
                    :counter="40"
                    required
                    placeholder="例. お菓子"
                  ></v-text-field>
                  <v-text-field
                    box
                    label="送金先"
                    v-model="senderAddr"
                    :rules="[rules.senderAddrLimit, rules.senderAddrInput]"
                    :counter="40"
                    required
                    placeholder="例. NBHWRG6STRXL2FGLEEB2UOUCBAQ27OSGDTO44UFC"
                  ></v-text-field>
                </v-form>
              </div>
              </v-card>
            </v-flex>

           <!--  通貨 -->
           <v-flex>
            <v-card>
              <div class="sideOffset">
              <v-flex justify-center>
                <v-select
                  :items="currencyItems"
                  label="通貨"
                  v-model="selectCurrency"
                  prepend-icon="view_quilt"></v-select>
              </v-flex>
              <div v-if="selectCurrency.id===0||selectCurrency.id===1">
                <v-form v-model="validCurrency" ref="formCurrency" lazy-validation>
                  <v-text-field
                    box
                    :label="amountLabel"
                    v-model="amount"
                    :rules="[rules.amountLimit, rules.amountInput]"
                    required
                  ></v-text-field>
                </v-form>
              </div>
              <div v-else>
                <v-card-title primary-title><h2 style="color: blue">Mosaics</h2></v-card-title>
                <v-form v-model="validMosaic" ref="formMosaic" lazy-validation>
                  <div v-for="item in mosaics" :key="`mosaic-${item.index}`">
                     <v-card-title >{{ item.text }}</v-card-title>
                     <v-subheader>残高 ({{ item.namespaceId }})</v-subheader>
                     <v-card-text><h3 class="font-color-shamrock">{{ item.amount }} {{ item.name }}</h3></v-card-text>
                     <v-text-field
                     box
                      :label="`送金量 (${item.name})`"
                      v-model="item.sendAmount"
                      :rules="[rules.amountLimit, rules.amountInput]"
                     ></v-text-field>
                  </div>
                </v-form>
              </div>
              <v-btn color="orange darken-1" class="white--text" @click.stop="showQRreader" block>QRコード読み取り</v-btn>
              <br>
            </div>
            </v-card>
          </v-flex>

          <!--  メッセージ -->
          <v-flex>
            <v-card>
            <div class="sideOffset">
              <v-text-field
                box
                multi-line
                label="メッセージ"
                v-model="message"
                :rules="[rules.messageRules]"
                :counter="1024"
                placeholder="例. 商品番号XXX-XXXX"
              ></v-text-field>
              <v-btn color="info" @click="submit" :disabled="!valid">完了</v-btn>
              <v-btn @click="clear">クリア</v-btn>
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
                         titleVal="送金"
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
  import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import DialogPositiveNegative from '@/components/DialogPositiveNegative'
  import DialogConfirm from '@/components/DialogConfirm'
  import DialogQRreader from '@/components/QRreader'
  import ProgressCircular from '@/components/ProgressCircular'

  export default {
    data: () => ({
      valid: false,
      validCurrency: false,
      validMosaic: false,
      date: '',
      name: '',
      mosaics: [],
      amountLabel: '送金量',
      amount: 0,
      invoiceName: '',
      message: '',
      senderAddr: '',
      publicKey: '',
      currencyItems: [
        { id: 0, text: 'NEM' },
        { id: 1, text: 'JPY' },
        { id: 2, text: 'Mosaics' }
      ],
      selectCurrency: null,
      isShowDialogPositiveNegative: false,
      dialogPositiveNegativeMessage: '',
      isShowDialogConfirm: false,
      dialogMessage: '送金しました。',
      transactionType: 'nem',
      isShowDialogQRreader: false,
      paused: false,
      content: '',
      isShowProgress: false,
      rules: {
        senderAddrLimit: (value) => (value && (value.length === 46 || value.length === 40)) || '送金先アドレス(-除く)は40文字です。',
        senderAddrInput: (value) => {
          const pattern = /^[a-zA-Z0-9-]+$/
          return pattern.test(value) || '入力が不正です'
        },
        amountLimit: (value) => !!value || '金額を入力してください',
        amountInput: (value) => {
          const pattern = /^[0-9.]+$/
          return (pattern.test(value) && !isNaN(Number(value))) || '入力が不正です'
        },
        messageRules: (value) => (value.length <= 1024) || '最大文字数を超えています。'
      }
    }),
    components: {
      'dialogPositiveNegative': DialogPositiveNegative,
      'dialogConfirm': DialogConfirm,
      'dialogQRreader': DialogQRreader,
      'progressCircular': ProgressCircular
    },
    mounted () {
      this.selectCurrency = this.currencyItems[0]
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
      },
      selectCurrency (val) {
        if (val.id === 0) {
          this.amountLabel = '送金量 (xem)'
        } else if (val.id === 1) {
          this.amountLabel = '送金量 (円)'
        }
      },
      id (val) {
        this.reloadItem()
      }
    },
    methods: {
      submit () {
        if (this.$refs.form.validate() && this.$refs.formCurrency.validate()) {
          console.log('submit')
          this.transactionType = 'nem'
          this.senderAddr = this.senderAddr.replace(/-/g, '')
          console.log(this.senderAddr)
          let total = Number(this.amount) + Number(this.fee)
          let n = 6 // 下6桁まで残す.
          total = Math.floor(total * Math.pow(10, n)) / Math.pow(10, n)
          this.dialogPositiveNegativeMessage = '送金しますか？<br><br>' +
            '送金量:<br>' + this.amount + ' xem' + '<br>' +
            '手数量:<br>' + this.fee + ' xem' + '<br>' +
            '合計:<br>' + total + ' xem' + '<br><br>' +
            '送金先:<br>' + this.senderAddr + '<br><br>' +
            'メッセージ:<br>' + this.message
          this.isShowDialogPositiveNegative = true
        }
      },
      clear () {
        this.senderAddr = ''
        this.message = ''
        this.amount = 0
        this.fee = 0
        // this.$refs.form.reset()
        // this.isShowProgress = true // テスト用
      },
      clearMosaic () {
        this.senderAddr = ''
        this.message = ''
        this.fee = 0
        this.mosaics.forEach((element) => {
          element.sendAmount = 0
        })
      },
      reloadItem () {
        this.mosaics = []
        let id = Number.parseInt(this.id)
        // console.log('reloadItem:' + id)
        dbWrapper.getItemArray(dbWrapper.KEY_WALLET_INFO, id)
          .then((result) => {
            this.date = result[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_CREATION_DATE]
            this.name = result[dbWrapper.VALUE_NAME]
            this.address = result[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_ADDRESS]['value']
            let pairKey = nemWrapper.getPairKey(result[dbWrapper.VALUE_WALLET_ACCOUNT])
            this.publicKey = pairKey[nemWrapper.PUBLICK_KEY]
            // モザイク取得.
            nemWrapper.getMosaics(this.address)
              .then((result) => {
                console.log(result)
                result.forEach((element, index) => {
                  let mosaic = {}
                  mosaic.index = index
                  mosaic.text = element.mosaicId.namespaceId + ':' + element.mosaicId.name
                  mosaic.namespaceId = element.mosaicId.namespaceId
                  mosaic.name = element.mosaicId.name
                  mosaic.amount = element.amount
                  mosaic.sendAmount = 0
                  mosaic.divisibility = element.properties.divisibility
                  mosaic.initialSupply = element.properties.initialSupply
                  mosaic.supplyMutable = element.properties.supplyMutable
                  mosaic.transferable = element.properties.transferable
                  this.mosaics.push(mosaic)
                })
              }).catch((err) => {
                console.log('get_mosaic_error: ' + err)
              })
          }).catch((err) => {
            console.log(err)
          })
      },
      showSendMosaicConfirm (feeMosaics) {
        /*
        this.dialogPositiveNegativeMessage = 'モザイクを送金しますか？<br><br>'
        let message = '[' + element.namespace + ':' + element.mosaic + ']' + '<br>' +
                 '送金量:<br>' + element.quantity + ' ' + element.mosaic + '<br><br>'
        this.dialogPositiveNegativeMessage += message

        this.dialogPositiveNegativeMessage += '手数量:<br>' + feeMosaics + ' xem' + '<br><br>' +
          '送金先:<br>' + this.senderAddr + '<br><br>' + 'メッセージ:<br>' + this.message
        this.isShowDialogPositiveNegative = true
        */
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
        if (this.isShowDialogConfirm === true) {
          this.isShowDialogConfirm = false
        }
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
      },
      sendTransaction () {
        // let successMsg = '送金しました。<br>反映されるまで数分かかることがあります。' + '<br><br>'
        // let errorMsg = '送金エラー' + '<br><br>' + 'メッセージ:<br>'
        this.isShowProgress = true
        if (this.transactionType === 'nem') {
          // NEM送金
          console.log('nem')
        } else if (this.transactionType === 'mosaics') {
          // モザイク送金
          console.log('mosaics')
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

</style>
