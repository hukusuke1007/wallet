<template>
  <!-- <v-layout row justify-center> -->
  <v-dialog v-model="dialog"
   fullscreen
   hide-overlay
   transition="dialog-bottom-transition"
   scrollable
  >
    <v-card tile>
      <v-toolbar card color="pink accent-1" dark tabs>
        <v-btn icon @click.native="close()" dark>
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>ウォレット {{ name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="close()">
          <v-icon>delete</v-icon>
        </v-btn>
        <!-- タブツールバー -->
        <v-tabs color="pink accent-1" slot="extension" v-model="tab" grow>
          <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab v-for="tabItem in tabItems" :key="`tab-${tabItem.id}`" :href="`#tab-${tabItem.id}`">
              {{ tabItem.data }}
            </v-tab>
        </v-tabs>
       </v-toolbar>
      <!-- 各タブの内容 -->
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="tabItem in tabItems" :key="`tab-${tabItem.id}`" :id="`tab-${tabItem.id}`">
          <v-card flat>
            <v-card-text>{{ tabItem.data }}</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
          <!--
          <v-flex>
            <p>{{ idVal }}</p>
            <p>{{ date }}</p>
            <p>{{ name }}</p>
            <p>{{ address }}</p>
            <p>{{ publicKey }}</p>
            <p>{{ privateKey }}</p>
          </v-flex>
          -->
    </v-card>
  </v-dialog>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'

  export default {
    data: () => ({
      tab: 'tab-1',
      tabItems: [ {id: 0, data: 'アカウント'}, {id: 1, data: '送金履歴'}, {id: 2, data: '送金'} ],
      dialog: false,
      date: '',
      name: '',
      description: '',
      address: '',
      publicKey: '',
      privateKey: ''
    }),
    mounted () {
      console.log('mounted')
    },
    props: {
      dialogVal: {
        type: Boolean,
        default: false
      },
      idVal: {
        type: Number,
        default: -1
      }
    },
    watch: {
      dialogVal (val) {
        this.dialog = val
        if (this.dialog === true) {
          this.reloadItem()
        } else {
          this.date = ''
          this.name = ''
          this.description = ''
          this.address = ''
          this.publicKey = ''
          this.privateKey = ''
        }
      }
    },
    methods: {
      reloadItem () {
        console.log('reloadItem:' + this.idVal)
        dbWrapper.getItemArray(dbWrapper.KEY_WALLET_INFO, this.idVal)
          .then((result) => {
            this.date = result[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_CREATION_DATE]
            this.name = result[dbWrapper.VALUE_NAME]
            this.description = result[dbWrapper.VALUE_DESCRIPTION]
            this.address = result[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_ADDRESS]['value']
            let pairKey = nemWrapper.getPairKey(result[dbWrapper.VALUE_WALLET_ACCOUNT])
            this.publicKey = pairKey[nemWrapper.PUBLICK_KEY]
            this.privateKey = pairKey[nemWrapper.PRIVATE_KEY]
          }).catch((err) => {
            console.log(err)
            this.message = err
          })
      },
      close () {
        console.log('close')
        this.$emit('dialog-wallet-detail-event-close', 'close')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
