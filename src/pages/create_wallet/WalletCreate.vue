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
    </v-form>
  </v-container>
</template>

<script>
 // import axios from 'axios'
 import localForage from 'localforage'
 import nemWrapper from '@/js/nem_wrapper'
 export default {
   data: () => ({
     valid: true,
     name: '',
     description: '',
     private_key: '',
     localforage_key: 'key_wallet_info',
     localforage_data: {id: '0', name: '', description: '', private_key: ''},
     nameRules: [
       value => !!value || '名前を入力してください',
       value => (value && value.length <= 16) || '最大文字数を超えています。'
     ],
     descriptionRules: [
       value => (value.length <= 1024) || '最大文字数を超えています。'
     ]
   }),
   mounted () {
     this.$setStorageDriver(localForage.LOCALSTORAGE)
     this.$getItem(this.localforage_key)
       .then((result) => {
         console.log('got value:', result)
       }).catch((err) => {
         // This code runs if there were any errors
         console.log(err)
       })
     nemWrapper.getAccount('aaaaa')
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
         // let transferTx = nem.model.objects.get('transferTransaction')
         // console.log(transferTx)
         this.localforage_data = {id: '0', name: this.name, description: this.description, private_key: this.private_key}
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
               }).catch((err) => {
                 console.log('localforage set item is failed. error:' + err)
               })
           }).catch((err) => {
             // This code runs if there were any errors
             console.log(err)
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
