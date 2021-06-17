/**
 * 页级列表组件, 包含表格组件以及搜索组件
 * @type {{data(): *, created(): void, props: {tableConfig: {type: ObjectConstructor, required: boolean}, data: {default: null, type: ArrayConstructor}}}}
 */
import {MixSplitList} from "@/components/mixins/MixSplitList";

export const MixPageList = {
    props: {
        data: {type: Array, default: null},
        tableConfig: {type: Object, required: true},
        searchConfig: {type: Object, required: true},
        tableMetas: {type: Array, default: () => [], required: true},
        searchMetas: {type: Array, default: () => [], required: true},
        actionMetas: {type: Object, default: () => {}, required: true}
    },
    mixins: [MixSplitList],
}
