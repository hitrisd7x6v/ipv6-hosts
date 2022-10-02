import {defineComponent} from "vue";
import {mapActions, useStore} from "vuex";
import {MetaConst} from "@/utils/MetaUtils";

export default defineComponent({
    props: {
        url: String,
        dict: String,
        options: Array,
        labelField: {default: MetaConst.DefaultLabelField},
        valueField: {default: MetaConst.DefaultValueField},
    },
    data() {
        return {
            dataSource: null
        }
    },
    created() {
        if(!this.options) {
            if(this.dict) {
                this.dataSource = useStore().getters['sys/getOptionsByDictType']
                    (this.dict, this.labelField, this.valueField);
            } else if(this.url) {
                this.dataSource = useStore().getters['sys/getOptionsByUrl']
                    (this.url, this.labelField, this.valueField);
            }
        } else {
            this.dataSource = this.options;
        }
    },
    methods: {
        ...mapActions({
            getOptionsByDictType: 'sys/getOptionsByDictType'
        }),

        getOptionsLabel(dict) {
            return defaultValue || null;
        },
    }
})
