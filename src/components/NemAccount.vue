<template>
    <v-card flat>
      <div class="w-break">
        <v-subheader>残高</v-subheader><v-card-text><h2 class="font-color-shamrock">{{ balance }}</h2></v-card-text>
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
        <qriously v-model="qrValue" :size="300"></qriously>
        <br>
        <!-- ダイアログ -->
        <dialogConfirm v-bind:dialogVal="isShowDialog"
                       titleVal="秘密鍵"
                       v-bind:messageVal="privateKey"
                       v-on:dialog-confirm-event-tap-positive="tapPositive"></dialogConfirm>
      </v-flex>
      </div>
    </v-card>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import DialogConfirm from '@/components/DialogConfirm'

  export default {
    data: () => ({
      valid: true,
      date: '',
      balance: 0,
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
      ]
    }),
    components: {
      'dialogConfirm': DialogConfirm
    },
    mounted () {
      this.reloadItem()
    },
    props: {
      id: {
        type: String,
        default: -1
      }
    },
    methods: {
      reloadItem () {
        let id = Number.parseInt(this.id)
        // console.log('reloadItem:' + id)
        dbWrapper.getItemArray(dbWrapper.KEY_WALLET_INFO, id)
          .then((result) => {
            this.date = result[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_CREATION_DATE]
            this.name = result[dbWrapper.VALUE_NAME]
            this.description = result[dbWrapper.VALUE_DESCRIPTION]
            this.address = result[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_ADDRESS]['value']
            let pairKey = nemWrapper.getPairKey(result[dbWrapper.VALUE_WALLET_ACCOUNT])
            this.publicKey = pairKey[nemWrapper.PUBLICK_KEY]
            this.privateKey = pairKey[nemWrapper.PRIVATE_KEY]
            this.qrValue = JSON.stringify(nemWrapper.getJSONInvoiceForQRcode(2, 1, this.name, this.address, 0, this.description))

            nemWrapper.getAccount(this.address)
              .then((result) => {
                this.balance = result.balance.balance / nemWrapper.NEM_UNIT
              })
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
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
