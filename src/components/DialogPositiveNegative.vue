<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="500px">
     <v-card>
       <div class="w-break">
         <v-card-title class="headline"><font color="blue">{{ titleVal }}</font></v-card-title>
         <v-card-text v-html="messageVal"></v-card-text>
       </div>
       <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn color="green darken-1" flat="flat" @click.native="tapNotify(true, 'YES')">{{ positiveVal }}</v-btn>
         <v-btn color="green darken-1" flat="flat" @click.native="tapNotify(false, 'NO')">{{ negativeVal }}</v-btn>
       </v-card-actions>
     </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false
      }
    },
    props: {
      dialogVal: {
        type: Boolean,
        default: false
      },
      titleVal: {
        type: String,
        default: ''
      },
      messageVal: {
        type: String,
        default: ''
      },
      positiveVal: {
        type: String,
        default: 'はい'
      },
      negativeVal: {
        type: String,
        default: 'いいえ'
      }
    },
    watch: {
      dialog (val) {
        if (val === false) { this.$emit('dialog-positive-negative-event-tap', false, 'outside tap end') }
      },
      dialogVal (val) {
        this.dialog = val
      }
    },
    methods: {
      tapNotify (isPositive, message) {
        console.log(isPositive)
        this.$emit('dialog-positive-negative-event-tap', isPositive, message)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
