<template>
  <div class="w-break">
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar card color="primary" dark tabs>
          <v-btn icon @click.native="back()" dark>
            <v-icon>keyboard_arrow_left</v-icon>
          </v-btn>
          <v-toolbar-title>送金</v-toolbar-title>
         </v-toolbar>
         <div class="sideOffset">
          <v-select
            :items="items"
            label="ウォレット"
            v-model="selectItem"
            prepend-icon="credit_card"></v-select>
          </div>
      </v-card>
    </v-flex>
    <br>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <nemTransactionCreate v-bind:id="String(selectItem.id)" v-if="selectItem"></nemTransactionCreate>
        <div v-else>
         <router-link to="/create">
          <v-card-text>ウォレットを作成してください</v-card-text>
         </router-link>
        </div>
      </v-card>
    </v-flex>
  </div>
</template>
<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import NemTransactionCreate from '@/components/NemTransactionCreate'

  export default {
    data: () => ({
      selectItem: null,
      items: []
    }),
    components: {
      'nemTransactionCreate': NemTransactionCreate
    },
    mounted () {
      this.reloadItem()
    },
    methods: {
      reloadItem () {
        dbWrapper.getItemArray(dbWrapper.KEY_WALLET_INFO, dbWrapper.VALUE_ALL)
          .then((result) => {
            result.forEach((element) => {
              let dateString = element[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_CREATION_DATE].replace('T', ' ').slice(0, -4)
              let item = {}
              item.id = element[dbWrapper.VALUE_PRIMARY_ID]
              item.date = dateString
              item.text = element[dbWrapper.VALUE_NAME]
              item.headline = element[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_ADDRESS]['value']
              item.subtitle = element[dbWrapper.VALUE_DESCRIPTION]
              // console.log(item)
              this.items.push(item)
            })
            // 新しい順にソート.
            this.items.sort((a, b) => {
              if (a.id > b.id) return -1
              if (a.id < b.id) return 1
              return 0
            })
            this.selectItem = this.items[0]
          }).catch((err) => {
            console.log(err)
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
