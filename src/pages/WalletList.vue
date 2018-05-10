<template>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar card color="primary" dark tabs>
            <v-btn icon @click.native="back()" dark>
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
           <v-toolbar-title>ウォレット一覧</v-toolbar-title>
          </v-toolbar>
          <v-list two-line>
            <template v-for="(item, index) in items">
              <!--<v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>-->
              <v-list-tile avatar ripple :key="index" @click="tapItem(index)">
                <v-list-tile-action>
                  <v-icon>credit_card</v-icon>
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
    </v-layout>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import { mapActions } from 'vuex'
  export default {
    data: () => ({
      items: []
    }),
    mounted () {
      console.log('mounted')
      this.reloadItems()
    },
    methods: {
      ...mapActions('Nem', ['doUpdateNemBalance', 'doUpdateMosaicsBalance', 'doObserveTransaction', 'doWalletItem', 'doAddress', 'doPairKey', 'doTransactionStatus']),
      reloadItems () {
        dbWrapper.getItemArray(dbWrapper.KEY_WALLET_INFO, dbWrapper.VALUE_ALL)
          .then((result) => {
            result.forEach((element) => {
              let item = {}
              item.id = element.id
              item.title = element.name
              item.headline = element.account.address.value
              item.subtitle = element.description
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
        console.log('tap:' + index + ' id:' + this.items[index].id)
        dbWrapper.getItemArray(dbWrapper.KEY_WALLET_INFO, this.items[index].id)
          .then((result) => {
            if (result) {
              this.doWalletItem(result)
              this.doAddress(result.account.address.value)
              this.doPairKey(nemWrapper.getPairKey(result.account, nemWrapper.PASSWORD))
              this.doUpdateNemBalance()
              this.doUpdateMosaicsBalance()
              this.$router.push({ name: 'WalletDetail', params: {id: this.items[index].id} })
            }
          }).catch((err) => {
            console.log(err)
          })
      },
      tapAdd () {
        this.$router.push({ name: 'Create' })
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
