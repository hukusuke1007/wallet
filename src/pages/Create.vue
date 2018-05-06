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
      </v-card>
      <v-card>
        <v-card-text>ウォレットの作成方法を選択してください</v-card-text>
        <v-btn color="light-blue lighten-3" large @click="goCreate">新規作成</v-btn>
        <v-btn color="light-blue lighten-3" large @click="goImport">秘密鍵をインポート</v-btn>
      </v-card>
    </v-flex>
   </v-layout>
</template>

<script>
  export default {
    methods: {
      goCreate () {
        this.$router.push({name: 'WalletCreate'})
      },
      goImport () {
        this.$router.push({name: 'WalletImport'})
      },
      back () {
        history.go(-1)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>



</style>
