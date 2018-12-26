import http from "./base.js"

//设备中心--设备模型
export let roleList = (data, self) => {
    return http.fetchPost('/role-mgr/list', data, self)
}

export let saveOrUpdateRole = (data, self) => {
    return http.fetchPost('/role-mgr/save-or-update', data, self)
}

export let deleteRole = (data, self) => {
    return http.fetchPost('/role-mgr/delete', data, self)
}

export let moveRole = (data, self) => {
    return http.fetchPost('/role-mgr/move', data, self)
}

export let ableOrDisableRole = (data, self) => {
    return http.fetchPost('/role-mgr/able-or-disable', data, self)
}

export let roleRefAppList = (data, self) => {
    return http.fetchPost('/role-mgr/role-ref-app/list', data, self)
}
