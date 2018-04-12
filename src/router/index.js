// Library
import Vue from 'vue'
import Router from 'vue-router'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
// import Hello from '@/components/Hello'

// CreatePage
import TopPage from '@/components/TopPage'
import Create from '@/components/Create'
import WalletCreate from '@/components/create_wallet/WalletCreate'
import WalletImport from '@/components/create_wallet/WalletImport'
import VueQrcodeReader from 'vue-qrcode-reader'

import WalletList from '@/components/WalletList'
import Setting from '@/components/Setting'

Vue.use(Router)
Vue.use(Vuetify, {
  theme: {
    original: colors.purple.base
  },
  options: {
    themeVariations: ['original', 'secondary']
  }
})
Vue.use(VueQrcodeReader)

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
      path: '/wallet_create',
      name: 'WalletCreate',
      component: WalletCreate
    },
    {
      path: '/wallet_import',
      name: 'WalletImport',
      component: WalletImport
    },
    {
      path: '/walletlist',
      name: 'WalletList',
      component: WalletList
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting
    }
  ]
})
