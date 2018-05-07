<template>
  <v-dialog v-model="dialog"
   fullscreen
   hide-overlay
   transition="dialog-bottom-transition"
   scrollable
  >
  <v-card flat>
      <v-toolbar card color="pink accent-1" dark tabs>
        <v-btn icon @click.native="close()" dark>
          <v-icon>close</v-icon>
        </v-btn>
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
        <v-card>
        <div class="w-break sideOffset">
          <v-layout row wrap column>
            <div id="invoiceData">
              <div v-if="invoice" class="center">
                <div class="itemNum">個数: {{ num }}</div>
                <v-card-text><h2>{{ invoice.name }}</h2></v-card-text>
                <v-card flat><qriously v-model="qrValue" :size="300" ></qriously></v-card>
                <v-subheader>通貨: {{ invoice.currencyItem.text }}</v-subheader>
                <v-card-text><h2 class="font-color-shamrock">{{ amount }} {{ unitName }}</h2></v-card-text>
                <v-subheader>メッセージ</v-subheader>
                <v-card-text><h3>{{ invoice.message }}</h3></v-card-text>
              </div>
             <div v-else>
               <v-card-text>請求書データがありません。</v-card-text>
             </div>
           </div>
          </v-layout>
        </div>
        </v-card>
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
      dialog: false,
      amountLabel: '',
      invoice: null,
      unitName: 'XEM',
      currencyItems: [
        { id: 0, text: 'NEM' },
        { id: 1, text: 'JPY' },
        { id: 2, text: 'Mosaics' }
      ],
      isError: false,
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
        if (result.currencyItem.text === 'NEM') {
          // NEM
          this.unitName = 'XEM'
          // this.qrValue = JSON.stringify(nemWrapper.getJSONInvoiceForQRcode(2, 2, result.name, result.senderAddr, this.amount, result.message))
          this.qrValue = nemWrapper.getJSONInvoiceForQRcode(2, 2, result.name, result.senderAddr, this.amount, result.message)
        } else if (result.currencyItem.text === 'JPY') {
          // JPY
          this.unitName = '円'
          this.qrValue = nemWrapper.getJSONInvoiceForQRcodeJPY(2, 2, result.name, result.senderAddr, this.amount, result.message)
          console.log(this.qrValue)
        }
      },
      download () {
        html2canvas(document.getElementById('invoiceData'))
          .then((canvas) => {
            let dataURI = canvas.toDataURL('image/jpeg')
            let pdf = new Jspdf()
            pdf.addImage(dataURI, 'JPEG', 28, 8) // x, yの座標
            let date = new Date()
            let pdfName = 'office_nem_invoice_' + this.id + '_' + date.getTime() + '.pdf'
            console.log(pdfName)
            pdf.save(pdfName)
            // let printUrl = pdf.output('datauristring')
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
  float: right;
}
.center {
  display: inline-block;
  text-align: center;
}
</style>
