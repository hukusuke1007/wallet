<template>
    <v-card flat>
          <v-list two-line>
            <template v-for="(item, index) in items">
              <v-subheader v-if="item.header" :key="item.header">{{ header }}</v-subheader>
              <v-list-tile v-else ripple :key="index" @click="tapItem(index)">
                <v-list-tile-content v-show="item.type === `TransferTransaction`">
                  <v-list-tile-title>通貨: {{ item.name }}:{{ item.namespace }}</v-list-tile-title>
                  <v-list-tile-sub-title>受取先: {{ item.recipientAddr }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>送金量: {{ item.amount }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>メッセージ: {{ item.message }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>{{ item.timeStamp }}</v-list-tile-action-text>
                  <v-list-tile-action-text><div :class="item.depositColor">{{ item.deposit }}</div></v-list-tile-action-text>
                  <v-list-tile-action-text>手数料: {{ item.fee }}</v-list-tile-action-text>
                  <!-- <v-icon color="grey lighten-1">keyboard_arrow_right</v-icon> -->
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < items.length" :key="`divider-${index}`"></v-divider>
            </template>
          </v-list>

          <!-- ダイアログ -->
          <dialogConfirm v-bind:dialogVal="isShowDialog"
                         v-bind:titleVal="title"
                         v-bind:messageVal="dialogMessage"
                         v-on:dialog-confirm-event-tap-positive="tapPositive"></dialogConfirm>
    </v-card>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import DialogConfirm from '@/components/DialogConfirm'
  import {TransferTransaction, MultisigTransaction} from 'nem-library'

  export default {
    data: () => ({
      header: '送金履歴一覧 (最大100件)',
      title: '',
      address: '',
      isShowDialog: false,
      dialogMessage: '',
      items: [
        { header: '送金履歴一覧 (最大100件)' }
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
            this.address = result[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_ADDRESS]['value']
            let pairKey = nemWrapper.getPairKey(result[dbWrapper.VALUE_WALLET_ACCOUNT])
            this.publicKey = pairKey[nemWrapper.PUBLICK_KEY]
            nemWrapper.getTransaction(this.address, 100, undefined, undefined)
              .then((result) => {
                result.forEach((element, index) => {
                  // console.log(element)
                  if (element instanceof TransferTransaction) {
                    let convMessage = nemWrapper.getMessageFromPlain(element.message.payload)
                    let dateString = element.timeWindow.timeStamp.toString().replace('T', ' ')
                    let feeVal = element.fee / nemWrapper.NEM_UNIT
                    let nameVal = element._xem.mosaicId.name
                    let namespaceVal = element._xem.mosaicId.namespaceId
                    let depositMsg = '入金'
                    let depositMsgColor = 'example2'
                    if (element.signer.address.value === this.address) {
                      depositMsg = '出金'
                      depositMsgColor = 'example1'
                    }
                    let item = {
                      type: 'TransferTransaction',
                      message: convMessage,
                      fee: feeVal,
                      recipientAddr: element.recipient.value,
                      senderAddr: element.signer.address.value,
                      timeStamp: dateString,
                      hash: element.transactionInfo.hash.data,
                      name: nameVal,
                      namespace: namespaceVal,
                      amount: element._xem.amount,
                      deposit: depositMsg,
                      depositColor: depositMsgColor
                    }
                    this.items.push(item)
                  } else if (element instanceof MultisigTransaction) {
                    /*
                    console.log(element)
                    let item = {
                      type: 'MultisigTransaction'
                      message: element.message.payload,
                      fee: element.fee,
                      recipientAddr: element.recipient.value,
                      senderAddr: element.signer.address.value,
                      timeStamp: element.timeStamp,
                      hash: element.transactionInfo.hash.data,
                      mosaics: element._mosaics,
                      xemAmount: element._xem.amount
                    }
                    this.items.push(item)
                    */
                  }
                })
                this.header = '送金履歴一覧 (' + this.items.length + '件）'
              })
          }).catch((err) => {
            console.log(err)
            this.message = err
          })
      },
      tapItem (index) {
        this.title = '送金履歴: ' + index
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
.example1 { color: #ff0000; }
.example2 { color: #008000; }
</style>
