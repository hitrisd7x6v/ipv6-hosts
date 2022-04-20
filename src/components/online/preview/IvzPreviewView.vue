<template>
    <a-drawer placement="left" width="calc(100% - 28px)" @close="onClose" class="ivz-preview"
            :closable="false" :visible="visible" :afterVisibleChange="afterVisible" :zIndex="1050">
        <a-row slot="title" class="ivz-preview-header" ref="row">
            <a-col span="18"></a-col>
            <a-col span="6">
                <span style="float: right" @click="boostHandle">
                    <ivz-icon type="iz-icon-boost"></ivz-icon>
                </span>
            </a-col>
        </a-row>
        <div class="ivz-preview-body">
            <div style="width: 198px; height: 100%">
                <a-menu style="width: 198px; height: 100%;" :selectedKeys="selectedKey"
                        mode="inline" @click="keyChangeHandle">
                    <a-menu-item key="preview"><ivz-icon type="iz-icon-preview"/>模拟预览</a-menu-item>
                    <a-menu-item key="html"><ivz-icon type="iz-icon-code"/>html代码</a-menu-item>
                    <a-menu-item key="meta"><ivz-icon type="iz-icon-json"/>json元数据</a-menu-item>
                    <a-menu-item key="sql"><ivz-icon type="iz-icon-sql"/>sql预览</a-menu-item>
                </a-menu>
            </div>
            <div style="background: #f9f9f9; width: 100%; overflow-y: auto">
                <div v-show="viewCode()" style="height: 100%;">
                    <codemirror ref="codeRef" v-model="code" :options="options"></codemirror>
                </div>
<!--                <div v-show="selectedKey[0] == 'html'" style="height: 100%;">-->
<!--                    <codemirror ref="htmlCode" v-model="htmlCode" :options="vueOptions"></codemirror>-->
<!--                </div>-->
                <div v-show="selectedKey[0]=='preview'">
                    <slot v-if="visibleView"></slot>
                </div>
            </div>
        </div>
    </a-drawer>
</template>

<script>
    import { codemirror } from 'vue-codemirror'
    let sqlFormatter = require("sql-formatter");
    let CodeMirror = require("codemirror/lib/codemirror");

    // 核心样式
    require('codemirror/lib/codemirror.css')
    //编辑器代码高亮css文件
    require('codemirror/addon/hint/show-hint.css')
    // 引入主题后还需要在 options 中指定主题才会生效
    require('codemirror/theme/idea.css')
    //代码只能提示
    require('codemirror/addon/hint/show-hint.js')
    // 我这里引入的是SQL语言文件
    require('codemirror/mode/sql/sql.js')
    require('codemirror/addon/hint/sql-hint.js')

    require("codemirror/addon/edit/matchbrackets");
    //缩进文件
    require('codemirror/addon/fold/indent-fold.js')
    //选中行高亮文件
    require('codemirror/addon/selection/active-line.js')
    // 需要引入具体的语法高亮库才会有对应的语法高亮效果
    // codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
    // 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入
    require('codemirror/mode/javascript/javascript.js')
    require('codemirror/mode/css/css.js')

    require('codemirror/mode/sql/sql.js')
    require('codemirror/mode/vue/vue.js')


    // 尝试获取全局实例
    // const CodeMirror = window.CodeMirror || CodeMirror;

    export default {
        name: "IvzPreviewView",
        props: [],
        components: {codemirror},
        data() {
            return {
                value: '',
                // 内部真实的内容
                code: '',
                config: {},
                options: {
                    // 缩进格式
                    tabSize: 4,
                    autofocus: true,
                    mode: 'text/x-mysql',
                    indentUnit : 4,  // 缩进单位，默认2
                    smartIndent : true,  // 是否智能缩进
                    // 主题，对应主题库 JS 需要提前引入
                    theme: 'idea',
                    //CodeMirror-lint-markers是实现语法报错功能
                    lint: true,
                    lineWrapping: true,
                    // 显示行号
                    lineNumbers: true,
                    styleActiveLine: true,
                },
                vueOptions: {
                    mode: 'vue',
                    tabSize: 4,
                    smartIndent : true,  // 是否智能缩进
                    // 主题，对应主题库 JS 需要提前引入
                    theme: 'idea',
                    //CodeMirror-lint-markers是实现语法报错功能
                    lint: true,
                    lineWrapping: true,
                    // 显示行号
                    lineNumbers: true,
                    styleActiveLine: true,
                },
                initCodeMirror: false,
                visible: false,
                visibleView: false,
                selectedKey: [],
            }
        },
        created() { },
        updated() { },
        methods: {
            open(menu, config) {
                this.visible = true;
                this.config = config;
                this.selectedKey = [menu];
                this.$nextTick(()=>{
                    this.setCode(menu);
                });
            },
            trigger() {
                this.visible = !this.visible;
            },
            onClose() {
                this.visible = false;
            },
            viewCode() {
                let selectKey = this.selectedKey[0];
                return selectKey == 'sql' || selectKey == 'html' || selectKey == 'meta';
            },
            boostHandle() {
                this.visible = false;
            },
            keyChangeHandle({item, key}) {
                this.selectedKey = [key];
                this.setCode(key);
            },
            setCode(menu) {
                if(menu == 'sql') {
                    this.code = sqlFormatter.format(this.config.sqlScript);
                } else if(menu == 'html') {
                    this.code = this.config.htmlCode;
                } else if(menu == 'meta') {
                    let metaConfig = {metas: this.config.metas, searchMetas:
                        this.config.searchMetas, config: this.config.config}
                    this.code = JSON.stringify(metaConfig, null, 4);
                }
                if(this.$refs['codeRef']) {
                    let codemirror = this.$refs['codeRef'].codemirror;
                    codemirror.refresh();
                }
            },
            afterVisible() {
                if(this.visible) {
                    this.visibleView = true;
                } else {
                    this.visibleView = false;
                }
            }
        }
    }
</script>

<style>
    .ivz-preview {
        transform: translateX(0px)!important;
    }
    .ivz-preview .ivz-drawer-form-wrap {
        height: calc(100% - 52px)
    }
    .ivz-preview-body {
        height: 100%;
        display: flex;
        display: -ms-flex;
        display: -webkit-flex;
        justify-content: space-between;
    }
    .ivz-preview .CodeMirror,.vue-codemirror {
        height: 100%!important;
    }
    .CodeMirror-linenumber {
        background-color: #F7F7F7;
        color: #999;
        border:1px solid #ddd;
    }
</style>
