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
      <v-btn
       color="orange darken-1"
       class="white--text"
       @click.stop="showQRreader"
       block
      >QRコード読み取り</v-btn>
      </v-flex>
      <br><br>

      <v-flex>
      <v-btn color="info" @click="submit" :disabled="!valid">作成</v-btn>
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
    <!-- QRダイアログ -->
    <dialogQRreader v-bind:dialogVal="isShowDialogQRreader"
                    v-bind:pauseVal="paused"
                    typeVal="privateKey"
                    v-on:qr-reader-event-scan-success="getContent"
                    v-on:qr-reader-event-tap-close="tapClose"></dialogQRreader>
  </v-container>
</template>

<script>
 // import axios from 'axios'
 import nemWrapper from '@/js/nem_wrapper'
 import localDatabaseWrapper from '@/js/local_database_wrapper'
 import DialogConfirm from '@/components/DialogConfirm'
 import DialogQRreader from '@/components/QRreader'

 export default {
   data: () => ({
     valid: true,
     paused: false,
     isShowDialogQRreader: false,
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
     'dialogConfirm': DialogConfirm,
     'dialogQRreader': DialogQRreader
   },
   methods: {
     submit () {
       if (this.$refs.form.validate()) {
         console.log('submit')
         // let account = nemWrapper.createWalletWithPrivateKey(this.name, this.privateKey)
         // console.log(account)
         let storeData = {}
         storeData[localDatabaseWrapper.VALUE_NAME] = this.name
         storeData[localDatabaseWrapper.VALUE_DESCRIPTION] = this.description
         storeData[localDatabaseWrapper.VALUE_WALLET_ACCOUNT] = nemWrapper.createWalletWithPrivateKey(this.name, this.privateKey)
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
     showQRreader () {
       this.paused = false
       this.isShowDialogQRreader = true
     },
     getContent (content) {
       console.log(content)
       this.privateKey = content
       this.paused = true
       this.isShowDialogQRreader = false
     },
     tapClose (message) {
       if (this.isShowDialogQRreader === true) {
         console.log(message)
         this.paused = true
         this.isShowDialogQRreader = false
       }
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
