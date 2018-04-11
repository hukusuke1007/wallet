import Vue from 'vue'
import Router from 'vue-router'
import Vuetify from 'vuetify'
// import Hello from '@/components/Hello'
import TopPage from '@/components/TopPage'
import Setting from '@/components/Setting'

Vue.use(Router)
Vue.use(Vuetify)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TopPage',
      component: TopPage
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting
    }
  ]
})
