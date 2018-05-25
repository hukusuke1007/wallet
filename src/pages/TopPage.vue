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
          <p class="resizeImage">
            <img :src="require('@/assets/headerLogo_pink.png')"/>
          </p>
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
            <v-card-actions>
              <v-icon style="margin-left: 8px;">directions_run</v-icon>
              <v-card-title>急ぎモード！</v-card-title>
            </v-card-actions>
            <v-flex>
              <v-btn color="button" class="white--text" large block :to="{name: 'WalletTransfer'}">
                  <span class="label">すぐに送金する</span>
              </v-btn>
              <v-btn color="button" class="white--text" large block :to="{name: 'InvoiceCreate', params: {kind: 'show_only'}}">
                  <span class="label">すぐに請求書を表示</span>
              </v-btn>
            </v-flex>
          </v-card>
        </v-flex>
        <!-- ウォレット -->
        <v-flex>
          <v-card>
            <v-card-actions>
              <v-icon style="margin-left: 8px;">credit_card</v-icon>
              <v-card-title>ウォレット</v-card-title>
            </v-card-actions>
            <v-flex>
              <v-btn color="select" class="white--text" large block :to="{name: 'WalletList'}">
                  <span class="label">ウォレットを表示する</span>
              </v-btn>
            </v-flex>
          </v-card>
        </v-flex>
        <!-- 請求書 -->
        <v-flex>
          <v-card>
            <v-card-actions>
              <v-icon style="margin-left: 8px;">receipt</v-icon>
              <v-card-title>請求書</v-card-title>
            </v-card-actions>
            <v-flex>
              <v-btn color="select" class="white--text" large block :to="{name: 'InvoiceList'}">
                  <span class="label">請求書を表示</span>
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
  font-weight: bold;
  /* margin-left: 10px; */
}
p.resizeImage {
   text-align: center;
   max-width: 271px; /* 最大幅 */
   min-width: 220px; /* 最小幅 */
   margin: 0 auto;
}
p.resizeImage img { width: 100%; }

</style>
