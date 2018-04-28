<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="500px">
     <v-card>
       <div class="w-break sideOffset">
        <v-card-title class="headline"><font color="black">{{ titleVal }}</font></v-card-title>
        <template v-for="(item, index) in operateItems">
         <!--<v-subheader>{{ item.title }}</v-subheader>-->
         <v-btn color="gray" block @click.native="tapOperate(item.operate)"><h3>{{ item.title }}</h3></v-btn>
         <v-select :items="showItems" label="個数" v-model="selectShowItem" v-if="item.id===0"></v-select>
         <v-divider></v-divider>
       </template>
       </div>
       <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn color="green darken-1" flat="flat" @click.native="tapClose">閉じる</v-btn>
       </v-card-actions>
     </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      operateItems: [
        {id: 0, title: '表示', operate: 'open'},
        {id: 1, title: '編集', operate: 'edit'},
        {id: 2, title: '複製', operate: 'copy'},
        {id: 3, title: '削除', operate: 'delete'}
      ],
      showItems: [],
      selectShowItem: { text: 1 }
    }),
    props: {
      dialogVal: {
        type: Boolean,
        default: false
      },
      titleVal: {
        type: String,
        default: ''
      }
    },
    watch: {
      dialog (val) {
        if (val === false) { this.$emit('dialog-select-invoice-event-tap-close') }
      },
      dialogVal (val) {
        this.dialog = val
      }
    },
    mounted () {
      this.reloadItems()
    },
    methods: {
      reloadItems () {
        let num = 100
        for (let i = 0; i <= num; i++) {
          let item = {}
          item.text = i
          this.showItems.push(item)
        }
      },
      tapOperate (operate) {
        this.$emit('dialog-select-invoice-event-tap-operate', Number(this.selectShowItem.text), operate)
      },
      tapClose () {
        this.$emit('dialog-select-invoice-event-tap-close')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
