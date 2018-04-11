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
        <router-link to="/">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>dashboard</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>DASHBOARD</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>

        <!--  SETTING -->
        <router-link to="/setting">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>settings</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>SETTING</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>
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
       <v-toolbar-title class="white--text">Genio Wallet</v-toolbar-title>
       <v-spacer></v-spacer>
       <v-btn icon><v-icon>search</v-icon></v-btn>
       <v-btn icon><v-icon>apps</v-icon></v-btn>
       <v-btn icon><v-icon>refresh</v-icon></v-btn>
       <v-btn icon><v-icon>more_vert</v-icon></v-btn>
     </v-toolbar>

     <!-- 真ん中のView -->
     <v-content>
      <v-container fluid fill-height>
        <v-fade-transition mode="out-in">
          <router-view></router-view>
        </v-fade-transition>
      </v-container>
     </v-content>
  </v-app>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      naviBar: null
    }
  },
  mounted: function () {

  },
  destroyed: function () {

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
