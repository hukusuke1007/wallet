<template>
  <v-list subheader>
    <v-subheader>{{ title }}</v-subheader>
    <v-list-tile v-for="item in items" :key="item.title" @click="tapItem(item)">
      <v-list-tile-content>
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
  export default {
    data: () => ({
    }),
    computed: {
    },
    components: {
    },
    mounted () {
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      items: {
        type: Array,
        default: null
      }
    },
    watch: {
    },
    methods: {
      tapItem (item) {
        this.$emit('menu-list-item-tap', item)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.iconResize {
  height: 24px;
  widows: 24px;
}
</style>
