import http from "./base.js"

//设备中心--设备模型



export let monthStorage = (data, self) => {
    return http.fetchPost('/company-storage/month-storage', data, self)
}

export let distributeList = (data, self) => {
    return http.fetchPost('/company-storage/distribute/list', data, self)
}

export let saveDistribute = (data, self) => {
    return http.fetchPost('/company-storage/distribute/save', data, self)
}

export let logPage = (data, self) => {
    return http.fetchPost('/company-storage/log/page', data, self)
}

export let viewMgrSet = (data, self) => {
    return http.fetchPost('/mgr-setting/view', data, self)
}

export let saveMgrSet = (data, self) => {
    return http.fetchPost('/mgr-setting/save-setting', data, self)
}
