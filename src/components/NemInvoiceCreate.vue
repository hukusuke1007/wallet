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
              <v-card flat>
              <div class="sideOffset">
                <v-form v-model="valid" ref="form" lazy-validation>
                  <v-text-field
                    label="請求書名"
                    v-model="name"
                    :counter="40"
                    required
                    placeholder="例. お菓子"
                  ></v-text-field>
                  <v-layout row wrap>
                    <v-flex>
                    <v-text-field
                      label="送金先"
                      v-model="senderAddr"
                      :rules="[]"
                      :counter="40"
                      required
                      placeholder="例. NBHWRG6STRXL2FGLEEB2UOUCBAQ27OSGDTO44UFC"
                    ></v-text-field>
                    </v-flex>
                    <v-flex>
                      <v-select
                      :items="myAccountItems"
                      label="ウォレットから選択"
                      v-model="selectMyAccount"
                      prepend-icon="credit_card"></v-select>
                    </v-flex>
                  </v-layout>
                </v-form>
              </div>
              </v-card>
            </v-flex>

           <!--  通貨 -->
           <v-flex>
            <v-card flat>
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
                    :label="amountLabel"
                    v-model="amount"
                    :rules="[rules.amountLimit, rules.amountInput]"
                    type="number"
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
                      :label="`送金量 (${item.name})`"
                      v-model="item.sendAmount"
                      type="number"
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
            <v-card flat>
            <div class="sideOffset">
              <v-text-field
                label="メッセージ"
                v-model="message"
                :rules="[rules.messageRules]"
                :counter="1024"
                placeholder="例. 商品番号XXX-XXXX"
              ></v-text-field>
              <v-btn color="select" class="buttonFont white--text" @click="submit" :disabled="!valid">完了</v-btn>
              <v-btn class="buttonFont" @click="clear">クリア</v-btn>
            </div>
            </v-card>
          </v-flex>
        </v-layout>
          <!-- プログレス -->
          <ProgressCircular v-bind:isShowVal="isShowProgress"></ProgressCircular>

          <!-- 完了ダイアログ -->
          <DialogConfirm v-bind:dialogVal="isShowDialogConfirm"
                         titleVal="請求書"
                         v-bind:messageVal="dialogMessage"
                         v-on:dialog-confirm-event-tap-positive="tapConfirm"></DialogConfirm>
          <!-- QRコードダイアログ -->
          <DialogQRreader v-bind:dialogVal="isShowDialogQRreader"
                          v-bind:pauseVal="paused"
                          typeVal="invoice"
                          v-on:qr-reader-event-scan-success="getQRContent"
                          v-on:qr-reader-event-tap-close="tapQRClose"></DialogQRreader>
          <!-- 請求書表示 -->
          <NemInvoiceShow v-bind:dialogVal="isShowNemInvoice"
                        v-bind:id="selectItem.id"
                        v-bind:invoiceData="invoiceData"
                        v-bind:num="num"
                        v-on:dialog-nem-invoice-show-event-close="tapCloseInvoiceShow"></NemInvoiceShow>
      </div>
    </v-container>
  </v-card>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import DialogConfirm from '@/components/DialogConfirm'
  import DialogQRreader from '@/components/QRreader'
  import ProgressCircular from '@/components/ProgressCircular'
  import ModelInvoice from '@/js/model/model_invoice'
  import NemInvoiceShow from '@/components/NemInvoiceShow'

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
      message: '',
      senderAddr: '',
      myAccountItems: [
        { id: -1, text: 'なし', address: '' }
      ],
      currencyItems: [
        { id: 0, text: 'NEM' },
        { id: 1, text: 'JPY' }
        // { id: 2, text: 'Mosaics' }
      ],
      selectMyAccount: {},
      selectCurrency: {},
      designItem: {},
      createDate: null,
      // isShowDialogPositiveNegative: false,
      // dialogPositiveNegativeMessage: '',
      isShowDialogConfirm: false,
      dialogMessage: '作成しました。',
      isShowDialogQRreader: false,
      paused: true,
      content: '',
      isShowProgress: false,
      isError: false,
      isShowNemInvoice: false,
      selectItem: [],
      num: 1,
      invoiceData: {},
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
      // 'dialogPositiveNegative': DialogPositiveNegative,
      DialogConfirm,
      DialogQRreader,
      ProgressCircular,
      NemInvoiceShow
    },
    mounted () {
      this.reloadItem()
    },
    props: {
      id: {
        type: Number,
        default: -1
      },
      kind: {
        type: String,
        default: ''
      }
    },
    watch: {
      senderAddr (val) {
      },
      amount (val) {
      },
      message (val) {
      },
      mosaics (after, before) {
        console.log(after)
        console.log(before)
      },
      selectMyAccount (val) {
        if (val.id === -1) {
          this.senderAddr = ''
        } else {
          this.senderAddr = val.address
        }
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
          this.senderAddr = this.senderAddr.replace(/-/g, '')
          console.log('NemInvoiceCreate: ' + this.senderAddr)
          nemWrapper.getStatus(this.senderAddr)
            .then((result) => {
              console.log(result)
              let id = Number.parseInt(this.id)
              let storeData = new ModelInvoice()
              if ((this.selectCurrency.id === 0) || (this.selectCurrency.id === 1)) {
                storeData.id = id
                storeData.name = this.name
                storeData.message = this.message
                storeData.senderAddr = this.senderAddr
                storeData.currencyItem = this.selectCurrency
                storeData.amount = Number(this.amount)
                if (this.createDate === null) {
                  storeData.createDate = new Date()
                } else {
                  storeData.createDate = this.createDate
                }
                storeData.updateDate = new Date()
              }
              console.log('NemInvoiceCreate:setItemArray' + id)
              if (this.kind === 'show_only') {
                this.invoiceData = storeData
                this.isShowNemInvoice = true
              } else {
                dbWrapper.setItemArray(dbWrapper.KEY_INVOICE, storeData, id)
                  .then((result) => {
                    console.log(result)
                    this.isError = false
                    this.isShowDialogConfirm = true
                    if (this.id !== -1) {
                      this.dialogMessage = '請求書を変更しました。'
                    } else {
                      this.dialogMessage = '請求書を作成しました。'
                    }
                  }).catch((err) => {
                    console.log(err)
                    this.isError = true
                    this.isShowDialogConfirm = true
                    this.dialogMessage = 'ERROR:データ保存に失敗しました。'
                  })
              }
            }).catch((err) => {
              console.log(err)
              this.isError = true
              this.isShowDialogConfirm = true
              this.dialogMessage = 'ERROR:送金先アドレスが正しくありません。'
            })
        }
      },
      clear () {
        this.invoiceName = ''
        this.senderAddr = ''
        this.message = ''
        this.amount = 0
      },
      clearMosaic () {
        this.invoiceName = ''
        this.senderAddr = ''
        this.message = ''
        this.amount = 0
        this.mosaics.forEach((element) => {
          element.sendAmount = 0
        })
      },
      reloadItem () {
        this.mosaics = []
        this.myAccountItems = [ { id: -1, text: 'なし', address: '' } ]
        this.selectMyAccount = this.myAccountItems[0]
        let id = Number.parseInt(this.id)
        console.log('NemInvoiceCreate:reloadItem: ' + id)
        if (id === -1) {
          this.selectCurrency = this.currencyItems[0]
        } else {
          dbWrapper.getItemArray(dbWrapper.KEY_INVOICE, id)
            .then((result) => {
              this.name = result.name
              this.message = result.message
              this.senderAddr = result.senderAddr
              this.amount = result.amount
              this.mosaics = result.mosaics
              this.num = result.num
              this.designItem = result.designItem
              this.createDate = result.createDate
              // こうしないとselectに反映されない..?
              switch (result.currencyItem.id) {
                case 0: this.selectCurrency = this.currencyItems[0]
                  break
                case 1: this.selectCurrency = this.currencyItems[1]
                  break
                case 2: this.selectCurrency = this.currencyItems[2]
                  break
              }
            }).catch((err) => {
              console.log(err)
            })
        }
        dbWrapper.getItemArray(dbWrapper.KEY_WALLET_INFO, dbWrapper.VALUE_ALL)
          .then((result) => {
            result.forEach((element) => {
              let item = {
                id: element.id,
                text: element.name,
                address: element.account.address.value
              }
              this.myAccountItems.push(item)
            })
          }).catch((err) => {
            console.log(err)
          })
      },
      tapConfirm (message) {
        if (this.isShowDialogConfirm === true) {
          this.isShowDialogConfirm = false
          if (this.isError === false) { this.$router.push({ name: 'InvoiceList' }) }
        }
      },
      showQRreader () {
        this.paused = false
        this.isShowDialogQRreader = true
      },
      getQRContent (content) {
        console.log(content)
        if ((content !== null) && ('data' in content)) {
          this.name = content.data.name
          this.senderAddr = content.data.addr
          if ('office_nem' in content.data) {
            this.amount = content.data.office_nem.amount
            this.selectCurrency = this.currencyItems[1]
          } else if ('amount' in content.data) {
            this.amount = Number(content.data.amount) / Math.pow(10, 6)
            this.selectCurrency = this.currencyItems[0]
          } else {
            this.amount = 0
            this.selectCurrency = this.currencyItems[0]
          }
          this.message = content.data.msg
          this.paused = true
          this.isShowDialogQRreader = false
        }
      },
      tapQRClose (message) {
        if (this.isShowDialogQRreader === true) {
          console.log(message)
          this.paused = true
          this.isShowDialogQRreader = false
        }
      },
      tapCloseInvoiceShow () {
        this.isShowNemInvoice = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
