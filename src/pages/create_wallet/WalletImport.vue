<template>
  <v-container fluid>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-flex>
      <v-text-field
        box
        label="ウォレット名"
        v-model="name"
        :rules="nameRules"
        :counter="16"
        required
      ></v-text-field>
      </v-flex>

      <v-flex>
        <v-text-field
          box
          multi-line
          label="ウォレットの説明"
          v-model="description"
          :rules="descriptionRules"
          :counter="1024"
        ></v-text-field>
      </v-flex>

      <v-flex>
      <v-text-field
        box
        label="秘密鍵"
        v-model="privateKey"
        :rules="privateKeyRules"
        :counter="64"
        required
      ></v-text-field>
      </v-flex>
      
      <v-flex>
      <v-btn color="light-blue lighten-3" @click="submit" :disabled="!valid">作成</v-btn>
      <v-btn @click="clear">クリア</v-btn>
      </v-flex>
      <br>
      <v-flex>
      <v-btn color="grey" class="white--text" @click="back">戻る</v-btn>
      </v-flex>
    </v-form>
    <!-- ダイアログ -->
    <dialogConfirm v-bind:dialogVal="isShowDialog"
                   titleVal="ウォレット作成"
                   v-bind:messageVal="dialogMsg"
                   v-on:dialog-confirm-event-tap-positive="tapPositive"></dialogConfirm>
  </v-container>
</template>

<script>
 import nemWrapper from '@/js/nem_wrapper'
 import localDatabaseWrapper from '@/js/local_database_wrapper'
 import ModelWalletNem from '@/js/model/model_wallet_nem'
 import DialogConfirm from '@/components/DialogConfirm'

 export default {
   data: () => ({
     valid: true,
     paused: false,
     content: '',
     name: '',
     description: '',
     privateKey: '',
     isShowDialog: false,
     isError: false,
     dialogMsg: '',
     nameRules: [
       value => !!value || '名前を入力してください',
       value => (value && value.length <= 16) || '最大文字数を超えています。'
     ],
     descriptionRules: [
       value => (value.length <= 1024) || '最大文字数を超えています。'
     ],
     privateKeyRules: [
       value => !!value || '秘密鍵を入力してください',
       value => (value && value.length === 64) || '秘密鍵は64文字です。'
     ]
   }),
   components: {
     'dialogConfirm': DialogConfirm
   },
   methods: {
     submit () {
       if (this.$refs.form.validate()) {
         let storeData = new ModelWalletNem()
         storeData.name = this.name
         storeData.description = this.description
         storeData.account = nemWrapper.createWalletWithPrivateKey(this.name, this.privateKey)
         localDatabaseWrapper.setItemArray(localDatabaseWrapper.KEY_WALLET_INFO, storeData, false, -1)
           .then((result) => {
             console.log(result)
             this.isError = false
             this.isShowDialog = true
             this.dialogMsg = 'ウォレットを作成しました。'
           }).catch((err) => {
             console.log(err)
             this.isError = true
             this.isShowDialog = true
             this.dialogMsg = 'ERROR:ウォレットのデータ保存に失敗しました。'
           })
       }
     },
     clear () {
       this.$refs.form.reset()
     },
     back () {
       history.go(-1)
     },
     tapPositive (message) {
       console.log(message)
       if (this.isShowDialog === true) {
         this.isShowDialog = false
         // 画面遷移.
         if (this.isError !== true) { this.$router.push({ path: '/walletlist' }) }
       }
     }
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
