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
                  <div class="amount">{{ amount }} {{ unitName }}</h3></div>
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
              <v-btn color="light-blue lighten-3" large block @click="download">ダウンロード</v-btn>
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
  import html2canvas from 'html2canvas'
  import Jspdf from 'jspdf'
  // import PrintJS from 'print-js'

  export default {
    data: () => ({
      // image_src: null,
      dialog: false,
      amount: 0,
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
        let amount = Number(result.amount) * this.num
        this.amount = amount
        this.amount = this.amount.toLocaleString()
        if (result.currencyItem.text === 'NEM') {
          // NEM
          this.unitName = 'XEM'
          this.qrValue = nemWrapper.getJSONInvoiceForQRcode(2, 2, result.name, result.senderAddr, amount, result.message)
        } else if (result.currencyItem.text === 'JPY') {
          // JPY
          this.unitName = '円'
          this.qrValue = nemWrapper.getJSONInvoiceForQRcodeJPY(2, 2, result.name, result.senderAddr, amount, result.message)
          console.log(this.qrValue)
        }
      },
      download () {
        // document.getElementById('invoiceData')
        html2canvas(this.$refs.invoiceData)
          .then((canvas) => {
            let dataURI = canvas.toDataURL('image/png')
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
            let imgWidth = 210
            let pageHeight = 295
            let imgHeight = canvas.height * imgWidth / canvas.width
            let heightLeft = imgHeight
            let position = 2
            console.log('canvasSize', canvas.height, canvas.width)
            let pdf = new Jspdf('p', 'mm')
            pdf.addImage(dataURI, 'PNG', 0, position, imgWidth, imgHeight) // x, yの座標
            heightLeft -= pageHeight
            while (heightLeft >= 0) {
              position = heightLeft - imgHeight
              pdf.addPage()
              pdf.addImage(dataURI, 'PNG', 0, position, imgWidth, imgHeight)
              heightLeft -= pageHeight
            }
            let date = new Date()
            let pdfName = 'office_nem_invoice_' + this.id + '_' + date.getTime() + '.pdf'
            console.log(pdfName)
            pdf.save(pdfName)
            // let renderString = pdf.output('datauristring')
            // PrintJS(printUrl)
          })
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
