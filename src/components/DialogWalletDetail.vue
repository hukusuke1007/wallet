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
        <v-toolbar-title>ウォレット {{ name }}</v-toolbar-title>
      </v-toolbar>
      <v-flex>
        <p>{{ idVal }}</p>
        <p>{{ date }}</p>
        <p>{{ name }}</p>
        <p>{{ address }}</p>
        <p>{{ publicKey }}</p>
        <p>{{ privateKey }}</p>
        <!--
        <p>{{ message }}</p>
        <p>{{ item.id }}</p>
        <p>{{ item.date }}</p>
        <p>{{ item.name }}</p>
        <p>{{ item.address }}</p>
        <p>{{ item.publicKey }}</p>
        <p>{{ item.privateKey }}</p>
        -->
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
