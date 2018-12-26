import http from "./base.js"

//设备中心--设备模型
export let appPage = (data, self) => {
    return http.fetchPost('/company-app/page', data, self)
}

export let appList = (data, self) => {
    return http.fetchPost('/company-app/list', data, self)
}

export let appBase = (data, self) => {
    return http.fetchPost('/company-app/base', data, self)
}

export let appMenuList = (data, self) => {
    return http.fetchPost('/company-app/app-menu-list', data, self)
}

export let appMenuBtnList = (data, self) => {
    return http.fetchPost('/company-app/app-btn-list', data, self)
}

export let viewMgrSet = (data, self) => {
    return http.fetchPost('/mgr-setting/view', data, self)
}

export let saveMgrSet = (data, self) => {
    return http.fetchPost('/mgr-setting/save-setting', data, self)
}

