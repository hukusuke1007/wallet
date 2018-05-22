<template>
  <v-dialog v-model="dialog"
   fullscreen
   hide-overlay
   transition="dialog-bottom-transition"
   scrollable
  >
  <v-card flat class="background">
      <v-toolbar card color="pink accent-1" dark tabs>
        <v-btn icon @click.native="close()" dark>
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="white--text">請求書</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-side-icon @click="download"><v-icon>get_app</v-icon></v-toolbar-side-icon>
        <!-- <v-toolbar-side-icon @click="print"><v-icon>print</v-icon></v-toolbar-side-icon> -->
      </v-toolbar>
      <v-container
        fluid
        style="min-height: 0;"
        grid-list-lg
        >
      <v-flex xs12 sm6 offset-sm3>
        <div class="w-break sideOffset">
          <v-layout wrap column>
            <v-flex>
            <v-card>
            <div ref="invoiceData">
              <div v-if="invoice">
                <v-flex>
                  <div class="itemNum">個数: {{ num }}</div>
                </v-flex>
                <v-flex>
                  <div style="margin-bottom: 10px;"><h3>{{ invoice.name }}</h3></div>
                  <div class="qrlayout"><qriously v-model="qrValue" :size="qrSize"></qriously></div>
                  <div class="sub">通貨: {{ invoice.currencyItem.text }}</div>
                  <div class="amount">{{ amountDisplay }} {{ unitName }}</div>
                  <div class="sub">メッセージ</div>
                  <span style="text-align: center;">{{ invoice.message }}</span>
                </v-flex>
              </div>
             <div v-else>
               <v-card-text>請求書データがありません。</v-card-text>
             </div>
           </div>
           </v-card>
           </v-flex>
           <v-flex>
            <v-card>
              <v-btn color="view white--text" large block @click="share">共有</v-btn>
            </v-card>
          </v-flex>
           <v-flex>
            <v-card>
              <v-btn color="button white--text" large block @click="download">ダウンロード</v-btn>
            </v-card>
          </v-flex>
          </v-layout>
        </div>
      </v-flex>
    </v-container>
  </v-card>
  </v-dialog>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import exWrapper from '@/js/exchange_wrapper'
  import html2canvas from 'html2canvas'
  import Jspdf from 'jspdf'
  // import PrintJS from 'print-js'

  export default {
    data: () => ({
      // image_src: null,
      dialog: false,
      amount: 0,
      amountDisplay: 0,
      amountLabel: '',
      invoice: null,
      unitName: 'XEM',
      currencyItems: [
        { id: 0, text: 'NEM' },
        { id: 1, text: 'JPY' },
        { id: 2, text: 'Mosaics' }
      ],
      isError: false,
      qrSize: 250,
      qrValue: 'test'
    }),
    components: {
    },
    mounted () {
      this.reloadItem()
    },
    props: {
      dialogVal: {
        type: Boolean,
        default: false
      },
      id: {
        type: Number,
        default: -1
      },
      num: {
        type: Number,
        default: 1
      }
    },
    watch: {
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
      },
      dialogVal (val) {
        this.dialog = val
      },
      num (val) {
        this.setDetail()
      }
    },
    methods: {
      reloadItem () {
        let id = Number.parseInt(this.id)
        console.log('NemInvoiceShow:reloadItem: ' + id)
        if (id !== -1) {
          dbWrapper.getItemArray(dbWrapper.KEY_INVOICE, id)
            .then((result) => {
              this.invoice = result
              this.setDetail()
              console.log(this.invoice)
            }).catch((err) => {
              console.log(err)
            })
        }
      },
      setDetail () {
        let result = this.invoice
        this.amount = Number(result.amount) * this.num
        this.amountDisplay = this.amount.toLocaleString()
        if (result.currencyItem.text === 'NEM') {
          // NEM
          this.unitName = 'XEM'
          this.qrValue = nemWrapper.getJSONInvoiceForQRcode(2, 2, result.name, result.senderAddr, this.amount, result.message)
        } else if (result.currencyItem.text === 'JPY') {
          // JPY
          this.unitName = '円'
          this.qrValue = nemWrapper.getJSONInvoiceForQRcodeJPY(2, 2, result.name, result.senderAddr, this.amount, result.message)
          console.log(this.qrValue)
        }
      },
      share () {
        this.imageProcess('share', 'mail')
      },
      download () {
        this.imageProcess('download', 'pdf')
      },
      imageProcess (operate, type) {
        html2canvas(this.$refs.invoiceData)
          .then((canvas) => {
            let dataURI = canvas.toDataURL('image/png')
            if (operate === 'download') {
              this.imageDownload(dataURI, canvas, type)
            } else if (operate === 'share') {
              this.imageShare(dataURI, canvas, type)
            }
          })
      },
      imageDownload (dataURI, canvas, type) {
        // 画像のサイズを取得.
        /*
        let image = new Image()
        let width = 0
        let height = 0
        image.onload = function () {
          width = image.width
          height = image.height
          console.log('imageSize', width, height)
        }
        image.src = dataURI
        */
        // this.image_src = dataURI
        console.log('canvasSize', canvas.height, canvas.width)
        let date = new Date()
        let imageName = 'office_nem_invoice_' + this.id + '_' + date.getTime()
        if (type === 'pdf') {
          let imgWidth = 210
          let pageHeight = 295
          let imgHeight = canvas.height * imgWidth / canvas.width
          let heightLeft = imgHeight
          let position = 2
          let pdf = new Jspdf('p', 'mm')
          pdf.addImage(dataURI, 'PNG', 0, position, imgWidth, imgHeight) // x, yの座標
          heightLeft -= pageHeight
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(dataURI, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
          }
          let fileName = imageName + '.pdf'
          console.log(fileName)
          pdf.save(fileName)
          // let renderString = pdf.output('datauristring')
          // PrintJS(printUrl)
        } else if (type === 'image') {
          let event = document.createEvent('MouseEvents')
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
          let a = document.createElement('a')
          a.href = dataURI
          a.download = imageName
          a.dispatchEvent(event)
        }
      },
      imageShare (dataURI, canvas, type) {
        if (type === 'mail') {
          this.imageDownload(dataURI, canvas, 'image')
          let toAddr = ''
          let subject = this.invoice.name + 'の請求書'
          if (this.invoice.currencyItem.text === 'NEM') {
            let amount = this.amount
            let body = '送金先: ' + this.invoice.senderAddr + '\n' +
                      '請求書名: ' + this.invoice.name + '\n' +
                      '通貨: ' + this.invoice.currencyItem.text + '\n' +
                      '数量: ' + amount + ' ' + this.unitName + '\n' +
                      'メッセージ: ' + this.invoice.message + '\n\n' +
                      '※請求書の画像をダウンロードしました。手動で添付してください。'
            location.href = 'mailto:?to=' + encodeURIComponent(toAddr) +
            '&subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body)
          } else if (this.invoice.currencyItem.text === 'JPY') {
            exWrapper.getRateJpyXem()
              .then((result) => {
                let date = new Date()
                let rateDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/') + ' ' + date.toLocaleTimeString()
                let xemAmount = nemWrapper.getTotalAmountXemJpy(this.amount, result, 6)
                let body = '送金先: ' + this.invoice.senderAddr + '\n' +
                          '請求書名: ' + this.invoice.name + '\n' +
                          '通貨: ' + this.invoice.currencyItem.text + '\n' +
                          '数量: ' + this.amount + ' ' + this.unitName + ' (' + xemAmount + ' XEM' + '  ※' + rateDate + ')' + '\n' +
                          'メッセージ: ' + this.invoice.message + '\n\n' +
                          '※請求書の画像をダウンロードしました。手動で添付してください。'
                location.href = 'mailto:?to=' + encodeURIComponent(toAddr) +
                '&subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body)
              }).catch((err) => {
                console.error(err)
              })
          }
        }
      },
      print () {
      },
      close () {
        console.log('close')
        this.$emit('dialog-nem-invoice-show-event-close', 'close')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.itemNum {
  text-align: right;
  margin-right: 10px;
}
.center {
  display: inline-block;
  text-align: center;
}
.sub {
  text-align: left;
  font-size: 1.0em;
  color: #636e72;
  margin-left: 20px;
  margin-bottom: 1px;
}
.amount {
  font-weight: bold;
  font-size: 1.3em;
  text-align: center;
  color: #2FCDB4;
  margin-bottom: 5px;
}
</style>
