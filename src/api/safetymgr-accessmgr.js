import http from "./base.js"

//设备中心--设备模型
export let accessSchemeView = (data, self) => {
    return http.fetchPost('/safe-access-mgr/view', data, self)
}

export let schemeDetailList = (data, self) => {
    return http.fetchPost('/safe-access-mgr/detail/list', data, self)
}
export let selectPage = (data, self) => {
    return http.fetchPost('/company-app/page', data, self)
}
export let saveOrUpdate = (data, self) => {
    return http.fetchPost('/safe-access-mgr/save_or_update', data, self)
}
export let detailList = (data, self) => {
    return http.fetchPost('/safe-access-mgr/detail/list', data, self)
}