<template>
  <v-container fluid>
    <p>ウォレットの作成方法を選択してください</p>
    
    <router-link to="/wallet_create">
      <v-btn color="primary" large>新規作成</v-btn>
    </router-link>

    <router-link to="/wallet_import">
      <v-btn color="primary" large>秘密鍵をインポート</v-btn>
    </router-link>
  </v-container>
</template>

<script>

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>



</style>
