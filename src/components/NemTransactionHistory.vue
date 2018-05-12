<template>
    <v-card flat>
          <v-list two-line>
            <v-subheader>送金履歴一覧 {{ items.length }}件</v-subheader>

            <template v-for="(item, index) in items">
              <v-list-tile ripple :key="index" @click="tapItem(index)">
                <v-list-tile-content v-show="item.type === `TransferTransaction`">
                  <v-list-tile-title><div :class="item.depositId">{{ item.deposit }}</div></v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.recipientAddr }}</v-list-tile-sub-title>
                  <div v-if="item.mosaicsAddInfos.length===0">
                    <v-list-tile-sub-title>送金量: {{ item.amount }}</v-list-tile-sub-title>
                  </div>
                  <div v-else>
                    <v-list-tile-sub-title>モザイクの詳細はこちら</v-list-tile-sub-title>
                  </div>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>{{ item.timeStamp }}</v-list-tile-action-text>
                  <v-list-tile-action-text><div :class="item.statusId">{{ item.status }}</div></v-list-tile-action-text>
                  <v-icon color="grey lighten-1">keyboard_arrow_right</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < items.length" :key="`divider-${index}`"></v-divider>
            </template>

          </v-list>

          <!-- 履歴詳細ダイアログ -->
          <DialogHistoryDetail v-bind:dialogVal="isShowHistoryDetail"
                         v-bind:item="selectItem"
                         v-on:dialog-history-detail-close="tapHistoryDetailClose"></DialogHistoryDetail>
    </v-card>
</template>

<script>
  // import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import DialogHistoryDetail from '@/components/DialogHistoryDetail'
  import {TransferTransaction, MultisigTransaction} from 'nem-library'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data: () => ({
      isShowHistoryDetail: false,
      items: [],
      selectItem: {}
    }),
    computed: {
      ...mapGetters('Nem', ['walletItem', 'pairKey', 'nemBalance', 'mosaics', 'transaction', 'transactionStatus', 'isLoading', 'address'])
    },
    components: {
      DialogHistoryDetail
    },
    mounted () {
      this.reloadItem()
    },
    props: {
      id: {
        type: Number,
        default: -1
      }
    },
    watch: {
      transaction (val) {
        console.log('history_transaction', val)
        this.setItemsForTransaction(val)
      }
      /*
      transactionStatus (val) {
        console.log('transactionStatus', val)
        if (val === 'unconfirmed') {
          console.log('transactionStatus: unconfirmed')
          this.$toast('トランザクション承認中...')
        } else if (val === 'confirmed') {
          this.$toast('トランザクションが承認されました。反映されない場合は更新ボタンを押してください。')
          this.doTransactionStatus('none')
        }
      }
      */
    },
    methods: {
      ...mapActions('Nem', ['doUpdateTransaction', 'doTransactionStatus']),
      reloadItem () {
        this.doUpdateTransaction()
      },
      setItemsForTransaction (transactions) {
        this.items = []
        transactions.forEach((element, index) => {
          // console.log(element)
          if (element instanceof TransferTransaction) {
            let convMessage = nemWrapper.getMessageFromPlain(element.message.payload)
            let dateString = element.timeWindow.timeStamp.toString().replace('T', ' ')
            let feeVal = element.fee / nemWrapper.NEM_UNIT
            let nameVal = element._xem.mosaicId.name
            let namespaceVal = element._xem.mosaicId.namespaceId
            let depositMsg = '入金'
            let depositMsgColor = 'recieve'
            if (element.signer.address.value === this.address) {
              depositMsg = '出金'
              depositMsgColor = 'send'
            }
            let amount = element._xem.amount
            let confirmMsg = '承認'
            let confirmMsgColor = 'confirm'
            let hash = ''
            if (element.transactionInfo == null) {
              confirmMsg = '未承認'
              confirmMsgColor = 'unConfirm'
              amount = '承認中...'
            } else {
              hash = element.transactionInfo.hash.data
            }

            let item = {
              type: 'TransferTransaction',
              message: convMessage,
              fee: feeVal,
              recipientAddr: element.recipient.value,
              senderAddr: element.signer.address.value,
              timeStamp: dateString,
              hash: hash,
              name: nameVal,
              namespace: namespaceVal,
              amount: amount,
              mosaics: element._mosaics,
              mosaicsAddInfos: [],
              deposit: depositMsg,
              depositId: depositMsgColor,
              status: confirmMsg,
              statusId: confirmMsgColor
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
        // 日付順にソート.
        this.items.sort((a, b) => {
          if (a.timeStamp > b.timeStamp) return -1
          if (a.timeStamp < b.timeStamp) return 1
          return 0
        })
        // モザイク送金履歴を確認.
        this.items.map((element, index, array) => {
          if (element.mosaics && element.mosaics.length > 0) {
            // console.log('mosaics_item: ' + element.timeStamp)
            element.mosaics.forEach((mosaic) => {
              // console.log(mosaic)
              if ((mosaic.mosaicId.name !== 'xem') && (mosaic.mosaicId.namespaceId !== 'nem')) {
                nemWrapper.getMosaicDefinition(mosaic.mosaicId)
                  .then((result) => {
                    console.log(result)
                    let mosaicsAddInfo = {
                      name: result.id.name,
                      namespaceId: result.id.namespaceId,
                      quantity: mosaic.quantity,
                      divisibility: result.properties.divisibility
                    }
                    element.mosaicsAddInfos.push(mosaicsAddInfo)
                    array[index] = element
                  }).catch((error) => {
                    console.error(error)
                    array[index] = element
                  })
              } else {
                let mosaicsAddInfo = {
                  name: 'xem',
                  namespaceId: 'nem',
                  quantity: mosaic.quantity,
                  divisibility: 6
                }
                element.mosaicsAddInfos.push(mosaicsAddInfo)
                array[index] = element
              }
            })
          } else {
            array[index] = element
          }
        })
        let count = this.items.length - 1
        this.header = '送金履歴一覧 (' + count + '件）'
      },
      tapItem (index) {
        this.selectItem = this.items[index]
        console.log(this.selectItem)
        this.isShowHistoryDetail = true
      },
      tapHistoryDetailClose (message) {
        this.isShowHistoryDetail = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.send { color: #ff0000; }
.recieve { color: #008000; }
.confirm { color: #00b894; font-weight: bold;}
.unConfirm { color: #fdcb6e; font-weight: bold;}
</style>
