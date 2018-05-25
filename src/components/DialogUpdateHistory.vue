<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="500px">
      <v-list three-line subheader>
        <v-subheader>更新履歴</v-subheader>
        <v-divider></v-divider>
        <v-list-tile v-for="item in items" :key="item.date">
          <v-list-tile-content>
            <v-list-tile-title class="historySubTitle">{{ item.date }} Version:{{ item.version }}</v-list-tile-title>
            <v-list-tile-sub-title class="historyDescription w-break" v-html="item.description"></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      items: [
        {
          version: '1.0.2',
          date: '2018/5/26',
          description: '選択したウォレットを保持するよう対応<br>更新履歴追加'
        },
        {
          version: '1.0.1',
          date: '2018/5/25',
          description: '請求書をメールで共有できるよう対応<br>不具合修正'
        },
        {
          version: '1.0.0',
          date: '2018/5/18',
          description: '初回リリース'
        }
      ]
    }),
    computed: {
    },
    components: {
    },
    mounted () {
    },
    props: {
      dialogVal: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      dialog (val) {
        if (val === false) { this.$emit('dialog-infomation-event-tap-close', 'outside tap end') }
      },
      dialogVal (val) {
        this.dialog = val
      }
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.historySubTitle {
  font-size: 1.0em;
  color:darkgrey;
}
.historyDescription {
  font-size: 1.0em;
  color:black;
}
</style>
