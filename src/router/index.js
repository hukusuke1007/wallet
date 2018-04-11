import Vue from 'vue'
import Router from 'vue-router'
import Vuetify from 'vuetify'
import Hello from '@/components/Hello'

Vue.use(Router)
Vue.use(Vuetify)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    }
  ]
})
