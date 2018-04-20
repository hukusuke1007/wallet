<template>
  <v-flex xs12 sm6 offset-sm3>
    <v-card>
      <v-toolbar card color="primary" dark tabs>
        <v-btn icon @click.native="back()" dark>
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-toolbar-title>ウォレット {{ name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="deleteWallet()">
          <v-icon>delete</v-icon>
        </v-btn>
        <!-- タブツールバー -->
        <v-tabs color="primary" slot="extension" v-model="tab" grow>
          <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab v-for="tabItem in tabItems" :key="`tab-${tabItem.id}`" :href="`#tab-${tabItem.id}`">
              {{ tabItem.data }}
            </v-tab>
        </v-tabs>
       </v-toolbar>
      <!-- 各タブの内容 -->
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="tabItem in tabItems" :key="`tab-${tabItem.id}`" :id="`tab-${tabItem.id}`">
          <v-card flat>
            <!-- アカウント -->
            <v-flex sm10 offset-sm1 v-if="tab === `tab-0`">
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-text-field
                  box
                  label="ウォレット名"
                  v-model="name"
                  :rules="nameRules"
                  :counter="16"
                  required
                ></v-text-field>
                <v-text-field
                  box
                  multi-line
                  label="ウォレットの説明"
                  v-model="description"
                  :rules="descriptionRules"
                  :counter="1024"
                ></v-text-field>
              </v-form>
              <v-subheader>送金先アドレス</v-subheader><v-card-text>{{ address }}</v-card-text>
              <v-subheader>公開鍵</v-subheader><v-card-text>{{ publicKey }}</v-card-text>
              <v-subheader>秘密鍵</v-subheader><v-btn color="pink" class="white--text" @click="showPrivateKey">表示</v-btn>
              <v-subheader>アカウントのQRコード</v-subheader>
              <qriously v-model="qrValue" :size="300" />
              <br>
              <!-- ダイアログ -->
              <dialogConfirm v-bind:dialogVal="isShowDialog"
                             titleVal="秘密鍵"
                             v-bind:messageVal="privateKey"
                             v-on:dialog-confirm-event-tap-positive="tapPositive"></dialogConfirm>
            </v-flex>
            <!-- 送金履歴 -->
            <v-flex sm10 offset-sm1 v-if="tab === `tab-1`">
              <v-card-text>{{ tabItem.data }}</v-card-text>
            </v-flex>
            <!-- 送金 -->
            <v-flex sm10 offset-sm1 v-if="tab === `tab-2`">
              <v-card-text>{{ tabItem.data }}</v-card-text>
              <p>{{ id }}</p>
              <p>{{ date }}</p>
              <p>{{ name }}</p>
              <p>{{ address }}</p>
              <p>{{ publicKey }}</p>
              <p>{{ privateKey }}</p>
            </v-flex>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-flex>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import DialogConfirm from '@/components/DialogConfirm'

  export default {
    data: () => ({
      tab: 'tab-0',
      tabItems: [ {id: 0, data: 'アカウント'}, {id: 1, data: '送金履歴'}, {id: 2, data: '送金'} ],
      valid: true,
      date: '',
      name: '',
      description: '',
      address: '',
      publicKey: '',
      privateKey: '',
      qrValue: '',
      isShowDialog: false,
      nameRules: [
        value => !!value || '名前を入力してください',
        value => (value && value.length <= 16) || '最大文字数を超えています。'
      ],
      descriptionRules: [
        value => (value.length <= 1024) || '最大文字数を超えています。'
      ],
      addressRules: [
        value => (value.length <= 1024) || '最大文字数を超えています。'
      ]
    }),
    components: {
      'dialogConfirm': DialogConfirm
    },
    mounted () {
      console.log('mounted')
      this.reloadItem()
    },
    props: {
      id: {
        type: Number,
        default: -1
      }
    },
    /*
    watch: {
      dialogVal (val) {
        this.dialog = val
        if (this.dialog === true) {
          this.reloadItem()
        } else {
          this.date = ''
          this.name = ''
          this.description = ''
          this.address = ''
          this.publicKey = ''
          this.privateKey = ''
        }
      }
    },
    */
    methods: {
      reloadItem () {
        console.log('reloadItem:' + this.id)
        dbWrapper.getItemArray(dbWrapper.KEY_WALLET_INFO, this.id)
          .then((result) => {
            this.date = result[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_CREATION_DATE]
            this.name = result[dbWrapper.VALUE_NAME]
            this.description = result[dbWrapper.VALUE_DESCRIPTION]
            this.address = result[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_ADDRESS]['value']
            let pairKey = nemWrapper.getPairKey(result[dbWrapper.VALUE_WALLET_ACCOUNT])
            this.publicKey = pairKey[nemWrapper.PUBLICK_KEY]
            this.privateKey = pairKey[nemWrapper.PRIVATE_KEY]
            this.qrValue = JSON.stringify(nemWrapper.getJSONInvoiceForQRcode(2, 1, this.name, this.address, 0, this.description))
          }).catch((err) => {
            console.log(err)
            this.message = err
          })
      },
      showPrivateKey () {
        this.isShowDialog = true
      },
      tapPositive (message) {
        this.isShowDialog = false
      },
      deleteWallet () {
        console.log('delete')
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
