import http from "./base.js"

//设备中心--设备模型
export let devGroupList = (data, self) => {
    return http.fetchPost('/safe-mac-mgr/dev-group/list', data, self)
}


export let saveOrUpdateDevGroup = (data, self) => {
    return http.fetchPostJson('/safe-mac-mgr/dev-group/save-or-update', data, self)
}

export let devMacPage = (data, self) => { //..........
    return http.fetchPost('/safe-mac-mgr/dev-mac/page', data, self)
}

export let saveOrUpdateDevMac = (data, self) => { //........
    return http.fetchPost('/safe-mac-mgr/dev-mac/save-or-update', data, self)
}


export let deleteDevMac = (data, self) => {
    return http.fetchPost('/safe-mac-mgr/dev-mac/delete', data, self)
}
export let saveOrUpdate = (data, self) => {
    return http.fetchPostJson('/safe-access-mgr/save_or_update', data, self)
}

export let deleteApp = (data, self) => {
    return http.fetchPost('safe-access-mgr/delete', data, self)
}

export let saveDetail = (data, self) => {
    return http.fetchPostJson('/safe-access-mgr/saveDetail', data, self)
}

