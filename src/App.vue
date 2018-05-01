<template>
  <!-- <div id="app"> -->
    <v-app>
      <!-- 左側のナビゲーションバー -->
      <v-navigation-drawer
       fixed
       clipped
       app
       v-model="naviBar"
      >
      <v-list dense class="pt-0">

        <!--  DASHBOARD -->
        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="black">dashboard</v-icon>
          </v-list-tile-action>
          <router-link to="/">
          <v-list-tile-content>
            <v-list-tile-title>ダッシュボード</v-list-tile-title>
          </v-list-tile-content>
          </router-link>
        </v-list-tile>

        <!--  SEND -->
        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="black">send</v-icon>
          </v-list-tile-action>
          <router-link to="/walletTransfer">
          <v-list-tile-content>
            <v-list-tile-title>送金</v-list-tile-title>
          </v-list-tile-content>
          </router-link>
        </v-list-tile>

        <!--  Wallet list -->
        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="black">credit_card</v-icon>
          </v-list-tile-action>
          <router-link to="/walletlist">
          <v-list-tile-content>
            <v-list-tile-title>ウォレット一覧</v-list-tile-title>
          </v-list-tile-content>
          </router-link>
        </v-list-tile>

        <!--  CREATE -->
        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="black">add_circle</v-icon>
          </v-list-tile-action>
          <router-link to="/create">
          <v-list-tile-content>
            <v-list-tile-title>ウォレット作成</v-list-tile-title>
          </v-list-tile-content>
          </router-link>
        </v-list-tile>

        <!--  Wallet list -->
        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="black">receipt</v-icon>
          </v-list-tile-action>
          <router-link to="/invoiceList">
          <v-list-tile-content>
            <v-list-tile-title>請求書一覧</v-list-tile-title>
          </v-list-tile-content>
          </router-link>
        </v-list-tile>

        <!--  CREATE -->
        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="black">note_add</v-icon>
          </v-list-tile-action>
          <router-link to="/invoiceCreate">
          <v-list-tile-content>
            <v-list-tile-title>請求書作成</v-list-tile-title>
          </v-list-tile-content>
          </router-link>
        </v-list-tile>
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
      </v-list>
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
export default {
  name: 'app',
  data () {
    return {
      links: ['Home', 'About Us', 'Services', 'Github', 'Contact Us'],
      naviBar: false
    }
  },
  mounted: function () {

  },
  destroyed: function () {

  },
  methods: {
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.w-break {
  word-break: break-all;
}

.font-color-shamrock { color: #2FCDB4; }

.sideOffset {
  margin: 2px 10px 2px 10px;
}
 /*
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
