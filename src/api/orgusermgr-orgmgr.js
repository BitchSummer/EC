import http from "./base.js"

//设备中心--设备模型
export let orgList = (data, self) => {
    return http.fetchPost('/org-mgr/list', data, self)
}

export let saveOrUpdateOrg = (data, self) => {
    return http.fetchPost('/org-mgr/save-or-update', data, self)
}

export let deleteOrg = (data, self) => {
    return http.fetchPost('/org-mgr/delete', data, self)
}

export let moveOrg = (data, self) => {
    return http.fetchPost('/org-mgr/move', data, self)
}

export let ableOrDisableOrg = (data, self) => {
    return http.fetchPost('/org-mgr/able-or-disable', data, self)
}
