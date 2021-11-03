<template>
    <a-drawer ref="drawerRef" :width="drawerWidth" :mask="detailConfig.mask" @close="close"
              :wrapStyle="{overflow: 'auto'}" :placement="detailConfig.placement"
              :closable="detailConfig.closable" :maskClosable="detailConfig.maskClosable"
              wrap-class-name="ivz-drawer-detail-wrap" :height="detailConfig.height"
              :destroyOnClose="detailConfig.destroyOnClose" :visible="visible">
        <slot name="detail" :model="detailModel">
            <a-row slot="title" type="flex" align="middle" justify="space-between" style="color: #000000">
                <a-col span="12" style="padding-left: 12px; font-size: 17px">
                    <ivz-icon :type="detailMeta.icon" style="font-size: 17px"></ivz-icon>
                    <em style="font-size: 16px; color: #000000">{{detailMeta.label}}</em>
                </a-col>
                <a-col span="12" style="padding-right: 20px; text-align: right"></a-col>
            </a-row>
            <a-spin tip="正在加载详情..." :spinning="spinning">
                <div v-for="group in formGroup" :key="group.name" class="ivz-detail ivz-group" :style="group.style">
                    <div v-if="group.name" class="ivz-group-head">
                        <label style="color: #6eb5ff; font-size: 15px; font-style: oblique">{{group.name}}</label>
                    </div>
                    <div class="ivz-group-body">
                        <a-row :align="formConfig.align" :justify="formConfig.justify"
                               :gutter="formConfig.gutter" type="flex">
                            <template v-for="col in group.metas">
                                <a-col v-if="viewForm(col)" :span="col.config.span" :key="col.field">
                                    <a-form-item :label="col.title" :label-col="col.config.labelCol"
                                                 :wrapper-col="col.config.wrapperCol">
                                        <slot v-if="col.detailSlot" :name="col.detailSlot" :row="detailModel"></slot>
                                        <div v-else style="padding-left: 16px" v-html="getFieldValue(col)"></div>
                                    </a-form-item>
                                </a-col>
                            </template>
                        </a-row>
                    </div>
                </div>
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
                visible: false,
                spinning: false,
                drawerWidth: '',
                detailModel: {},
                detailMeta: {icon: '', label: '详情'}
            }
        },
        created() {
            this.detailMeta = this.$page.getActionMetas()['Detail'];

            if (this.detailConfig.width) {
                this.drawerWidth = this.detailConfig.width
            } else {
                if (this.formConfig.type === 'group') {
                    this.drawerWidth = (260 * this.formConfig.column)
                } else {
                    this.drawerWidth = 420
                }
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
            viewForm (col) {
                if (typeof col['isForm'] === 'function') {
                    return col.isForm(this.model, this)
                } else if (col.type === 'hidden') {
                    return false
                } else {
                    return col['isForm']
                }
            },
            getFieldValue(col) {
                let fieldValue = this.detailModel[col.field];
                if(col['formatter']) {
                    return col.formatter(fieldValue, this.detailModel, col);
                } else {
                    return fieldValue;
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
