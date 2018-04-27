<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
    <v-card>
      <v-toolbar card color="primary" dark tabs>
        <v-btn icon @click.native="back()" dark>
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
       <v-toolbar-title>ウォレット作成</v-toolbar-title>
      </v-toolbar>
    <v-card-text>ウォレットの作成方法を選択してください</v-card-text>
    <router-link to="/wallet_create">
      <v-btn color="primary" large>新規作成</v-btn>
    </router-link>
    <router-link to="/wallet_import">
      <v-btn color="primary" large>秘密鍵をインポート</v-btn>
    </router-link>
    </v-card>
    </v-flex>
   </v-layout>
</template>

<script>
  export default {
    methods: {
      back () {
        history.go(-1)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>



</style>
