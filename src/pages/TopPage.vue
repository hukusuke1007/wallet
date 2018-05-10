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
          <img :src="require('@/assets/headerLogo_pink.png')"></img>
        </v-flex>
        <v-flex>
          <v-card>
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

    <DialogAuthWallet v-bind:dialogVal="isShowAuthWallet"
                 v-on:dialog-auth-wallet-close="tapAuthWalletClose"
                 v-on:dialog-auth-wallet-notify="tapAuthWalletNotify"></DialogAuthWallet>

  </v-container>
</template>
<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import exWrapper from '@/js/exchange_wrapper'
  import DialogAuthWallet from '@/components/DialogAuthWallet'
  export default {
    name: 'topPage',
    data: () => ({
      imageLogo: require('@/assets/headerLogo_pink.png'),
      isShowAuthWallet: false,
      rateJpyXem: 0,
      rateDate: '',
      isLoadinRateJpyXem: false
    }),
    components: {
      DialogAuthWallet
    },
    mounted () {
      this.getRate()
      this.reloadItem()
      // this.$toast('aaa')
    },
    methods: {
      reloadItem () {
        dbWrapper.getItem(dbWrapper.KEY_AUTH_PASSWORD)
          .then((result) => {
            if (result) {
            } else {
              this.isShowAuthWallet = true
            }
          }).catch((err) => {
            console.log(err)
          })
      },
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
      },
      tapAuthWalletClose () {
        this.isShowAuthWallet = false
      },
      tapAuthWalletNotify () {
        this.isShowAuthWallet = false
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
