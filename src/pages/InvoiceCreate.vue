<template>
  <div class="w-break">
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar card color="view" dark tabs>
          <v-btn icon @click.native="back()" dark>
            <v-icon>keyboard_arrow_left</v-icon>
          </v-btn>
          <v-toolbar-title>請求書作成</v-toolbar-title>
         </v-toolbar>
      </v-card>
    </v-flex>
    <br>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <NemInvoiceCreate v-bind:id="id" v-bind:kind="kind"></NemInvoiceCreate>
      </v-card>
    </v-flex>
  </div>
</template>
<script>
  import NemInvoiceCreate from '@/components/NemInvoiceCreate'

  export default {
    data: () => ({
    }),
    components: {
      NemInvoiceCreate
    },
    props: {
      id: {
        type: Number,
        default: -1
      },
      kind: {
        type: String,
        default: ''
      }
    },
    mounted () {
      console.log('InvoiceCreate:', this.id, this.kind)
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
