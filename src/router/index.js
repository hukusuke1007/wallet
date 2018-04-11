import Vue from 'vue'
import Router from 'vue-router'
import Vuetify from 'vuetify'
// import Hello from '@/components/Hello'
import TopPage from '@/components/TopPage'
import Create from '@/components/Create'
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
      path: '/create',
      name: 'Create',
      component: Create
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting
    }
  ]
})
