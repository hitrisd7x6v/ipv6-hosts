import {defineComponent} from "vue";
import {mapActions, useStore} from "vuex";

export default defineComponent({
    props: ['url', 'dict', 'options'],
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
