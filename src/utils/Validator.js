/**
 * 身份证校验
 * @param val
 * @return {boolean}
 */
export function idCard(val) {
    return /^\d{15}|\d{18}$/.test(val)
}

/**
 * ip校验
 * @param val
 * @return {boolean}
 */
export function ip(val) {
    return /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.test(val);
}

/**
 * url校验
 * @param val
 * @return {boolean}
 */
export function url(val) {
    return /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(val);
}

/**
 * 正则校验
 * @param val
 * @param reg
 * @return {boolean}
 */
export function reg(val, reg) {
    return new RegExp(reg || '').test(val);
}

/**
 * 英文字母校验
 * @param val
 * @return {boolean}
 */
export function word(val) {
    return /[a-zA-Z]/.test(val)
}

/**
 * 手机号校验
 * @param val
 * @return {boolean}
 */
export function phone(val) {
    return /^1[3|4|5|7|8][0-9]{9}$/.test(val);
}

/**
 * 邮箱校验
 * @param val
 * @return {boolean}
 */
export function email(val) {
    return /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/.test(val)
}

/**
 * 银行卡校验
 * @param val
 * @return {boolean}
 */
export function bank(val) {
    return /^([1-9])(\d{14}|\d{18})$/.test(val)
}

/**
 * 中文校验
 * @param val
 * @return {boolean}
 */
export function chinese(val){
    return /^[\u4e00-\u9fa5]+$/.test(val)
}

export function IdCardValidator(rule, val) {
    return idCard(val) ? Promise.resolve() : Promise.reject(rule.message || '请输入正确的身份证号')
}
export function PhoneValidator(rule, val) {
    return phone(val) ? Promise.resolve() : Promise.reject(rule.message || '请输入正确的手机号')
}
export function ChineseValidator(rule, val) {
    return chinese(val) ? Promise.resolve() : Promise.reject(rule.message || '请输入中文')
}
export function EmailValidator(rule, val) {
    return email(val) ? Promise.resolve() : Promise.reject(rule.message || '请输入正确的邮箱')
}
export function BankValidator(rule, val) {
    return bank(val) ? Promise.resolve() : Promise.reject(rule.message || '请输入正确的银行卡号')
}
export function IpValidator(rule, val) {
    return ip(val) ? Promise.resolve() : Promise.reject(rule.message || '请输入正确的ip地址')
}
export function UrlValidator(rule, val) {
    return url(val) ? Promise.resolve() : Promise.reject(rule.message || '请输入正确的url地址')
}