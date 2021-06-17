/**
 * 页级表单通用接口
 * @type {{data(): *, created(), methods: {}, mounted(), props: {}}}
 */
import {MixSplitForm} from "@/components/mixins/MixSplitForm";

export const MixPageForm = {
    props: {
        formGroup: {type: Array, default: () => { return [] }},
        formConfig: {type: Object, default: () => { return {} }}, // 配置项,
        actionMetas: {type: Object, default: () => { return {} }}
    },
    mixins: [MixSplitForm],
};
