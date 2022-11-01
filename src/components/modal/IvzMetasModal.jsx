import {defineComponent, inject, ref} from "vue";
import IvzEditModal from "@/components/edit/IvzEditModal";
import {initMetaCallback} from "@/utils/MetaUtils";
import {mapGetters} from "vuex";

export default defineComponent({
    name: 'IvzViewModal',
    components: {IvzEditModal},
    setup() {
        let iemRef = ref();
        let title = ref("");
        let viewInfo = inject("IvzViewInfo");
        if(!viewInfo) {
            throw new Error(`IvzViewModal组件只能作为IvzXxxView等视图组件的子组件`);
        }

        let {editFunMetas, config, viewMenu} = viewInfo
        let funMetas = editFunMetas;

        if(funMetas instanceof Array) {
            funMetas.forEach(meta => {
                initMetaCallback(meta, viewInfo, 'edit');
            })
        }

        return {funMetas, viewInfo, viewMenu, iemRef, title}
    },
    computed: {
        ...mapGetters({
            editActive: 'view/editActive'
        }),
    },
    created() {
        this.iemRef = this.$refs['iemRef'];
    },
    render() {
        // if(this.iemRef && this.iemRef.isInitForm()) {
        //     let {config} = this.viewInfo;
        //     let editModel = this.iemRef.getEditModel();
        //     this.title = config.isEdit(editModel) ? config.editTitle : config.addTitle;
        // }

        return <div class="ivz-view ivz-view-modal">
            <ivz-edit-modal {...this.$attrs} funMetas={this.funMetas}
                            title={this.title} ref="iemRef" v-slots={this.$slots}>
            </ivz-edit-modal>
        </div>
    }
})
