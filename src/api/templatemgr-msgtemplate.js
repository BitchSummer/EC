import http from "./base.js"

export let schemeList = (data, self) => {
    return http.fetchPost('/msg-template/scheme/list', data, self)
}

export let schemeParamList = (data, self) => {
    return http.fetchPost('/msg-template/param/list', data, self)
}

export let saveOrUpdateScheme = (data, self) => {
    return http.fetchPostJson('/msg-template/scheme/save-or-update', data, self)
}

export let deleteScheme = (data, self) => {
    return http.fetchPost('/msg-template/scheme/delete', data, self)
}

export let ableOrDisableScheme = (data, self) => {
    return http.fetchPost('/msg-template/scheme/able-or-disable', data, self)
}

export let viewTemplateConfig = (data, self) => {
    return http.fetchPost('/msg-template/template-config/view', data, self)
}

export let saveOrUpdateTemplateConfig = (data, self) => {
    return http.fetchPost('/msg-template/template-config/save-or-update', data, self)
}

export let testMsgSend = (data, self) => {
    return http.fetchPost('/msg-template/test/send-msg', data, self)
}