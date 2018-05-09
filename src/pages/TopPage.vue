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
            <v-card-media :src="require('../assets/headerLogo_pink.png')"></v-card-media>
            <v-card-actions>
              <v-card-title>時価レート</v-card-title>
              <v-spacer></v-spacer>
              <v-btn fab small flat @click="getRate" :loading="isLoadinRateJpyXem">
                  <v-icon>cached</v-icon>
              </v-btn>
            </v-card-actions>
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
            <v-flex>
              <v-btn color="light-blue lighten-3" large block :to="{name: 'WalletTransfer'}">
                  <v-icon>send</v-icon><span class="label">送金する</span>
              </v-btn>
            </v-flex>
          </v-card>
        </v-flex>
        <!-- ウォレット -->
        <v-flex>
          <v-card>
            <v-card-title>ウォレット</v-card-title>
            <v-flex>
              <v-btn color="light-blue lighten-3" large block :to="{name: 'WalletList'}">
                  <v-icon>credit_card</v-icon><span class="label">ウォレットを表示する</span>
              </v-btn>
            </v-flex>
          </v-card>
        </v-flex>
        <!-- 請求書 -->
        <v-flex>
          <v-card>
            <v-card-title>請求書</v-card-title>
            <v-flex>
              <v-btn color="light-blue lighten-3" large block :to="{name: 'InvoiceList'}">
                  <v-icon>receipt</v-icon><span class="label">請求書を表示する</span>
              </v-btn>
            </v-flex>
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
      imageLogo: require('@/assets/headerLogo_pink.png'),
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
.label {
  margin-left: 10px;
}
</style>
