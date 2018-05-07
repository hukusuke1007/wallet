<template>
    <v-card flat>
      <v-container fluid>
        <div class="w-break">
          <div class="subTitle">残高 (nem)</div>
          <v-card-text>
            <h2 class="font-color-shamrock">{{ nemBalance }} xem</h2>
          </v-card-text>
          <div v-if="selectMosaic">
            <div class="subTitle">モザイク残高 ({{ selectMosaic.namespaceId }})</div>
            <v-card-text>
              <h2 class="font-color-shamrock">{{ selectMosaic.amount }} {{ selectMosaic.name }}</h2>
            </v-card-text>
            <v-card-actions>
              <v-checkbox
                label="譲渡許可"
                :input-value="selectMosaic.transferable"
                color="success"
              ></v-checkbox>
              <v-checkbox
                label="徴収要求"
                :input-value="selectMosaic.supplyMutable"
                color="success"
              ></v-checkbox>
            </v-card-actions>
          </div>
            <v-flex justify-center>
            <v-select
              :items="mosaics"
              label="モザイク"
              v-model="selectMosaic"
              prepend-icon="view_quilt"></v-select>
            </v-flex>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field
              box
              label="ウォレット名"
              v-model="name"
              :rules="nameRules"
              :counter="16"
              required
            ></v-text-field>
          </v-form>
          <v-subheader>送金先アドレス</v-subheader><v-card-text>{{ walletItem.account.address.value }}</v-card-text>
          <v-subheader>公開鍵</v-subheader><v-card-text>{{ pairKey.publicKey }}</v-card-text>
          <v-subheader>秘密鍵</v-subheader><v-btn color="pink" class="white--text" @click="showPrivateKey">表示</v-btn>
          <v-subheader>アカウントのQRコード</v-subheader>
          <qriously v-model="qrValue" :size="200"></qriously>
          <br>
          <!-- ダイアログ -->
          <dialogConfirm v-bind:dialogVal="isShowDialog"
                         titleVal="秘密鍵"
                         v-bind:messageVal="pairKey.privateKey"
                         v-on:dialog-confirm-event-tap-positive="tapPositive"></dialogConfirm>
        </v-flex>
        </div>
      </v-container>
    </v-card>
</template>

<script>
  // import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import DialogConfirm from '@/components/DialogConfirm'
  import { mapGetters } from 'vuex'

  export default {
    data: () => ({
      valid: true,
      selectMosaic: null,
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
    computed: {
      ...mapGetters('Nem', ['walletItem', 'pairKey', 'nemBalance', 'mosaics', 'transactionStatus', 'isLoading'])
    },
    components: {
      'dialogConfirm': DialogConfirm
    },
    mounted () {
      this.reloadItem()
    },
    props: {
      name: {
        type: String,
        default: ''
      }
    },
    watch: {
      mosaics (after, before) {
        console.log(after)
        console.log(before)
        this.reloadItem()
      }
    },
    methods: {
      reloadItem () {
        if (this.mosaics.length > 0) {
          this.selectMosaic = this.mosaics[0]
        }
        this.qrValue = nemWrapper.getJSONInvoiceForQRcode(2, 1, this.name, this.walletItem.account.address.value, 0, '')
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
