import {computed, defineComponent, reactive, ref} from "vue";
import {mapActions, useStore} from "vuex";
import {MetaConst} from "@/utils/MetaUtils";
import CoreConsts from "@/components/CoreConsts";

export default defineComponent({
    props: {
        url: String,
        dict: String,
        options: Array,
        labelField: {default: CoreConsts.Options_LabelField},
        valueField: {default: CoreConsts.Options_ValueField},
    },
    data() {
        return {
            dataSource: null
        }
    },
    created() {
        if(!this.options) {
            let valueField = this.$attrs.fieldNames ? this.$attrs.fieldNames.value || this.$attrs.fieldNames.key : this.valueField;
            let labelField = this.$attrs.fieldNames ? this.$attrs.fieldNames.label || this.$attrs.fieldNames.title : this.labelField;

            if(this.dict) {
                this.dataSource = ref(useStore().getters['sys/getOptionsByDictType'](this.dict, labelField, valueField));
            } else if(this.url) {
                this.dataSource = ref(useStore().getters['sys/getOptionsByUrl'](this.url, labelField, valueField));
            }
        } else {
            this.dataSource = this.options;
        }
    },
    methods: { }
})
