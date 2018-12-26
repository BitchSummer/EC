import http from "./base.js"

//设备中心--设备模型

export let userList = (data, self) => {
    return http.fetchPost('/user-mgr/list', data, self)
}

export let userPage = (data, self) => {
    return http.fetchPost('/user-mgr/page', data, self)
}

export let saveOrUpdateUser = (data, self) => {
    return http.fetchPost('/user-mgr/save-or-update', data, self)
}

export let deleteUser = (data, self) => {
    return http.fetchPost('/user-mgr/delete', data, self)
}

export let ableOrDisableUser = (data, self) => {
    return http.fetchPost('/user-mgr/able-or-disable', data, self)
}

export let moveUser = (data, self) => {
    return http.fetchPost('/user-mgr/move', data, self)
}

export let resetPsw = (data, self) => {
    return http.fetchPost('/user-mgr/resetPsw', data, self)
}

export let grantUserGroup = (data, self) => {
    return http.fetchPost('/user-mgr/grant-user-group', data, self)
}