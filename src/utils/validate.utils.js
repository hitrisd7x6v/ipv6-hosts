export default {
    isIdCard(val) {
        return /^\d{15}|\d{18}$/.test(val)
    },
    isIp(val) {
        return /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.test(val);
    },
    isUrl(val) {
        return /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(val);
    },
    isReg(val) {
        let regExp = new RegExp(val);
        return regExp.test(val);
    },
    isPhone(val) {
        return /^1[3|4|5|7|8][0-9]{9}$/.test(val);
    },
    isEmail(val) {
        return /^\w+([-+.]\w+)@\w+([-.]\w+).\w+([-.]\w+)*$/.test(val)
    },
    isBank(val) {
        return /^\w+([-+.]\w+)@\w+([-.]\w+).\w+([-.]\w+)*$/.test(val)
    },
    isChinese(val){
        return /^[\u4e00-\u9fa5]+$/.test(val)
    },
    isZip(val) {
        return /[1-9]\d{5}(?!\d)/.test(val);
    },
    isLength(val, length) {
        return val.length == length
    }

}
