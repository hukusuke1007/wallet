<template>
  <v-dialog v-model="dialog"
   fullscreen
   hide-overlay
   transition="slide-x-reverse-transition"
   scrollable
  >
  <v-card flat class="background">
      <v-toolbar color="pink accent-1" dark>
        <v-btn icon @click.native="close()" dark>
          <v-icon color="white">arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title class="white--text">{{ item.timeStamp }}</v-toolbar-title>
      </v-toolbar>
      <v-container
        fluid
        style="min-height: 0;"
        grid-list-lg
        >
      <v-flex xs12 sm6 offset-sm3>
       <div class="w-break sideOffset">
       <v-card>
        <v-card-title>
         <span class="header">
          <span :class="item.depositId">{{ item.deposit }}</span>
          <span :class="item.statusId" style="margin-left: 10px;">{{ item.status }}</span>
        </span>
         <span class="timestamp">{{ item.timeStamp }}</span>
        </v-card-title>
        <div class="subTitle">送信者</div>
        <div style="margin-top: 5px"><v-card-text>{{ item.senderAddr }}</v-card-text></div>
        <div class="subTitle">受信者</div>
        <div style="margin-top: 5px"><v-card-text>{{ item.recipientAddr }}</v-card-text></div>
        <div class="subTitle">送金量</div>
        <div v-if="(item.mosaicsAddInfos)&&(item.mosaicsAddInfos.length===0)" style="margin-top: 5px">
          <v-card-text>{{ item.amount }} <span v-if="item.statusId==='confirm'">xem</span></v-card-text>
        </div>
        <div v-else>
          <div v-for="(mosaic, index) in mosaics" style="margin-top: 5px">
            <v-card-text>{{ mosaic.amount }} {{ mosaic.namespaceId }}:{{ mosaic.name }}</v-card-text>
          </div>
        </div>
        <div class="subTitle">手数料</div>
        <div style="margin-top: 5px"><v-card-text>{{ item.fee }} xem</v-card-text></div>
        <div class="subTitle">メッセージ</div>
        <div style="margin-top: 5px"><v-card-text>{{ item.message }}</v-card-text></div>
        <div class="subTitle">ハッシュ</div>
        <div style="margin-top: 5px"><v-card-text><a :href="blockchainUrl" target="_blank">{{ item.hash }}</a></v-card-text></div>
        <v-flex>
          <v-btn color="select" class="white--text" @click="close">戻る</v-btn>
        </v-flex>
       </v-card>
       </div>
      </v-flex>
    </v-container>
  </v-card>
</v-dialog>
</template>

<script>
  // import dbWrapper from '@/js/local_database_wrapper'
  // import nemWrapper from '@/js/nem_wrapper'
  import { mapGetters } from 'vuex'
  export default {
    data: () => ({
      dialog: false,
      blockchainUrl: 'http://chain.nem.ninja/#/transfer/',
      mosaics: []
    }),
    components: {
    },
    computed: {
      ...mapGetters('Auth', ['isAuth', 'authPassword']),
      ...mapGetters('Nem', ['address', 'nemBalance', 'festBalance'])
    },
    mounted () {
      this.reloadItem()
    },
    props: {
      dialogVal: {
        type: Boolean,
        default: false
      },
      item: {
        type: Object,
        default: {}
      }
    },
    watch: {
      dialogVal (val) {
        this.dialog = val
        if (val === true) {
          this.blockchainUrl = 'http://chain.nem.ninja/#/transfer/' + this.item.hash
          this.reloadItem()
        }
      }
    },
    methods: {
      reloadItem () {
        this.mosaics = []
        if ('mosaicsAddInfos' in this.item) {
          this.item.mosaicsAddInfos.forEach((element) => {
            let amount = element.quantity
            if (element.divisibility > 0) {
              amount = element.quantity / Math.pow(10, element.divisibility)
            }
            let item = {
              namespaceId: element.namespaceId,
              name: element.name,
              amount: amount
            }
            this.mosaics.push(item)
          })
        }
      },
      close () {
        this.$emit('dialog-history-detail-close', 'close')
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

.subTitle {
 font-size: 1.0em;
 position: absolute;
 font-weight: bold;
 color: #b2bec3;
 left: 20px;
}

.header {
 font-size: 1.0em;
 position: absolute;
 left: 20px;
}

.timestamp {
 font-size: 0.8em;
 position: absolute;
 color: #b2bec3;
 right: 10px;
}
</style>
