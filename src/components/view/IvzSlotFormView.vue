<template>
    <a-locale-provider :locale="zhCN">
        <div class="ivz-view ivz-diy-form-view ivz-container">
            <ivz-default-list ref="listRef" :table-metas="tableMetas" :table-config="tableConfig"
                  :action-metas="actionMetas" :search-metas="searchMetas" :search-config="searchConfig"
                  :data="data" v-show="listView">
                <template #search>
                    <slot name="search"></slot>
                </template>
                <template #action="{row, index}">
                    <slot name="action" :row="row" :index="index"></slot>
                </template>
            </ivz-default-list>
            <div v-if="!listView" class="ivz-default-form ivz-border-radius">
                <div class="form-header ivz-border-radius">
                    <div class="form-header-left">
                        <ivz-icon :type="operaMeta.icon" style="font-size: 17px"></ivz-icon>
                        <em style="font-size: 16px; color: #000000">{{title}}</em>
                    </div>
                </div>
                <div class="form-body">
                    <a-spin :tip="loadingText" :spinning="spinning">
                        <ivz-basic-form ref="basicFormRef" @mountedFinished="mountedFinished"
                            :form-group="formGroup" :bind-type="formConfig.bindType" :form-config="formConfig">
                            <template #[meta.field] v-for="meta in formSlots">
                                <slot :name="meta.field" :meta="meta"></slot>
                            </template>
                        </ivz-basic-form>
                    </a-spin>
                </div>
                <div class="form-footer ivz-opera-row" style="text-align: center">
                    <slot name="submit">
                        <a-button class="ivz-button-action" @click="cancelHandle">返回</a-button>
                        <a-button class="ivz-button-action" @click="submitHandle" type="primary">提交</a-button>
                        <a-button class="ivz-button-action" @click="freshenHandle" type="dashed">刷新</a-button>
                    </slot>
                </div>
            </div>
        </div>
    </a-locale-provider>
</template>

<script>
    import IvzDefaultList from "@/components/list/IvzDefaultList";
    import {MixPageView} from "@/components/mixins/MixPageView";
    import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
    import {MixSplitForm} from "@/components/mixins/MixSplitForm";

    export default {
        name: "IvzSlotFormView",
        mixins: [MixPageView, MixSplitForm],
        components: {IvzDefaultList},
        data() {
            return {
                zhCN,
                formSlots: {},
            }
        },
        created() {
            // 初始化表单实体对象
            this.formConfig = this.config.form;
            this.formGroup = this.$page.resolverFormMetas(this.metas, this.formConfig, this, (item) => {
                let field = item.field;
                if(this.$slots[field]) {
                    this.validSlotField(field, item);
                    this.formSlots[field] = item;
                }
            })
        },
        mounted() {
            this.$page.resolverMetas(this.metas, this, (meta) => {
                let field = meta.field;
                if(!this.formSlots[field]) {
                    if(this.$scopedSlots[field]) {
                        this.validSlotField(field, meta);
                        this.formSlots[field] = meta;
                    }
                }
            })
        },
        methods: {
            /**
             * 验证字段名称和slot名称是否相同
             * @param field
             * @param meta
             */
            validSlotField(field, meta) {
                if(field == 'submit' || field == 'action' || field === 'search') {
                    this.$log.warningLog(`字段名(${field})和slot名称重复`
                        , '修改字段名(包含：submit、action、search)', meta)
                }
            }
        }
    }
</script>

<style scoped>

</style>
