<template>
  <v-layout row>
   <v-card>
      <v-list subheader>
        <v-subheader>Developer</v-subheader>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>shohei</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list subheader>
        <v-subheader>Social and inquiry</v-subheader>
        <v-list-tile v-for="item in items" :key="item.title" avatar @click="tapItem(item)">
           <v-list-tile-action>
            <div v-if="item.action!==null">
             <v-icon >{{ item.action }}</v-icon>
           </div>
           <div v-else>
            <img :src="item.img" class="iconResize"></img>
           </div>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
   </v-card>
 </v-layout>
</template>

<script>
  export default {
    data: () => ({
      items: [
        {
          action: 'mood',
          title: 'WebSite',
          type: 'link',
          url: 'http://hobbydevelop.info'
        },
        {
          action: null,
          img: require('@/assets/twitter.png'),
          title: 'Twitter',
          type: 'link',
          url: 'https://twitter.com/hobbydevelop'
        },
        {
          action: null,
          img: require('@/assets/github.png'),
          title: 'GitHub',
          type: 'link',
          url: 'https://github.com/hukusuke1007/wallet/'
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
    },
    watch: {
    },
    methods: {
      tapItem (item) {
        if (item.type === 'link') {
          open(item.url, '_blank')
        }
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
