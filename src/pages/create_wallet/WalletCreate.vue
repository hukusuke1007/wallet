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
      <v-btn color="info" @click="submit" :disabled="!valid">作成</v-btn>
      <v-btn @click="clear">クリア</v-btn>
      </v-flex>
      <br>
      <v-flex>
      <v-btn color="grey" class="white--text" @click="back">戻る</v-btn>
      </v-flex>

      <!-- ダイアログ -->
      <dialogConfirm v-bind:dialogVal="isShowDialog"
                     titleVal="ウォレット作成"
                     v-bind:messageVal="dialogMsg"
                     v-on:dialog-confirm-event-tap-positive="tapPositive"></dialogConfirm>
    </v-form>
  </v-container>
</template>

<script>
 // import axios from 'axios'
 import localForage from 'localforage'
 import nemWrapper from '@/js/nem_wrapper'
 import DialogConfirm from '@/components/DialogConfirm'

 export default {
   data: () => ({
     valid: true,
     isShowDialog: false,
     dialogMsg: '',
     name: '',
     description: '',
     localforage_key: 'key_wallet_info',
     localforage_data: {id: '0', name: '', description: '', address: '', publicKey: '', privateKey: ''},
     nameRules: [
       value => !!value || '名前を入力してください',
       value => (value && value.length <= 16) || '最大文字数を超えています。'
     ],
     descriptionRules: [
       value => (value.length <= 1024) || '最大文字数を超えています。'
     ]
   }),
   components: {
     'dialogConfirm': DialogConfirm
   },
   mounted () {
     this.$setStorageDriver(localForage.LOCALSTORAGE)
     /*
     this.$getItem(this.localforage_key)
       .then((result) => {
         console.log('got value:', result)
       }).catch((err) => {
         // This code runs if there were any errors
         console.log(err)
       })
     */
     // nemWrapper.getAccount('NBHWRG6STRXL2FGLEEB2UOUCBAQ27OSGDTO44UFC')
   },
   methods: {
     submit () {
       if (this.$refs.form.validate()) {
         /*
         axios.post('/api/submit', {
           name: this.name,
           description: this.description
         })
         */
         const data = nemWrapper.createWallet(this.name)
         this.localforage_data = {id: '0', name: this.name, description: this.description, address: data.address, publicKey: data.publicKey, privateKey: data.privateKey}
         this.$getItem(this.localforage_key)
           .then((result) => {
             console.log('got value:', result)
             var storeData = [this.localforage_data]
             if (result) {
               storeData = result
               storeData.push(this.localforage_data)
             }

             this.$setItem(this.localforage_key, storeData)
               .then((result) => {
                 console.log('set array value:', result)
                 this.isShowDialog = true
                 this.dialogMsg = 'ウォレットを作成しました。'
               }).catch((err) => {
                 console.log('localforage set item is failed. error:' + err)
                 this.isShowDialog = true
                 this.dialogMsg = 'ERROR:ウォレットのデータ保存に失敗しました。'
               })
           }).catch((err) => {
             // This code runs if there were any errors
             console.log(err)
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
       this.isShowDialog = false
       this.$router.push({ path: '/walletlist' }) // 画面遷移
     }
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>



</style>
