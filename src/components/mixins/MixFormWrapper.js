/**
 * 表单项封装
 * @type {{data(): *, created(), methods: {}, mounted(), props: {}}}
 */
export const MixFormWrapper = {
    props: {
        meta: {type: Object, required: true},
        model: {type: Object, required: true}
    },
    data () {
        return {

        }
    },
    created () { },
    mounted () { },
    methods: {
        eventHandle(val, type) {

        },
        disabledHandle () {
            if (!this.meta.disabled) {
                return false
            } else if (typeof this.meta.disabled === 'function') {
                return this.meta.disabled(this.model)
            } else {
                return this.meta.disabled
            }
        },
    }
};
