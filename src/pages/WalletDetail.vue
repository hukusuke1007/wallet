<template>
  <v-flex xs12 sm6 offset-sm3>
    <v-card>
      <v-toolbar card dark tabs color="view">
        <v-btn icon @click.native="back()" dark>
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-toolbar-title>{{ name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="updateAccount" :loading="isLoading"><v-icon>cached</v-icon></v-btn>
        <!-- タブツールバー -->
        <v-tabs color="select" slot="extension" v-model="tab" centered>
          <v-tabs-slider color="white"></v-tabs-slider>
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
            <nemAccount v-bind:id="id" v-bind:name="name" v-show="tab === `tab-0`"></nemAccount>
            <nemTransactionHistory v-show="tab === `tab-1`"></nemTransactionHistory>
            <nemTransactionCreate v-show="tab === `tab-2`"></nemTransactionCreate>
          </v-flex>
        </v-tabs-items>
      </div>
    </v-card>
  </v-flex>
</template>
<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import NemAccount from '@/components/NemAccount'
  import NemTransactionHistory from '@/components/NemTransactionHistory'
  import NemTransactionCreate from '@/components/NemTransactionCreate'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data: () => ({
      tab: 'tab-0',
      tabItems: [ {id: 0, data: 'アカウント'}, {id: 1, data: '送金履歴'}, {id: 2, data: '送金'} ],
      name: ''
    }),
    computed: {
      ...mapGetters('Nem', ['walletItem', 'pairKey', 'nemBalance', 'mosaics', 'transaction', 'transactionStatus', 'isLoading'])
    },
    components: {
      'nemAccount': NemAccount,
      'nemTransactionHistory': NemTransactionHistory,
      'nemTransactionCreate': NemTransactionCreate
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
    methods: {
      ...mapActions('Nem', ['doUpdateNemBalance', 'doUpdateMosaicsBalance', 'doUpdateTransaction', 'doTransactionStatus']),
      updateAccount () {
        this.doUpdateNemBalance()
        this.doUpdateMosaicsBalance()
        this.doUpdateTransaction()
      },
      reloadItem () {
        dbWrapper.getItemArray(dbWrapper.KEY_WALLET_INFO, this.id)
          .then((result) => {
            this.name = result.name
          }).catch((err) => {
            console.log(err)
            this.message = err
          })
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
