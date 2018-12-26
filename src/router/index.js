import Vue from 'vue'
import Router from 'vue-router'
import page_404 from '../page/404/index.vue'

import OrgMgr from 'page/orguser-mgr/org-mgr.vue';//单位组
import UserMgr from 'page/orguser-mgr/user-mgr.vue';//单位组

import AppMgr from 'page/resource-mgr/app-mgr.vue'
import StorageMgr from 'page/resource-mgr/storage-mgr.vue'
import MsgMgr from 'page/resource-mgr/msg-mgr.vue'

import RoleMgr from 'page/grant-mgr/role-mgr.vue'
import AppGrant from 'page/grant-mgr/app-grant.vue'
import UserGrant from 'page/grant-mgr/user-grant.vue'

import MsgTemplate from 'page/template-mgr/msg-template.vue'
import PrintTemplate from 'page/template-mgr/print-template.vue'
import CodeRule from 'page/template-mgr/code-rule.vue'

import MacMgr from 'page/safety-mgr/mac-mgr.vue'
import AccessMgr from 'page/safety-mgr/access-mgr.vue'

import Test from '../page/home.vue'
Vue.use(Router)
export default new Router({
	routes: [
		{
			path: "*",
			component: page_404,
			name: "404"
		},
		{
			path: '/orguser-mgr/org-mgr',
			name: 'org-mgr',
			component: OrgMgr
		},
		{
			path: '/orguser-mgr/user-mgr',
			name: 'user-mgr',
			component: UserMgr
		},
		
		{
			path: '/resource-mgr/app-mgr',
			name: 'app-mgr',
			component: AppMgr
		},{
			path: '/resource-mgr/storage-mgr',
			name: 'storage-mgr',
			component: StorageMgr
		},{
			path: '/resource-mgr/msg-mgr',
			name: 'msg-mgr',
			component: MsgMgr
		},
		
		{
			path: '/grant-mgr/role-mgr',
			name: 'role-mgr',
			component: RoleMgr
		},
		{
			path: '/grant-mgr/app-grant',
			name: 'app-grant',
			component: AppGrant
		},
		{
			path: '/grant-mgr/user-grant',
			name: 'user-grant',
			component: UserGrant
		},
		
		{
			path: '/template-mgr/msg-template',
			name: 'msg-template',
			component: MsgTemplate
		},
		{
			path: '/template-mgr/print-template',
			name: 'print-template',
			component: PrintTemplate
		},
		{
			path: '/template-mgr/code-rule',
			name: 'code-rule',
			component: CodeRule
		},
		
		{
			path: '/safety-mgr/mac-mgr',
			name: 'mac-mgr',
			component: MacMgr
		},
		{
			path: '/safety-mgr/access-mgr',
			name: 'access-mgr',
			component: AccessMgr
		},
		
		{
			path: '/test',
			name: 'test',
			component: Test
		}
  ]
})
