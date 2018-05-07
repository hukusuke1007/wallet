<template>
  <div class="w-break">
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar card color="primary" dark tabs>
          <v-btn icon @click.native="back()" dark>
            <v-icon>keyboard_arrow_left</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
         </v-toolbar>
      </v-card>
    </v-flex>
    <br>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <nemInvoiceShow v-bind:id="id" v-bind:num="num"></nemInvoiceShow>
      </v-card>
    </v-flex>
  </div>
</template>
<script>
  import NemInvoiceShow from '@/components/NemInvoiceShow'

  export default {
    data: () => ({
      title: '請求書'
    }),
    components: {
      'nemInvoiceShow': NemInvoiceShow
    },
    props: {
      id: {
        type: Number,
        default: -1
      },
      num: {
        type: Number,
        default: 1
      }
    },
    mounted () {
      console.log('InvoiceShow id: ' + this.id + ' num: ' + this.num)
    },
    methods: {
      back () {
        history.go(-1)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
