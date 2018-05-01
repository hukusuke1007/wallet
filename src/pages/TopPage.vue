<template>
  <v-container
    fluid
    style="min-height: 0;"
    grid-list-lg>
    <div class="w-break sideOffset">
      <v-flex xs12 sm6 offset-sm3>
       <v-layout column wrap>
        <!-- 時価レート -->
        <v-flex>
          <v-card>
            <v-card-actions>
              <v-card-title>時価レート</v-card-title>
              <v-spacer></v-spacer>
              <v-btn fab small flat @click="getRate" :loading="isLoadinRateJpyXem">
                  <v-icon>cached</v-icon>
              </v-btn>
            </v-card-actions>
              <!--
              <div style="position: absolute; left: 8px;">
               <v-card-title>時価</v-card-title>
              </div>
              <div style="position: absolute; right: 8px;">
                <v-btn fab small flat @click="getRate">
                  <v-icon>cached</v-icon>
                </v-btn>
              </div>
            -->
            <v-card-text>
              <div>{{ rateJpyXem }} 円/XEM</div>
              <span class="grey--text">{{ rateDate }}</span>
            </v-card-text>
          </v-card>
        </v-flex>
       <!-- 送金 -->
        <v-flex>
          <v-card>
            <v-card-title>送金</v-card-title>
            <v-btn large flat :to="{name: 'WalletTransfer'}">
                <v-icon>send</v-icon>
            </v-btn>
          </v-card>
        </v-flex>
        <!-- ウォレット -->
        <v-flex>
          <v-card>
            <v-card-title>ウォレット</v-card-title>
            <v-btn large flat :to="{name: 'WalletList'}">
                <v-icon>credit_card</v-icon>
            </v-btn>
          </v-card>
        </v-flex>
        <!-- 請求書 -->
        <v-flex>
          <v-card>
            <v-card-title>請求書</v-card-title>
            <v-btn large flat :to="{name: 'InvoiceList'}">
                <v-icon>receipt</v-icon>
            </v-btn>
          </v-card>
        </v-flex>
      </v-layout>
     </v-flex>
    </div>
  </v-container>
</template>
<script>
  import exWrapper from '@/js/exchange_wrapper'
  export default {
    name: 'topPage',
    data: () => ({
      rateJpyXem: 0,
      rateDate: '',
      isLoadinRateJpyXem: false
    }),
    mounted () {
      this.getRate()
    },
    methods: {
      getRate () {
        this.isLoadinRateJpyXem = true
        exWrapper.getRateJpyXem()
          .then((result) => {
            console.log('rateJpyXem: ' + result)
            this.rateJpyXem = Math.round(result * 1000) / 1000
            this.isLoadinRateJpyXem = false
            this.getNowDate()
          }).catch((err) => {
            console.error(err)
            this.isLoadinRateJpyXem = false
          })
      },
      getNowDate () {
        let date = new Date()
        this.rateDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/') + ' ' + date.toLocaleTimeString()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*
.footer {
  position:  fixed;
  bottom: 0;
  width: 100%;
}
*/
</style>
