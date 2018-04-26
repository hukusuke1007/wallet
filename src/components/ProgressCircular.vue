<template>
  <v-layout row justify-center>
    <v-dialog v-model="isShow" persistent fullscreen transition="false">
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="7" color="primary"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    data: () => ({
      isShow: false
    }),
    props: {
      isShowVal: false
    },
    watch: {
      isShowVal (val) {
        this.isShow = val
      }
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
