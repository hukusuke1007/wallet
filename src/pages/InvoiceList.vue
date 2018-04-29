<template>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar card color="primary" dark tabs>
            <v-btn icon @click.native="back()" dark>
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
           <v-toolbar-title>請求書一覧</v-toolbar-title>
           <v-spacer></v-spacer>
           <v-btn icon @click.native="showDelete()" v-show="isDelete">
              <v-icon>delete</v-icon>
           </v-btn>
          </v-toolbar>
          <v-list two-line>
            <template v-for="(item, index) in items">
              <!-- <v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader> -->
              <v-list-tile avatar ripple :key="index" @click="tapItem(index)">
                <v-list-tile-action>
                  <v-icon>receipt</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                  <v-list-tile-sub-title class="text--primary">{{ item.headline }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>{{ item.date }}</v-list-tile-action-text>
                  <v-icon color="grey lighten-1">keyboard_arrow_right</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < items.length" :key="`divider-${index}`"></v-divider>
            </template>
          </v-list>
        </v-card>
        <v-card>
        <v-card-text style="height: 20px; position: relative">
            <v-btn
              absolute
              dark
              fab
              bottom
              right
              color="pink"
              @click="tapAdd()"
            >
              <v-icon>add</v-icon>
            </v-btn>
            </v-card-text>
          </v-card>
      </v-flex>
    <!-- 削除ダイアログ -->
    <dialogPositiveNegative v-bind:dialogVal="isShowDialogPositiveNegative"
                   v-bind:titleVal="dialogPositiveNegativeTitle"
                   v-bind:messageVal="dialogPositiveNegativeMessage"
                   v-bind:positiveVal="dialogPositiveMessage"
                   v-bind:negativeVal="dialogNegativeMessage"
                   v-on:dialog-positive-negative-event-tap="tapSendPositiveNegative"></dialogPositiveNegative>
    <!-- 完了ダイアログ -->
    <dialogConfirm v-bind:dialogVal="isShowDialogConfirm"
                   v-bind:titleVal="dialogTitle"
                   v-bind:messageVal="dialogMessage"
                   v-on:dialog-confirm-event-tap-positive="tapConfirm"></dialogConfirm>

    <!-- 選択ダイアログ -->
    <dialogSelectInvoice v-bind:dialogVal="isShowDialogSelectInvoice"
                   v-bind:titleVal="dialogSelectInvoiceTitle"
                   v-on:dialog-select-invoice-event-tap-operate="tapDialogOperate"
                   v-on:dialog-select-invoice-event-tap-close="tapDialogClose"></DialogSelectInvoice>
    </v-layout>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import DialogConfirm from '@/components/DialogConfirm'
  import DialogPositiveNegative from '@/components/DialogPositiveNegative'
  import DialogSelectInvoice from '@/components/DialogSelectInvoice'

  export default {
    data: () => ({
      items: [],
      selectItem: {},
      isDelete: false,
      isShowDialogConfirm: false,
      dialogTitle: '請求書の削除',
      dialogMessage: '削除しました。',
      isShowDialogPositiveNegative: false,
      dialogPositiveNegativeTitle: '請求書の削除',
      dialogPositiveNegativeMessage: '全ての請求書を削除しますか？',
      dialogPositiveMessage: 'はい',
      dialogNegativeMessage: 'いいえ',
      isShowDialogSelectInvoice: false,
      dialogSelectInvoiceTitle: '',
      selectOperate: ''
    }),
    components: {
      'dialogPositiveNegative': DialogPositiveNegative,
      'dialogConfirm': DialogConfirm,
      'dialogSelectInvoice': DialogSelectInvoice
    },
    mounted () {
      console.log('mounted')
      // this.isDelete = false
      this.reloadItems()
    },
    watch: {
      items (val) {
        if (val.length !== 0) {
          this.isDelete = true
        } else {
          this.isDelete = false
        }
      }
    },
    methods: {
      reloadItems () {
        dbWrapper.getItemArray(dbWrapper.KEY_INVOICE, dbWrapper.VALUE_ALL)
          .then((result) => {
            if (result !== null) {
              this.items = []
              result.forEach((element) => {
                let item = {}
                item.id = element.id
                item.title = element.name
                item.headline = element.senderAddr
                item.subtitle = element.message
                item.isCheck = false
                this.items.push(item)
              })
              // 新しい順にソート.
              this.items.sort((a, b) => {
                if (a.id > b.id) return -1
                if (a.id < b.id) return 1
                return 0
              })
            }
          }).catch((err) => {
            console.log(err)
          })
      },
      copyInvoice (id) {
        console.log('copyInvoice:getItemArray' + id)
        this.dialogTitle = '請求書の複製'
        dbWrapper.getItemArray(dbWrapper.KEY_INVOICE, Number(id))
          .then((result) => {
            let copyData = result
            dbWrapper.setItemArray(dbWrapper.KEY_INVOICE, copyData, false, -1)
              .then((result) => {
                console.log(result)
                this.reloadItems()
                this.dialogMessage = 'コピーしました。'
                this.isShowDialogConfirm = true
                this.isShowDialogSelectInvoice = false
              }).catch((err) => {
                console.log(err)
                this.dialogMessage = 'ERROR:データ保存に失敗しました。'
                this.isShowDialogConfirm = true
              })
          }).catch((err) => {
            console.log(err)
            this.dialogMessage = 'ERROR:データ保存に失敗しました。'
            this.isShowDialogConfirm = true
          })
      },
      deleteInvoice (id) {
        let operate = dbWrapper.VALUE_ALL
        if (id !== -1) { operate = Number(id) }
        dbWrapper.removeItemArray(dbWrapper.KEY_INVOICE, operate)
          .then((result) => {
            this.dialogMessage = '削除しました'
            this.deleteItems(id)
          }).catch((err) => {
            console.log(err)
            this.dialogMessage = 'ERROR：削除に失敗しました'
          })
      },
      deleteItems (id) {
        if (id === -1) {
          this.items = []
        } else {
          this.reloadItems()
        }
      },
      tapItem (index) {
        console.log('tap:' + index + ' id:' + this.items[index].id)
        this.selectItem = this.items[index]
        this.dialogSelectInvoiceTitle = '請求書: ' + this.selectItem.title
        this.isShowDialogSelectInvoice = true
        // this.$router.push({ name: 'WalletDetail', params: {id: String(this.items[index].id)} })
      },
      tapAdd () {
        this.$router.push({ name: 'InvoiceCreate' })
      },
      showDelete () {
        this.selectOperate = 'allDelete'
        this.dialogTitle = '請求書の削除'
        this.dialogMessage = '削除しました。'
        this.dialogPositiveNegativeTitle = '請求書の削除'
        this.dialogPositiveNegativeMessage = '全ての請求書を削除しますか？'
        this.isShowDialogPositiveNegative = true
      },
      tapSendPositiveNegative (isPositive, message) {
        this.isShowDialogPositiveNegative = false
        if (isPositive) {
          if (this.selectOperate === 'allDelete') {
            this.dialogTitle = '請求書の削除'
            this.dialogMessage = '削除しました。'
            this.deleteInvoice(-1)
            this.isShowDialogConfirm = true
          } else if (this.selectOperate === 'copy') {
            this.copyInvoice(this.selectItem.id)
          } else if (this.selectOperate === 'delete') {
            this.dialogTitle = '請求書の削除'
            this.dialogMessage = '削除しました。'
            this.deleteInvoice(this.selectItem.id)
            this.isShowDialogSelectInvoice = false
            this.isShowDialogConfirm = true
          }
        }
      },
      tapConfirm (message) {
        if (this.isShowDialogConfirm === true) {
          this.isShowDialogConfirm = false
          // this.$router.go({ name: 'InvoiceList' }) ブラウザリロードだが値を使わない。値を初期化する.
        }
      },
      tapDialogOperate (num, operate) {
        console.log('num: ' + num + ' operate: ' + operate)
        this.selectOperate = operate
        let id = String(this.selectItem.id)
        if (operate === 'open') {
          this.$router.push({ name: 'InvoiceShow', params: {id: id, num: Number(num)} })
        } else if (operate === 'edit') {
          this.$router.push({ name: 'InvoiceCreate', params: {id: id} })
        } else if (operate === 'copy') {
          this.dialogPositiveNegativeTitle = '請求書の複製'
          this.dialogPositiveNegativeMessage = '請求書をコピーしますか？'
          this.isShowDialogPositiveNegative = true
        } else if (operate === 'delete') {
          this.dialogPositiveNegativeTitle = '請求書の削除'
          this.dialogPositiveNegativeMessage = '請求書を削除しますか？'
          this.isShowDialogPositiveNegative = true
        }
      },
      tapDialogClose () {
        this.isShowDialogSelectInvoice = false
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
