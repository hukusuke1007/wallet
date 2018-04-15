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
    <dialogQRreader v-bind:dialogVal="isShowDialogQRreader"
                    v-bind:pauseVal="paused"
                    typeVal="privateKey"
                    v-on:qr-reader-event-scan-success="getContent"
                    v-on:qr-reader-event-tap-close="tapClose"></dialogQRreader>
  </v-container>
</template>

<script>
 // import axios from 'axios'
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
     'dialogQRreader': DialogQRreader
   },
   methods: {
     submit () {
       console.log('submit')
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
     }
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
