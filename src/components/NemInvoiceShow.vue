<template>
  <v-card flat>
      <v-container
        fluid
        style="min-height: 0;"
        grid-list-lg
        >
        <div class="w-break sideOffset">
          <v-layout row wrap column>
            <v-flex>
              <div v-if="invoice">
                <div class="itemNum">個数: {{ num }}</div>
                <v-card-text><h2>{{ invoice.name }}</h2></v-card-text>
                <qriously v-model="qrValue" :size="240" ></qriously>
                <v-card-text>通貨: {{ invoice.currencyItem.text }}</v-card-text>
                <v-card-text><h2 class="font-color-shamrock">{{ amount }} {{ unitName }}</h2></v-card-text>
                <v-subheader>メッセージ</v-subheader><v-card-text>{{ invoice.message }}</v-card-text>
              </div>
              <div v-else>
                <v-card-text>請求書データがありません。</v-card-text>
              </div>
            </v-flex>
        </v-layout>
      </div>
    </v-container>
  </v-card>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  // import DialogPositiveNegative from '@/components/DialogPositiveNegative'
  // import DialogConfirm from '@/components/DialogConfirm'
  // import ProgressCircular from '@/components/ProgressCircular'
  // import ModelInvoice from '@/js/model/model_invoice'

  export default {
    data: () => ({
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
      id: {
        type: String,
        default: '-1'
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
          this.qrValue = JSON.stringify(nemWrapper.getJSONInvoiceForQRcode(2, 2, result.name, result.senderAddr, this.amount, result.message))
          console.log(this.qrValue)
        } else if (result.currencyItem.text === 'JPY') {
          // JPY
          this.unitName = '円'
          this.qrValue = JSON.stringify(nemWrapper.getJSONInvoiceForQRcodeJPY(2, 2, result.name, result.senderAddr, this.amount, result.message))
          console.log(this.qrValue)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.itemNum {
  float: right;
}
</style>
