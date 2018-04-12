<template>
  <v-container fluid>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-flex xs12>
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

      <v-flex xs12>
      <v-text-field
        box
        label="秘密鍵"
        v-model="privateKey"
        :rules="privateKeyRules"
        :counter="64"
        required
      ></v-text-field>
      <v-btn color="orange darken-1" class="white--text" @click="readQR" block>QRコード読み取り</v-btn>
      </v-flex>
      <br><br>
      <v-flex xs12>
      <v-btn color="info" @click="submit" :disabled="!valid">作成</v-btn>
      <v-btn @click="clear">クリア</v-btn>
      </v-flex>

    </v-form>
  </v-container>
</template>

<script>
 import axios from 'axios'
 export default {
   data: () => ({
     valid: true,
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
     submit () {
       if (this.$refs.form.validate()) {
         axios.post('/api/submit', {
           name: this.name,
           description: this.description
         })
       }
     },
     readQR () {
       console.log('readQR')
     },
     clear () {
       this.$refs.form.reset()
     }
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>



</style>
