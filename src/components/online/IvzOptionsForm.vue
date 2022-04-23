<template>
    <div class="ivz-options-form">
        <div style="position: relative">
            <a-radio-group v-model="value" button-style="solid" size="small">
                <a-radio-button value="cus">自定义</a-radio-button>
                <a-radio-button value="dict">字典</a-radio-button>
                <a-radio-button value="url">url地址</a-radio-button>
            </a-radio-group>
            <span style="position: absolute; left: 165px; top: 2px; cursor: pointer;">
                <ivz-icon type="iz-icon-jia" @click="addHandle" v-show="value == 'cus'"/>
            </span>
        </div>
        <draggable v-if="value == 'cus'" :list="cusOptions" group="options" :animation='200'>
            <div class="ivz-of-item" v-for="(option, index) in cusOptions" :key="index">
                <a-input-group compact size="small">
                    <a-input style=" width: 80px; text-align: center;" v-model="option.label" placeholder="输入标签" />
                    <a-input style="width: 80px; text-align: center;" v-model="option.value" placeholder="输入标签值" />
                </a-input-group>
                <span style="position: absolute; left: 165px; top: 3px; cursor: pointer;">
                    <ivz-icon type="iz-icon-jian" :style="{color: 'red'}" @click="jianHandle(option)"></ivz-icon>
                </span>
            </div>
        </draggable>
        <div v-else-if="value == 'dict'">
            <a-select v-model="model['dictValue']" placeholder="请选择字典类型"
                  @change="dictChange" :options="treeData"/>
        </div>
        <div v-else>
            <a-input v-model="model['urlValue']" placeholder="请输入地址, 以http(s)开头" />
            <a-input v-model="model['valueField']" addon-before="值字段" placeholder="请输入值字段" />
            <a-input v-model="model['labelField']" addon-before="标签字段" placeholder="请输入标签字段" />
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    import PreviewData from "@/components/online/preview.data"
    export default {
        name: "IvzOptionsForm",
        props: ["meta", "model"],
        components: {draggable},
        watch: {
            value(nv, ov){
                let field = this.meta.field;
                this.model[field] = nv;
                if(nv == 'cus') {
                    this.model['options'] = this.cusOptions;
                } else if(nv == 'dict') {
                    this.model['options'] = this.dictOptions
                } else {
                    this.model['options'] = [];
                }
            }
        },
        data() {
            return {
                value: 'cus',
                treeData: [],
                cusOptions: [],
                dictOptions: []
            }
        },
        created() {
            this.init();
            this.treeData = PreviewData.getDictTypeList();
        },
        updated() {
            this.init();
        },
        methods: {
            init() {
                if(this.model[this.meta.field]) {
                    this.value = this.model[this.meta.field];
                }
                if(this.model['options'] && this.model['options'].length > 0) {
                    if(this.model['dataType'] == 'cus') {
                        this.cusOptions = this.model['options'];
                    } else if(this.model['dataType'] == 'dict') {
                        this.dictOptions = this.model['options'];
                    } else {

                    }
                } else {
                    this.cusOptions = this.getCusOptions();
                    this.model['options'] = this.cusOptions;
                }
            },
            getCusOptions() {
                return [{label: 'demo', value: 'demo'}]
            },
            addHandle() {
                this.cusOptions.push({label: '', value: ''});
            },
            dictChange(val) {
                this.dictOptions = PreviewData.getDictData(val);
                this.model['options'] = this.dictOptions;
            },
            jianHandle(option) {
                this.cusOptions.forEach((item, index) => {
                    if(item == option)
                        this.cusOptions.splice(index, 1);
                })
            }
        }
    }
</script>

<style scoped>
    .ivz-options-form {
        border-bottom: 1px dashed #afafaf;
    }
    .ivz-options-form .ant-input {
        padding: 4px 4px;
    }
    .ivz-options-form .ivz-of-item {
        position: relative;
    }
</style>
