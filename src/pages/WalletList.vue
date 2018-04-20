<template>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-list two-line>
            <template v-for="(item, index) in items">
              <v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>
              <v-list-tile avatar v-else ripple :key="index" @click="tapItem(index)">
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
        <!-- ウォレットダイアログ -->
        <dialogWallet  v-bind:dialogVal="isShowDialog"
                       v-bind:idVal="selectId"
                       v-on:dialog-wallet-detail-event-close="close()"></dialogWallet>
      </v-flex>
    </v-layout>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import DialogWallet from '@/components/DialogWalletDetail'

  export default {
    data: () => ({
      isShowDialog: false,
      selectId: -1,
      items: [
        { header: 'ウォレット一覧' }
      ]
    }),
    components: {
      'dialogWallet': DialogWallet
    },
    mounted () {
      console.log('mounted')
      this.reloadItems()
    },
    methods: {
      reloadItems () {
        dbWrapper.getItemArray(dbWrapper.KEY_WALLET_INFO, dbWrapper.VALUE_ALL)
          .then((result) => {
            result.forEach((element) => {
              let item = {}
              item.id = element[dbWrapper.VALUE_PRIMARY_ID]
              item.date = element[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_CREATION_DATE]
              item.title = element[dbWrapper.VALUE_NAME]
              item.headline = element[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_ADDRESS]['value']
              item.subtitle = element[dbWrapper.VALUE_DESCRIPTION]
              console.log(item)
              this.items.push(item)
            })
            // 新しい順にソート.
            this.items.sort((a, b) => {
              if (a.id > b.id) return -1
              if (a.id < b.id) return 1
              return 0
            })
          }).catch((err) => {
            console.log(err)
          })
      },
      tapItem (index) {
        this.selectId = this.items[index].id
        this.isShowDialog = true
        console.log('tap:' + index + ' id:' + this.selectId)
      },
      close (message) {
        this.isShowDialog = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
