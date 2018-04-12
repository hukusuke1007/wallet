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
       @click.stop="dialog_readQR = true" 
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
    <v-dialog v-model="dialog_readQR" max-width="500px">
      <v-card>
        <v-card-title class="pink--text">QRコード読み取り</v-card-title>
        <qrcode-reader @init="onInit" @decode="onDecode">

        </qrcode-reader>
        <v-card-action>
          <v-btn color="primary" flat @click.stop="dialog_readQR = false" block>閉じる</v-btn>
        </v-card-action>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
 import axios from 'axios'
 export default {
   data: () => ({
     valid: true,
     dialog_readQR: false,
     name: '',
     description: '',
     privateKey: '',
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

   methods: {
     async onInit (promise) {
       // show loading indicator
       try {
         await promise

         // successfully initialized
       } catch (error) {
         if (error.name === 'NotAllowedError') {
           console.log('user denied camera access permisson')
         } else if (error.name === 'NotFoundError') {
           console.log('no suitable camera device installed')
         } else if (error.name === 'NotSupportedError') {
           console.log('page is not served over HTTPS (or localhost)')
         } else if (error.name === 'NotReadableError') {
           console.log('maybe camera is already in use')
         } else if (error.name === 'OverconstrainedError') {
           console.log('Did you requested the front camera although there is none?')
         // passed constraints don't match any camera. Did you requested the front camera although there is none?
         } else {
           console.log('browser is probably lacking features (WebRTC, Canvas)')
         // browser is probably lacking features (WebRTC, Canvas)
         }
       } finally {
         console.log('hide loading indicator')
         // hide loading indicator
       }
     },
     onDecode (content) {
       // this.paused = true
       this.privateKey = content
       this.dialog_readQR = false
     },
     submit () {
       if (this.$refs.form.validate()) {
         axios.post('/api/submit', {
           name: this.name,
           description: this.description
         })
       }
     },
     clear () {
       this.$refs.form.reset()
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
