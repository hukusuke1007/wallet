<template>
  <!-- <div id="app"> -->
    <v-app>
      <!-- 左側のナビゲーションバー -->
      <v-navigation-drawer
       fixed
       clipped
       app
       class="theme"
       v-model="naviBar"
      >
      <v-container
        fluid
        style="min-height: 0;"
        grid-list-lg
        >
      <v-list dense class="pt-0">
        <!--  DASHBOARD -->
        <v-layout wrap column>
        <v-flex>
          <v-card>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>dashboard</v-icon>
            </v-list-tile-action>
            <router-link to="/">
            <v-list-tile-content>
              <v-list-tile-title class="">ダッシュボード</v-list-tile-title>
            </v-list-tile-content>
            </router-link>
          </v-list-tile>
          </v-card>
        </v-flex>

        <!--  SEND -->
        <v-flex>
          <v-card>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>send</v-icon>
            </v-list-tile-action>
            <router-link to="/walletTransfer">
            <v-list-tile-content>
              <v-list-tile-title class="">送金</v-list-tile-title>
            </v-list-tile-content>
            </router-link>
          </v-list-tile>
          </v-card>
        </v-flex>

        <!--  Wallet list -->
        <v-flex>
          <v-card>
            <v-card-title>ウォレット</v-card-title>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>credit_card</v-icon>
              </v-list-tile-action>
              <router-link to="/walletlist">
              <v-list-tile-content>
                <v-list-tile-title class="">ウォレット一覧</v-list-tile-title>
              </v-list-tile-content>
              </router-link>
            </v-list-tile>

            <!--  CREATE -->
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>add_circle</v-icon>
              </v-list-tile-action>
              <router-link to="/create">
              <v-list-tile-content>
                <v-list-tile-title class="">ウォレット作成</v-list-tile-title>
              </v-list-tile-content>
              </router-link>
            </v-list-tile>
          </v-card>
        </v-flex>
        <!--  Wallet list -->
        <v-flex>
          <v-card>
            <v-card-title>請求書</v-card-title>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>receipt</v-icon>
              </v-list-tile-action>
              <router-link to="/invoiceList">
              <v-list-tile-content>
                <v-list-tile-title class="">請求書一覧</v-list-tile-title>
              </v-list-tile-content>
              </router-link>
            </v-list-tile>

            <!--  CREATE -->
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>note_add</v-icon>
              </v-list-tile-action>
              <router-link to="/invoiceCreate">
              <v-list-tile-content>
                <v-list-tile-title class="">請求書作成</v-list-tile-title>
              </v-list-tile-content>
              </router-link>
            </v-list-tile>
          </v-card>
        </v-flex>
        <!--  SETTING -->
        <!--
        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="black">settings</v-icon>
          </v-list-tile-action>
          <router-link to="/setting">
          <v-list-tile-content>
            <v-list-tile-title>設定</v-list-tile-title>
          </v-list-tile-content>
          </router-link>
        </v-list-tile>
        -->
      </v-layout>
      </v-list>
     </v-container>
     </v-navigation-drawer>

     <!-- 上のツールバー -->
     <v-toolbar
      dark
      color="pink accent-1"
      clipped-left
      fixed
      app
     >
       <v-toolbar-side-icon @click.stop="naviBar = !naviBar"></v-toolbar-side-icon>
       <v-toolbar-title class="white--text">Office NEM wallet</v-toolbar-title>
       <v-spacer></v-spacer>
       <v-toolbar-side-icon @click="goTop"><v-icon>home</v-icon></v-toolbar-side-icon>
     </v-toolbar>
     <v-content>

      <!-- 真ん中のView -->
      <!-- <v-container fluid fill-height> -->
      <v-container fluid>
        <v-fade-transition mode="out-in">
          <router-view></router-view>
        </v-fade-transition>
      </v-container>
      <!-- </v-container> -->
     </v-content>

      <!-- フッター -->
      <!--
      <v-footer height="auto" class="pink accent-1">
         <v-layout row wrap justify-center>
          <v-btn
            color="white"
            flat
            v-for="link in links"
            :key="link"
            @click="tapFooter(link)"
          >
            {{ link }}
          </v-btn>
          <v-flex xs12 py-3 text-xs-center white--text>
            &copy;2018. <strong>Shohei Nakagawa</strong>
          </v-flex>
        </v-layout>
      </v-footer>
    -->
  </v-app>
  <!-- </div> -->
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      links: ['Home', 'About Us', 'Services', 'Github', 'Contact Us'],
      naviBar: false
    }
  },
  computed: {
    ...mapGetters('Nem', ['address', 'transactionStatus', 'isLoading'])
  },
  mounted () {
  },
  watch: {
    address (newVal, oldVal) {
      console.log('App_address', newVal, oldVal)
      this.doObserveTransaction()
    },
    transactionStatus (val) {
      console.log('transactionStatus', val)
      if (val === 'unconfirmed') {
        let message = 'トランザクション承認中...'
        // this.$toast(message')
        this.$toasted.show(message)
      } else if (val === 'confirmed') {
        let message = 'トランザクションが承認されました。<br>反映されない場合は更新ボタンを押してください。'
        // this.$toast(message')
        this.$toasted.show(message)
        this.doTransactionStatus('none')
      }
    }
  },
  destroyed () {

  },
  methods: {
    ...mapActions('Nem', ['doUpdateNemBalance', 'doUpdateMosaicsBalance', 'doObserveTransaction', 'doCloseObserveTransaction', 'doTransactionStatus']),
    goTop () {
      this.$router.push({name: 'TopPage'})
    },
    tapFooter (link) {
      console.log(link)
      switch (link) {
        case 'Home':
          this.$router.push({ path: '/' })
          break
        case 'About Us':
          this.$router.push({ path: '/' })
          break
        case 'Services':
          this.$router.push({ path: '/' })
          break
        case 'Github':
          // location.href = 'https://github.com/hukusuke1007/wallet/'
          open('https://github.com/hukusuke1007/wallet/', '_blank')
          break
        case 'Contact Us':
          let address = 'cryptowalking.app@gmail.com'
          let subject = 'お問い合わせ'
          let body = ''
          let message = 'mailto:' + address + '?subject=' + subject + '&body=' + body
          open(message, '_blank')
          break
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Verdana', 'ヒラギノ角ゴ', 'Avenir', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #fffaf0;
  margin-top: 0px;
}

.w-break {
  word-break: break-all;
}

.font-color-shamrock { color: #2FCDB4; }

.sideOffset {
  margin: 2px 10px 2px 10px;
}

.subTitle {
 font-size: 1.0em;
 position: absolute;
 font-weight: bold;
 color: #b2bec3;
 left: 20px;
}

.buttonFont {
  font-family: 'Verdana', 'ヒラギノ角ゴ', 'Avenir', Arial, sans-serif;
  /* font-weight: bold; */
  font-size: 1.2em;
}

.qrlayout {
  text-align: center;
  max-width: 340px; /* 最大幅 */
  min-width: 200px; /* 最小幅 */
  margin: 0 auto;
}

.toast {
  width: 95%;
}

.toastlabel {
  margin: 0 auto;
}
 /*
}
}
}
}
a {
  text-decoration: none;
}
 */
 /*
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
 */
</style>
