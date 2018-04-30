<template>
  <v-dialog v-model="dialog" max-width="400px">
    <v-flex>
      <v-card>
        <v-flex>
         <label class="pink--text">QRコード読み取り</label>
         <v-btn color="primary" flat @click.stop="tapClose('Close')">閉じる</v-btn>
        </v-flex>
        <qrcode-reader @init="onInit" @decode="onDecode" style="margin: 0px 8px 0px 8px" :paused="pauseVal">
         <div class="decoded-content">{{ content }}</div>
        </qrcode-reader>
        <br>
      </v-card>
    </v-flex>
  </v-dialog>
</template>

<script>
  import nemWrapper from '@/js/nem_wrapper'
  export default {
    data () {
      return {
        dialog: false,
        content: ''
      }
    },
    props: {
      dialogVal: {
        type: Boolean,
        default: false
      },
      pauseVal: {
        type: Boolean,
        default: false
      },
      typeVal: {
        type: String,
        default: 'privateKey'
      }
    },
    watch: {
      dialog (val) {
        if (val === false) { this.$emit('qr-reader-event-tap-close', 'outside tap end') }
      },
      dialogVal (val) {
        // warning対策.
        this.dialog = val
      }
    },
    methods: {
      async onInit (promise) {
        // show loading indicator
        try {
          await promise
          // successfully initialized
        } catch (error) {
          if (error.name === 'NotAllowedError') {
            console.log('user denied camera access permisson')
          } else if (error.name === 'NotFoundError') {
            console.log('no suitable camera device installed')
          } else if (error.name === 'NotSupportedError') {
            console.log('page is not served over HTTPS (or localhost)')
          } else if (error.name === 'NotReadableError') {
            console.log('maybe camera is already in use')
          } else if (error.name === 'OverconstrainedError') {
            console.log('Did you requested the front camera although there is none?')
            // passed constraints don't match any camera. Did you requested the front camera although there is none?
          } else {
            console.log('browser is probably lacking features (WebRTC, Canvas)')
            // browser is probably lacking features (WebRTC, Canvas)
          }
        } finally {
          console.log('hide loading indicator')
          // hide loading indicator
        }
      },
      onDecode (content) {
        // ここでフィルタリングする.
        console.log(content)
        if (content !== null) {
          let json = nemWrapper.getJsonQRcode(content)
          if (!json) {
            this.content = '不正なQRコードです'
            console.log('qr_reader error')
          } else {
            this.content = '読み取り成功'
            this.$emit('qr-reader-event-scan-success', json)
            this.content = ''
            // this.paused = true
          }
        } else {
          console.log('QR読み込みエラー')
        }
      },
      tapClose (message) {
        console.log(message + ':' + this.typeVal + ':' + this.pauseVal)
        this.$emit('qr-reader-event-tap-close', message)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.decoded-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  max-width: 100%;
  padding: 0px 20px;
  color: #fff;
  font-weight: bold;
  padding: 10px;
  background-color: rgba(0,0,0,.5);
}
</style>
