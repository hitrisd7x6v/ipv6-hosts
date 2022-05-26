import PreviewListMeta from "@/components/online/list/PreviewListMeta";
export const mixListItem = {
    props: ["meta", "global"],
    data() {
        return {
            model: {}
        }
    },
    created() {
        if(this.meta.model) {
            this.model = this.meta.model;
        } else {
            this.model = PreviewListMeta.getItemModel(this.meta.type);
        }

        this.activeHandle();
    },

    methods: {
        activeHandle() {
            this.global.active = this.meta.id;

            // 最右侧的编辑模型和编辑项元数据
            this.global.editModel = this.model;
            this.global.editMetas = PreviewListMeta.getItemMetas(this.meta.type);
        },
    }
}
