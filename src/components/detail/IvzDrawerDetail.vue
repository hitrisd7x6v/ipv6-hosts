<template>
    <a-drawer ref="drawerRef" :width="drawerWidth" :mask="detailConfig.mask" @close="close"
              :wrapStyle="{overflow: 'auto'}" :placement="detailConfig.placement"
              :closable="detailConfig.closable" :maskClosable="detailConfig.maskClosable"
              wrap-class-name="ivz-drawer-detail-wrap" :height="detailConfig.height"
              :destroyOnClose="detailConfig.destroyOnClose" :visible="visible">
        <slot name="detail" :model="detailModel">
            <a-spin tip="正在加载详情..." :spinning="spinning">
                <a-descriptions :title="detailConfig.title" :bordered="detailConfig.bordered"
                        :column="detailConfig.column" :size="detailConfig.size" :layout="detailConfig.layout"
                        :colon="detailConfig.colon">
                    <template v-for="meta in metas">
                        <a-descriptions-item v-if="meta.isDetail" :label="meta.title" :span="meta.column" :key="meta.field">
                            <slot v-if="meta.detailSlot" :name="meta.detailSlot" :row="detailModel"></slot>
                            <div v-else v-html="getFieldValue(meta)"></div>
                        </a-descriptions-item>
                    </template>
                </a-descriptions>
            </a-spin>
        </slot>
    </a-drawer>
</template>
<!--抽屉详情页-->
<script>
    export default {
        name: "IvzDrawerDetail",
        props: {
            formConfig: {type: Object, required: true},
            formGroup: {type: Array, default: () => []},
            detailConfig: {type: Object, required: true},
        },
        data() {
            return {
                metas: [],
                visible: false,
                spinning: false,
                drawerWidth: '',
                detailModel: {},
                detailMeta: {icon: '', label: '详情'}
            }
        },
        created() {
            this.detailMeta = this.$page.getActionMetas()['Detail'];
            this.$resolver.resolverGroup(this.formGroup, meta=>{
                this.metas.push(meta);
            });
            this.detailConfig.title = this.detailConfig.title || this.detailMeta['label'] || '查看详情';

            if (this.detailConfig.width) {
                this.drawerWidth = this.detailConfig.width
            } else {
                this.drawerWidth = (280 * this.detailConfig.column)
            }
        },
        mounted() {
            this.$page.registerVueRef(this, 'detail');
        },
        beforeDestroy() {
            this.$page.registerVueRef(null, 'detail');
        },
        methods: {
            open() {
                this.visible = true;
                this.getDetailModel();
            },
            close() {
                this.visible = false;
            },
            toggle() {
                if(this.visible) {
                    this.close();
                } else {
                    this.open();
                }
            },
            getFieldValue(col) {
                if(col['formatter']) {
                    let fieldValue = this.detailModel[col.field];
                    return col.formatter(fieldValue, this.detailModel, col);
                } else if(col.field.includes('.')){
                    return this.$utils.getDeepValue(col.field, this.detailModel);
                } else {
                    return this.detailModel[col.field];
                }
            },
            getDetailModel() {
                let url = this.detailMeta.url;
                this.detailModel = this.$page.getStore("detailModel");
                if(url) {
                    this.spinning = true;
                    let query = {};
                    let detailField = this.detailConfig.detailField;
                    query[detailField] = this.detailModel[detailField];
                    this.$http.get(url, {params: query}).then(resp=>{
                        this.detailModel = resp['detail'];
                    }).finally(()=>{
                        this.spinning = false;
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .ivz-detail .ivz-group {
        padding: 0px 8px;
        margin-top: 3px;
    }
    .ivz-detail .ivz-group-head {
        margin: 3px 8px;
        border-bottom: 1px solid #eaedf1;
    }
    .ivz-detail .ivz-group-body {
        margin: 8px 16px 0px 28px;
    }
    .ivz-detail .ant-form-item {
        margin-bottom: 16px;
    }
</style>
