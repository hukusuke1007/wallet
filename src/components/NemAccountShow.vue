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
        <v-toolbar-title class="white--text">アカウント</v-toolbar-title>
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
            <div ref="accountData">
              <v-flex>
                <div class="appName">Office NEM wallet</div>
              </v-flex>
              <v-flex>
                  <v-card-text><h3>{{ name }}</h3></v-card-text>
                  <v-card flat><qriously v-model="qrValue" :size="qrSize" ></qriously></v-card>
                  <v-card-text>{{ walletItem.account.address.value }}</v-card-text>
              </v-flex>
           </div>
           </v-card>
           </v-flex>
           <v-flex>
            <v-card>
              <!-- <img :src="image_src"> -->
              <v-btn color="select" class="buttonFont white--text" large block @click="download">ダウンロード</v-btn>
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
  import nemWrapper from '@/js/nem_wrapper'
  import html2canvas from 'html2canvas'
  import Jspdf from 'jspdf'
  import { mapGetters } from 'vuex'
  // import PrintJS from 'print-js'

  export default {
    data: () => ({
      dialog: false,
      qrSize: 200,
      qrValue: 'test'
    }),
    computed: {
      ...mapGetters('Nem', ['walletItem'])
    },
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
      name: {
        type: String,
        default: ''
      }
    },
    watch: {
      dialogVal (val) {
        this.dialog = val
      },
      name (val) {
        this.reloadItem()
      }
    },
    methods: {
      reloadItem () {
        this.qrValue = nemWrapper.getJSONInvoiceForQRcodeJPY(2, 1, this.name, this.walletItem.account.address.value, 0, '')
      },
      download () {
        // document.getElementById('invoiceData')
        html2canvas(this.$refs.accountData)
          .then((canvas) => {
            let dataURI = canvas.toDataURL('image/png')
            let imgWidth = 210
            let pageHeight = 295
            let imgHeight = canvas.height * imgWidth / canvas.width
            let heightLeft = imgHeight
            let position = 10
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
            let pdfName = this.walletItem.account.address.value + '.pdf'
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
        this.$emit('dialog-nem-account-show-event-close', 'close')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.appName {
  color: #C8C8C8;
  float: right;
  margin-right: 10px;
}
</style>
