import Vue from 'vue'
import Router from 'vue-router'

// Library
import VueQrcodeReader from 'vue-qrcode-reader'
import VueLocalForage from 'vue-localforage'
// import LocalForage from 'localforage'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import VueQriously from 'vue-qriously'
// CreatePage
import TopPage from '@/pages/TopPage'
import Create from '@/pages/Create'
import WalletCreate from '@/pages/create_wallet/WalletCreate'
import WalletImport from '@/pages/create_wallet/WalletImport'
import WalletTransfer from '@/pages/WalletTransfer'
import WalletList from '@/pages/WalletList'
import WalletDetail from '@/pages/WalletDetail'
import Setting from '@/pages/Setting'

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
Vue.use(VueLocalForage)
Vue.use(VueQriously)

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
      path: '/walletTransfer',
      name: 'WalletTransfer',
      component: WalletTransfer
    },
    {
      path: '/walletlist',
      name: 'WalletList',
      component: WalletList
    },
    {
      path: '/walletDetail/:id',
      name: 'WalletDetail',
      component: WalletDetail,
      props: true
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting
    }
  ]
})
