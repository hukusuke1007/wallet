<template>
  <v-flex xs12 sm6 offset-sm3>
    <v-card>
      <v-toolbar card color="primary" dark tabs>
        <v-btn icon @click.native="back()" dark>
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-toolbar-title>{{ name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="showDeleteWallet()">
          <v-icon>delete</v-icon>
        </v-btn>
        <!-- タブツールバー -->
        <v-tabs color="primary" slot="extension" v-model="tab" centered>
          <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab v-for="tabItem in tabItems" :key="`tab-${tabItem.id}`" :href="`#tab-${tabItem.id}`">
              {{ tabItem.data }}
            </v-tab>
        </v-tabs>
       </v-toolbar>
      <!-- 各タブの内容 -->
      <div class="w-break">
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="tabItem in tabItems" :key="`tab-${tabItem.id}`" :id="`tab-${tabItem.id}`">
          </v-tab-item>
          <v-flex xs12 sm10 offset-sm1>
            <nemAccount v-bind:id="id" v-show="tab === `tab-0`"></nemAccount>
            <nemTransactionHistory v-bind:id="id" v-show="tab === `tab-1`"></nemTransactionHistory>
            <nemTransactionCreate v-bind:id="id" v-show="tab === `tab-2`"></nemTransactionCreate>
          </v-flex>
        </v-tabs-items>
      </div>
    </v-card>

    <!-- 確認ダイアログ -->
    <dialogPositiveNegative v-bind:dialogVal="isShowDialogPositiveNegative"
                   titleVal="ウォレット削除"
                   v-bind:messageVal="dialogPositiveNegativeMessage"
                   positiveVal="削除する"
                   negativeVal="いいえ"
                   v-on:dialog-positive-negative-event-tap="tapSendPositiveNegative"></dialogPositiveNegative>
    <!-- 完了ダイアログ -->
    <dialogConfirm v-bind:dialogVal="isShowDialogConfirm"
                   titleVal="ウォレット削除"
                   v-bind:messageVal="dialogMessage"
                   v-on:dialog-confirm-event-tap-positive="tapConfirm"></dialogConfirm>
  </v-flex>
</template>
<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import NemAccount from '@/components/NemAccount'
  import NemTransactionHistory from '@/components/NemTransactionHistory'
  import NemTransactionCreate from '@/components/NemTransactionCreate'
  import DialogPositiveNegative from '@/components/DialogPositiveNegative'
  import DialogConfirm from '@/components/DialogConfirm'

  export default {
    data: () => ({
      tab: 'tab-0',
      tabItems: [ {id: 0, data: 'アカウント'}, {id: 1, data: '送金履歴'}, {id: 2, data: '送金'} ],
      name: '',
      isShowDialogPositiveNegative: false,
      dialogPositiveNegativeMessage: 'ウォレットを削除しますか？',
      isShowDialogConfirm: false,
      dialogMessage: '削除しました。'
    }),
    components: {
      'nemAccount': NemAccount,
      'nemTransactionHistory': NemTransactionHistory,
      'nemTransactionCreate': NemTransactionCreate,
      'dialogPositiveNegative': DialogPositiveNegative,
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
            this.name = result[dbWrapper.VALUE_NAME]
          }).catch((err) => {
            console.log(err)
            this.message = err
          })
      },
      deleteWallet () {
        dbWrapper.removeItemArray(dbWrapper.KEY_WALLET_INFO, Number.parseInt(this.id))
          .then((result) => {
            this.dialogMessage = '削除しました'
          }).catch((err) => {
            console.log(err)
            this.dialogMessage = 'ERROR：削除に失敗しました'
          })
      },
      showDeleteWallet () {
        console.log('delete')
        this.isShowDialogPositiveNegative = true
      },
      tapSendPositiveNegative (isPositive, message) {
        this.isShowDialogPositiveNegative = false
        if (isPositive) {
          this.deleteWallet()
          this.isShowDialogConfirm = true
        }
      },
      tapConfirm (message) {
        if (this.isShowDialogConfirm === true) {
          this.isShowDialogConfirm = false
          this.$router.push({ name: 'WalletList' })
        }
      },
      back () {
        history.go(-1)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
