<template>
    <a-form-model class="ivz-right-model" :model="model"
            :label-col="labelCol" :wrapper-col="wrapperCol">
            <template v-for="meta in metas">
                <a-divider orientation="center" dashed>
                    {{meta.title}}
                </a-divider>
                <template v-for="item in meta.metas">
                    <a-form-model-item :key="item.field" :label="item.title"
                                       :prop="item.field" :required="item.required">
                        <a-input v-if="item.type=='text'" v-model="model[item.field]" :allowClear="true"
                                 @change="(val)=>changeHandle(val.target.value, item)" :placeholder="item.placeholder"/>
                        <a-input-number v-else-if="item.type == 'number'" v-model="model[item.field]"
                                :min="item.min" :max="item.max" :step="item.step" :allowClear="true" style="width: 100%" />
                        <a-select v-else-if="item.type=='select'" v-model="model[item.field]" :allowClear="true"
                                  :defaultValue="item.default" :options="item.data" @change="(val)=>changeHandle(val, item)"/>
                        <a-slider v-else-if="item.type=='slider'" v-model="model[item.field]" :range="item.range" :marks="item.marks"
                              @change="(val)=> changeHandle(val, item)" :min="item.min" :max="item.max" :step="item.step"/>
                        <a-checkbox-group v-else-if="item.type=='checkbox'" v-model="model[item.field]"
                              :options="item.data" @change="(val)=>changeHandle(val, item)"/>
                        <a-tree-select v-else-if="item.type == 'treeSelect'" :placeholder="item.placeholder"
                               :allowClear="true" v-model="model[item.field]" :disabled="item.disabled"
                               :treeData="item.data" showSearch :searchPlaceholder="item.searchPlaceholder"/>
                        <a-radio-group v-else-if="item.type=='radio'" v-model="model[item.field]" button-style="solid"
                               :options="item.radioStyle != 'button' ? item.data : null" @change="(val)=> changeHandle(val, item)">
                            <template v-if="item.radioStyle == 'button'" v-for="option in item.data">
                                <a-radio-button :key="option.label" :value="option.value">
                                    {{option.label}}
                                </a-radio-button>
                            </template>
                        </a-radio-group>
                        <a-input-group v-else-if="item.type == 'fieldType'" compact>
                            <a-select style="width: 60%" :options="item.data" :allowClear="true"
                                      v-model="model[item.field]" @change="(val)=>changeHandle(val, item)"/>
                            <a-input style="width: 40%" v-model="model[item.lengthField]" :allowClear="true"
                                @change="(val)=>changeHandle(val, item)" placeholder="数据长度"/>
                        </a-input-group>
                        <a-input-group v-else-if="item.type == 'validate'" compact>
                            <a-select style="width: 40%" :options="item.data" :allowClear="true"
                                      v-model="model[item.field]" @change="(val)=>changeHandle(val, item)"/>
                            <a-input style="width: 60%" v-model="model['validateValue']" :allowClear="true"
                                     @change="(val)=>changeHandle(val, item)" placeholder="类型值"/>
                        </a-input-group>
                        <ivz-options-form v-else-if="item.type == 'options'" :meta="item" :model="model" />
                        <ivz-perm-form v-else-if="item.type == 'perms'" :meta="item" :model="model" />
                    </a-form-model-item>
                </template>
            </template>
    </a-form-model>
</template>

<script>
    import IvzOptionsForm from "@/components/online/IvzOptionsForm";
    import EditMetas from "@/components/online/EditMetas";
    import IvzPermForm from "@/components/online/IvzPermForm";
    export default {
        name: "IvzOnlineRight",
        components: {IvzPermForm, IvzOptionsForm},
        props: ['metas', 'model', 'global'],
        data() {
            return {
                labelCol: {span: 7},
                wrapperCol: {span: 16},
            }
        },
        created() { },
        updated() { },
        methods: {
            changeHandle(val, meta) {
                if(meta.change) {
                    meta.change(val, meta, this.model, this.global);
                }
            }
        }
    }
</script>

<style scoped>
    .ivz-right-model .ant-form-item {
        margin-bottom: 0px;
    }
</style>
