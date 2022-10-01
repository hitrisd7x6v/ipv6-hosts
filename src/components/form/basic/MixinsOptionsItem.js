import {defineComponent} from "vue";
import {mapActions, useStore} from "vuex";

export default defineComponent({
    props: {
        url: String,
        dict: String,
        options: Array,
        labelField: {default: 'label'},
        valueField: {default: 'value'},
    },
    data() {
        return {
            dataSource: null
        }
    },
    created() {
        if(!this.options) {
            if(this.dict) {
                this.dataSource = useStore().getters['sys/getOptionsByDictType'](this.dict);
            } else if(this.url) {
                this.dataSource = useStore().getters['sys/getOptionsByUrl'](this.url);
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
