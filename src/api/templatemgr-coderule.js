import http from "./base.js"

export let schemeList = (data, self) => {
    return http.fetchPost('/code-rule/scheme/list', data, self)
}

export let schemeParamList = (data, self) => {
    return http.fetchPost('/code-rule/param/list', data, self)
}

export let saveOrUpdateScheme = (data, self) => {
    return http.fetchPostJson('/code-rule/scheme/save-or-update', data, self)
}

export let deleteScheme = (data, self) => {
    return http.fetchPost('/code-rule/scheme/delete', data, self)
}

export let ableOrDisableScheme = (data, self) => {
    return http.fetchPost('/code-rule/scheme/able-or-disable', data, self)
}

export let templateConfigList = (data, self) => {
    return http.fetchPost('/code-rule/template-config/list', data, self)
}

export let saveOrUpdateTemplateConfig = (data, self) => {
    return http.fetchPost('/code-rule/template-config/save-or-update', data, self)
}

export let testMsgSend = (data, self) => {
    return http.fetchPost('/code-rule/test/send-msg', data, self)
}

export let saveOrupdate= (data, self) => {
    return http.fetchPostJson('/code-rule/template-config/save-or-update', data, self)
}
