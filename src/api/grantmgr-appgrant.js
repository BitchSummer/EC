import http from "./base.js"

export let roleRefAppList = (data, self) => {
    return http.fetchPost('/app-grant/role-ref-app', data, self)
}

export let companyRefAppList = (data, self) => {
    return http.fetchPost('/app-grant/company-ref-app', data, self)
}

export let roleRefMenuList = (data, self) => {
    return http.fetchPost('/app-grant/role-ref-menu', data, self)
}

export let roleRefBtnList = (data, self) => {
    return http.fetchPost('/app-grant/role-ref-btns', data, self)
}

export let roleGrantApps = (data, self) => {
    return http.fetchPost('/app-grant/role-grant-apps', data, self)
}

export let roleGrantAppMenu = (data, self) => {
    return http.fetchPost('/app-grant/role-grant-app-menus', data, self)
}