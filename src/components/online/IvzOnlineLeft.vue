<template>
    <div class="ivz-online-silder">
        <div class="ivz-ol-content">
            <div class="ivz-ouc-item">
                <div style="font-size: 13px; padding: 5px 0px">视图组件</div>
                <draggable v-model="view" :group="{name: 'view', put: false, pull: 'clone'}"
                           tag="ul" class="ivz-olu" :clone="clone" :move="onMove" :options="options"
                           element="div">
                    <li v-for="item in view" :key="item.id" class="ivz-olu-label">
                        <a class="ivz-olu-a">
                            <ivz-icon :style="{fontSize: '16px'}" :type="item.icon"></ivz-icon>
                            &nbsp; <span>{{item.name}}</span>
                        </a>
                    </li>
                </draggable>
                <li style="clear: both"></li>
            </div>
            <div class="ivz-ouc-item">
                <div style="font-size: 13px; padding: 5px 0px">基础组件</div>
                <draggable v-model="basic" :group="{name: 'item', put: false, pull: 'clone'}"
                           tag="ul" class="ivz-olu" :clone="clone" :move="onMove" :options="options">
                    <li v-for="item in basic" :key="item.id" class="ivz-olu-label">
                        <a class="ivz-olu-a">
                            <ivz-icon :style="{fontSize: '16px'}" :type="item.icon"></ivz-icon>
                            &nbsp; <span>{{item.name}}</span>
                        </a>
                    </li>
                </draggable>
                <li style="clear: both"></li>
            </div>
            <div class="ivz-ouc-item">
                <div style="font-size: 13px; padding: 5px 0px">高级组件</div>
                <draggable v-model="high" :group="{name: 'item', put: false, pull: 'clone'}"
                           tag="ul" class="ivz-olu" :clone="clone" :move="onMove" :options="options">
                    <li v-for="item in high" :key="item.id" class="ivz-olu-label">
                        <a class="ivz-olu-a">
                            <ivz-icon :style="{fontSize: '16px'}" :type="item.icon"></ivz-icon>
                            &nbsp; <span>{{item.name}}</span>
                        </a>
                    </li>
                </draggable>
                <li style="clear: both"></li>
            </div>
            <div class="ivz-ouc-item">
                <div style="font-size: 13px; padding: 5px 0px">功能组件</div>
                <draggable v-model="cus" :group="{name: 'item', put: false, pull: 'clone'}"
                           tag="ul" class="ivz-olu" :clone="clone" :move="onMove" :options="options">
                    <li v-for="item in cus" :key="item.id" class="ivz-olu-label">
                        <a class="ivz-olu-a">
                            <ivz-icon :style="{fontSize: '16px'}" :type="item.icon"></ivz-icon>
                            &nbsp; <span>{{item.name}}</span>
                        </a>
                    </li>
                </draggable>
                <li style="clear: both"></li>
            </div>
            <div class="ivz-ouc-item">
                <div style="font-size: 13px; padding: 5px 0px">布局组件</div>
                <draggable v-model="layout" :group="{name: 'item', put: false, pull: 'clone'}"
                           tag="ul" class="ivz-olu" :clone="clone" :move="onMove" :options="options">
                    <li v-for="item in layout" :key="item.id" class="ivz-olu-label">
                        <a class="ivz-olu-a">
                            <ivz-icon :style="{fontSize: '16px'}" :type="item.icon"></ivz-icon>
                            &nbsp; <span>{{item.name}}</span>
                        </a>
                    </li>
                </draggable>
                <li style="clear: both"></li>
            </div>
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    export default {
        name: "IvzOnlineLeft",
        components: {
            draggable
        },
        data() {
            return {
                basic: [
                    {name: "单行文本", title: '', id: 1, icon: 'iz-icon-input', type: 'text'},
                    {name: "多行文本", title: '', id: 2, icon: 'iz-icon-area', type: 'textarea'},
                    {name: "单选框", title: '', id: 3, icon: 'iz-icon-radio', type: 'radio', data: [
                            {label: '测试', value: true}
                        ]},
                    {name: "多选框", title: '', id: 4, icon: 'iz-icon-checkbox', type: 'checkbox', data: [
                            {label: '测试', value: true}
                        ]},
                    {name: "日期选择器", title: '', id: 6, icon: 'iz-icon-date', type: 'date'},
                    {name: "时间选择器", title: '', id: 5, icon: 'iz-icon-time', type: 'time'},
                    {name: "下拉框", title: '', id: 15, icon: 'iz-icon-select', type: 'select'},
                    {name: "密码框", title: '', id: 20, icon: 'iz-icon-password', type: 'password'},
                    {name: "评分", title: '', id: 7, icon: 'iz-icon-rate', type: 'rate'},
                    {name: "数值", title: '', id: 10, icon: 'iz-icon-number', type: 'number'},
                    {name: "滑块", title: '', id: 8, icon: 'iz-icon-slider', type: 'slider'},
                    {name: "开关", title: '', id: 9, icon: 'iz-icon-switch', type: 'switch'},
                ],
                high: [
                    {name: "富文本", title: '', id: 50, icon: 'iz-icon-editor', type: 'editor', move: (target) => {
                            if(target.type == 'modal') {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    },
                    {name: "文件上传", title: '', id: 51, icon: 'iz-icon-upload', type: 'upload'},
                    {name: "树级下拉框", title: '', id: 52, icon: 'iz-icon-tree-select', type: 'stree'},
                    {name: "树级选择器", title: '', id: 53, icon: 'iz-icon-tree', type: 'tree', data: [
                            {title: '一级', key: '1', children: [
                                    {title: '二级', key: '2'}
                                ]}
                        ]},
                    {name: "级联选择器", title: '', id: 54, icon: 'iz-icon-cascade', type: 'cascade'},
                ],
                cus: [
                    {name: "模态框", title: '', id: 60, icon: 'iz-icon-modal', type: 'modal', move: (target)=>{
                            if(target.type == 'modal' || target.type == 'group') {
                                return false;
                            } else {
                                return true;
                            }
                        }},
                ],
                view: [
                    {name: "默认视图", title: '', id: 100, icon: 'iz-icon-container-default', type: 'IvzBasicView'},
                    {name: "抽屉视图", title: '', id: 101, icon: 'iz-icon-container-drawer', type: 'IvzDrawerView'},
                    // {name: "模态框视图", title: '', id: 102, icon: 'iz-icon-container-modal', type: 'IvzModalView'},
                    // {name: "表编辑视图", title: '', id: 103, icon: 'iz-icon-container-edit', type: 'IvzEditView'},
                ],
                layout: [
                    {name: "分组", title: '', id: 70, icon: 'iz-icon-group', type: 'group', move: (target) => {
                            if(target.type == 'modal') {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    },
                ],
                options: {
                    type: 'side', // 声明是左侧边栏可拖拽组件
                }
            }
        },
        methods: {
            clone(a) { // 拖拽时克隆一份对象, id用当前的时间戳
                let date = new Date();
                let clone = this.$utils.clone(a);
                clone['id'] = "ivo"+date.getTime();

                // 如果是分组组件, 添加 children
                if(a.type == 'group') this.$set(clone, 'children', []);

                return clone
            },
            onMove(evt) {
                // 目标元素上下文
                let relatedContext = evt['relatedContext'];
                let component = relatedContext.component; // 当前移动到的组件

                let options = component.options;
                // 拖拽组件如果还是在左侧边栏则不能移动
                if(options.type === 'side') {
                    return false;
                }

                let form = evt['draggedContext']['element'];
                if(form.move) {
                    return form.move(options, form);
                }
                // 拖拽组件到了布局区则可移动
                return true;
            }
        }
    }
</script>

<style>
    .ivz-online-silder ul,li{
        margin: 0px;
        padding: 0px;
        list-style: none;
    }
    .ivz-online-silder {
        width: 100%;
        padding: 8px;
    }
    .ivz-ouc-item .anticon {
        vertical-align: -0.24em;
    }
    .ivz-olu-label {
        width: 48%;
        font-size: 12px;
        display: block;
        line-height: 26px;
        position: relative;
        float: left;
        left: 0;
        padding: 1px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 1%;
        color: #333;
        border: 1px solid #f4f6fc;
    }
    .ivz-olu-label a {
        cursor: move;
        display: block;
        color: #000000;
        padding-left: 3px;
        background: #f4f6fc;
        border: 1px solid #f4f6fc;
    }
    .ivz-olu-label a:hover {
        color: #409eff;
    }
    .ivz-olu-label:hover {
        color: #409eff;
        border: 1px dashed #409eff;
    }
</style>
