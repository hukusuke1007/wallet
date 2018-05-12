import Vue from 'vue'
import Router from 'vue-router'

// Library
import VueQrcodeReader from 'vue-qrcode-reader'
import VueLocalForage from 'vue-localforage'
// import LocalForage from 'localforage'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import VueQriously from 'vue-qriously'
import Toast from 'vue2-toast'
import 'vue2-toast/lib/toast.css'
// CreatePage
import TopPage from '@/pages/TopPage'
import Create from '@/pages/Create'
import WalletCreate from '@/pages/WalletCreate'
import WalletImport from '@/pages/WalletImport'
import WalletTransfer from '@/pages/WalletTransfer'
import WalletList from '@/pages/WalletList'
import WalletDetail from '@/pages/WalletDetail'
import InvoiceList from '@/pages/InvoiceList'
import InvoiceCreate from '@/pages/InvoiceCreate'
import InvoiceShow from '@/pages/InvoiceShow'
import Setting from '@/pages/Setting'

Vue.use(Router)
Vue.use(Vuetify, {
  theme: {
    original: colors.purple.base,
    theme: '#FFDEEA',
    background: '#FFF6EA',
    view: '#ffa07a',
    select: '#FF7F78',
    button: '#5FACEF'
  },
  options: {
    themeVariations: ['original', 'secondary']
  }
})
Vue.use(VueQrcodeReader)
Vue.use(VueLocalForage)
Vue.use(VueQriously)
Vue.use(Toast, {
  defaultType: 'bottom',
  duration: 3000,
  wordWrap: true,
  width: '280px'
})
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
      path: '/invoiceList',
      name: 'InvoiceList',
      component: InvoiceList
    },
    {
      path: '/invoiceCreate',
      name: 'InvoiceCreate',
      component: InvoiceCreate,
      props: true
    },
    {
      path: '/invoiceShow',
      name: 'InvoiceShow',
      component: InvoiceShow,
      props: true
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting
    }
  ]
})
