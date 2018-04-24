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
              <v-card>
              <div class="sideOffset">
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
                    multi-line
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
              <v-subheader>残高</v-subheader><v-card-text><h3 class="font-color-shamrock">{{ balance }} xem</h3></v-card-text>
              <v-form v-model="validNem" ref="formNem" lazy-validation>
                <v-text-field
                  box
                  :label="amountLabel"
                  v-model="amount"
                  :rules="[rules.amountLimit, rules.amountInput]"
                  required
                ></v-text-field>
                <v-text-field
                  label="手数料(xem)"
                  v-model="fee"
                  required
                  disabled
                ></v-text-field>
              </v-form>
              <v-btn color="orange darken-1" class="white--text" @click.stop="showQRreader" block>QRコード読み取り</v-btn>
              <br>
              <v-btn color="info" @click="submit" :disabled="!valid">送金</v-btn>
              <v-btn @click="clear">クリア</v-btn>
            </div>
            </v-card>
          </v-flex>

          <!--  モザイク -->
          <v-flex>
            <v-card>
            <div class="sideOffset">
              <v-card-title primary-title><h2 style="color: blue">モザイク</h2></v-card-title>
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
              <v-text-field
                  label="手数料(xem)"
                  v-model="fee"
                  required
                  disabled
              ></v-text-field>
              <v-btn color="info" @click="submitMosaic" :disabled="!valid">送金</v-btn>
              <v-btn @click="clearMosaic">クリア</v-btn>
            </div>
            </v-card>
          </v-flex>
        </v-layout>
          <!--
          <div v-if="selectMosaic">
            <v-subheader>モザイク残高 ({{ selectMosaic.namespaceId }})</v-subheader>
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
          <v-flex>
            <v-btn color="orange darken-1" class="white--text" @click.stop="showQRreader" block>QRコード読み取り</v-btn>
          </v-flex>
          <br>
          <v-flex>
            <v-btn color="info" @click="submit" :disabled="!valid">送金</v-btn>
            <v-btn @click="clear">クリア</v-btn>
          </v-flex>
          -->
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

  export default {
    data: () => ({
      valid: false,
      validNem: false,
      validMosaic: false,
      date: '',
      balance: 0,
      name: '',
      mosaics: [],
      selectMosaic: null,
      amountLabel: '送金量 (xem)',
      amount: 0,
      fee: 0,
      message: '',
      senderAddr: '',
      publicKey: '',
      privateKey: '',
      isShowDialogPositiveNegative: false,
      dialogPositiveNegativeMessage: '',
      isShowDialogConfirm: false,
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
          return (pattern.test(value) && !isNaN(Number(value))) || '入力が不正です'
        },
        messageRules: (value) => (value.length <= 1024) || '最大文字数を超えています。'
      }
    }),
    components: {
      'dialogPositiveNegative': DialogPositiveNegative,
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
      },
      selectMosaic (val) {
        this.amountLabel = '送金量 (' + val.name + ')'
      },
      id (val) {
        this.reloadItem()
      }
    },
    methods: {
      submit () {
        if (this.$refs.form.validate() && this.$refs.formNem.validate()) {
          console.log('submit')
          this.senderAddr = this.senderAddr.replace(/-/g, '')
          console.log(this.senderAddr)
          let total = Number(this.amount) + Number(this.fee)
          let n = 6 // 下6桁まで残す.
          total = Math.floor(total * Math.pow(10, n)) / Math.pow(10, n)
          if (Number(this.balance) < total) {
            this.dialogMessage = '残高が足りません。'
            this.isShowDialogConfirm = true
          } else {
            this.dialogPositiveNegativeMessage = '送金しますか？<br><br>' +
              '送金量:<br>' + this.amount + ' xem' + '<br>' +
              '手数量:<br>' + this.fee + ' xem' + '<br>' +
              '合計:<br>' + total + ' xem' + '<br><br>' +
              '送金先:<br>' + this.senderAddr + '<br><br>' +
              'メッセージ:<br>' + this.message
            this.isShowDialogPositiveNegative = true
          }
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
      submitMosaic () {
        if (this.$refs.form.validate()) {
          console.log('submitMosaic')
          this.senderAddr = this.senderAddr.replace(/-/g, '')
          console.log(this.senderAddr)
          let total = Number(this.amount) + Number(this.fee)
          let n = 6 // 下6桁まで残す.
          total = Math.floor(total * Math.pow(10, n)) / Math.pow(10, n)
          console.log(total)
          this.mosaics.forEach((element) => {
            console.log(element.sendAmount)
          })
        }
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
            this.privateKey = pairKey[nemWrapper.PRIVATE_KEY]
            // 残高取得
            nemWrapper.getAccountFromPublicKey(this.publicKey)
              .then((result) => {
                this.balance = result.balance.balance / nemWrapper.NEM_UNIT
              })
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
                  mosaic.divisibility = element.properties.divisibility
                  mosaic.initialSupply = element.properties.initialSupply
                  mosaic.supplyMutable = element.properties.supplyMutable
                  mosaic.transferable = element.properties.transferable
                  this.mosaics.push(mosaic)
                })
                this.selectMosaic = this.mosaics[0]
              }).catch((err) => {
                console.log('get_mosaic_error: ' + err)
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
        nemWrapper.transferTransaction(this.senderAddr, this.amount, this.message, this.privateKey)
          .then((result) => {
            console.log(result)
            if (result.message === 'SUCCESS') {
              this.dialogMessage = '送金しました。<br>反映されるまで数分かかることがあります。' + '<br><br>' +
                'Hash:<br>' + result.transactionHash.data + '<br>'
            } else {
              this.dialogMessage = '送金エラー' + '<br><br>' +
                'メッセージ:<br>' + result.message + '<br>'
            }
            this.isShowDialogConfirm = true
          }).catch((err) => {
            console.error(err)
            let error = err.error.message
            this.dialogMessage = '送金エラー' + '<br><br>' +
                'メッセージ:<br>' + error + '<br>'
            this.isShowDialogConfirm = true
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.sideOffset {
  margin: 0px 10px 0px 10px;
}
</style>
