import Vue from 'vue'
import app from './App.vue'
import 'element-ui/lib/theme-chalk/index.css'
import Element from 'element-ui'
import ajax from './api/base.js'
import router from './router/index.js'
import store from './store/index.js'
import 'babel-polyfill'

import page from './components/theme/page.vue'

import toolbar from './components/zhiyun-ui/toolbar.vue' //工具栏

import qyTable from './components/zhiyun-ui/qyTable.vue'
import Tree from './components/zhiyun-ui/tree.vue' //工具栏
import Toast from './components/zhiyun-ui/toast.vue' //工具栏
import radioOrCheck from './components/zhiyun-ui/radio-or-check.vue' //工具栏
import AttrMaintain from './components/zhiyun-ui/attr-maintain.vue' //工具栏
import pagetool from './components/zhiyun-ui/pagetool.vue' //分页栏
import ClassifiedSearch from './components/zhiyun-ui/classified-search.vue' //分页栏
Vue.config.productionTip = false
import 'babel-polyfill';
// Vue.prototype.rightMenu = function (e,self) {
//   this.$store.commit('SET_CONTEXTMENU_EVENT', e);
//   this.$store.commit('SET_CONTEXTMENU_TARGET',self);
//   this.$store.commit('SET_SHOW_CONTEXTMENU',true);
// }
Vue.use(Element);
Vue.component('Page',page)
Vue.component('toolbar', toolbar)
Vue.component('qyTable', qyTable)
Vue.component('tree', Tree)
Vue.component('radioOrCheck', radioOrCheck)
Vue.component('Toast', Toast)
Vue.component('AttrMaintain', AttrMaintain)
Vue.component('PageTool', pagetool)
Vue.component('ClassifiedSearch', ClassifiedSearch)
new Vue({
  el: '#qwApp',
  router,
  store,
  components: { app }
})


