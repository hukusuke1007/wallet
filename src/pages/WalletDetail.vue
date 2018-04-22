<template>
  <v-flex xs12 sm6 offset-sm3>
    <v-card>
      <v-toolbar card color="primary" dark tabs>
        <v-btn icon @click.native="back()" dark>
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-toolbar-title>{{ name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="deleteWallet()">
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
  </v-flex>
</template>
<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import NemAccount from '@/components/NemAccount'
  import NemTransactionHistory from '@/components/NemTransactionHistory'
  import NemTransactionCreate from '@/components/NemTransactionCreate'
  export default {
    data: () => ({
      tab: 'tab-0',
      tabItems: [ {id: 0, data: 'アカウント'}, {id: 1, data: '送金履歴'}, {id: 2, data: '送金'} ],
      name: ''
    }),
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
        console.log('delete')
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
