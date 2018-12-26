import http from "./base.js"

export let userGroupList = (data, self) => {
    return http.fetchPost('/user-grant/user-group/list', data, self)
}

export let saveOrUpdateUserGroup = (data, self) => {
    return http.fetchPost('/user-grant/user-group/save-or-update', data, self)
}

export let deleteUserGroup = (data, self) => {
    return http.fetchPost('/user-grant/user-group/delete', data, self)
}

export let ableOrDisableUserGroup = (data, self) => {
    return http.fetchPost('/user-grant/user-group/able-or-disable', data, self)
}

export let permissionList = (data, self) => {
    return http.fetchPost('/user-grant/permission-list', data, self)
}