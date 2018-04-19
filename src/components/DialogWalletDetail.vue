<template>
  <!-- <v-layout row justify-center> -->
  <v-dialog v-model="dialog"
   fullscreen
   hide-overlay
   transition="dialog-bottom-transition"
   scrollable
  >
    <v-card tile>
      <v-toolbar card dark color="pink accent-1">
        <v-btn icon @click.native="close()" dark>
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>ウォレット</v-toolbar-title>
      </v-toolbar>
      <v-flex>
        <p>{{ message }}</p>
        <p>{{ item.id }}</p>
        <p>{{ item.date }}</p>
        <p>{{ item.name }}</p>
        <p>{{ item.address }}</p>
        <p>{{ item.publicKey }}</p>
        <p>{{ item.privateKey }}</p>
      </v-flex>
    </v-card>
  </v-dialog>
  <!-- </v-layout> -->
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'

  export default {
    data: () => ({
      dialog: false,
      message: 'first',
      item: {}
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
          this.item = {}
        }
      }
    },
    methods: {
      reloadItem () {
        console.log('reloadItem:' + this.idVal)
        dbWrapper.getItemArray(dbWrapper.KEY_WALLET_INFO, this.idVal)
          .then((result) => {
            this.item.id = result[dbWrapper.VALUE_PRIMARY_ID]
            this.item.date = result[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_CREATION_DATE]
            this.item.name = result[dbWrapper.VALUE_NAME]
            this.item.description = result[dbWrapper.VALUE_DESCRIPTION]
            this.item.address = result[dbWrapper.VALUE_WALLET_ACCOUNT][dbWrapper.VALUE_ADDRESS]['value']

            let pairKey = nemWrapper.getPairKey(result[dbWrapper.VALUE_WALLET_ACCOUNT])
            this.item[nemWrapper.PUBLICK_KEY] = pairKey[nemWrapper.PUBLICK_KEY]
            this.item[nemWrapper.PRIVATE_KEY] = pairKey[nemWrapper.PRIVATE_KEY]
            console.log(this.item)
            this.message = this.idVal
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
