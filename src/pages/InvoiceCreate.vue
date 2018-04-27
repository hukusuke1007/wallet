<template>
  <div class="w-break">
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar card color="primary" dark tabs>
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
        <!-- <nemTransactionCreate v-bind:id="String(selectItem.id)"></nemTransactionCreate> -->
      </v-card>
    </v-flex>
  </div>
</template>
<script>
  // import NemTransactionCreate from '@/components/NemTransactionCreate'

  export default {
    data: () => ({
    }),
    components: {
      // 'nemTransactionCreate': NemTransactionCreate
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
