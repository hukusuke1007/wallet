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
         <!-- <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Disagree</v-btn> -->
         <v-btn color="green darken-1" flat="flat" @click.native="tapNotify(true, 'OK')">OK</v-btn>
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
      }
    },
    watch: {
      dialog (val) {
        if (val === false) { this.$emit('dialog-confirm-event-tap-positive', 'outside tap end') }
      },
      dialogVal (val) {
        this.dialog = val
      }
    },
    methods: {
      tapNotify (isPositive, message) {
        console.log(isPositive)
        if (isPositive) {
          this.$emit('dialog-confirm-event-tap-positive', message)
        } else {
          this.$emit('dialog-confirm-event-tap-positive', message)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
