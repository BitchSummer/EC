import http from "./base.js"

//设备中心--设备模型



export let monthMsg = (data, self) => {
    return http.fetchPost('/company-msg/month-msg', data, self)
}

export let appUsedList = (data, self) => {
    return http.fetchPost('/company-msg/app-used/list', data, self)
}


export let logPage = (data, self) => {
    return http.fetchPost('/company-msg/log/page', data, self)
}

export let viewMgrSet = (data, self) => {
    return http.fetchPost('/mgr-setting/view', data, self)
}

export let saveMgrSet = (data, self) => {
    return http.fetchPost('/mgr-setting/save-setting', data, self)
}
