<template>
    <div class="ivz-online-layout">
        <div class="ivz-online-header">
            <span style="font-size: 18px; color: #000000;">ivzone 在线页面设计</span>
            <span style="margin-left: 12px; float: right; padding-right: 32px">
                <label class="ivz-ohl-item" @click="previewHandle('save')">
                    <ivz-icon type="iz-icon-tijiao" title="保存"/>
                </label>
                <label class="ivz-ohl-item" @click="previewHandle('preview')">
                    <ivz-icon type="iz-icon-preview" title="预览"/>
                </label>
                <label class="ivz-ohl-item" @click="previewHandle('html')">
                    <ivz-icon type="iz-icon-code" title="html预览"/>
                </label>
                <label class="ivz-ohl-item" @click="previewHandle('meta')">
                    <ivz-icon type="iz-icon-json" title="json元数据" />
                </label>
                <label class="ivz-ohl-item" @click="previewHandle('sql')">
                    <ivz-icon type="iz-icon-sql" title="sql预览" />
                </label>
            </span>
        </div>
        <div class="ivz-online-body">
            <div class="ivz-ol-item ivz-oli-left">
                <!--在线生成器 - 左侧-->
                <ivz-online-left :global="global"></ivz-online-left>
            </div>
            <div class="ivz-ol-item ivz-oli-body">
                <!--在线生成器 - 页面布局-->
                <ivz-online-body ref="onlineRef" :metas="metas" :root="root" :global="global"></ivz-online-body>
            </div>
            <div class="ivz-ol-item ivz-oli-right">
                <!--在线生成器 - 右侧-->
                <ivz-online-right :global="global" :metas="global.editMetas" :model="global.editModel"></ivz-online-right>
            </div>
        </div>
    </div>
</template>

<script>

    import draggable from "vuedraggable";
    import IvzOnlineLeft from "@/components/online/IvzOnlineLeft";
    import IvzOnlineBody from "@/components/online/IvzOnlineBody";
    import IvzOnlineRight from "@/components/online/IvzOnlineRight";

    export default {
        name: "IvzOnline",
        props: ['saveCallback', 'initCallback'],
        components: {IvzOnlineRight, IvzOnlineBody, IvzOnlineLeft, draggable},
        data: function () {
            let vue = this;
            return {
                root: {
                    type: '', // 组件类型
                    addTitle: '',
                    editTitle: '',
                    isDetail: true, // 是否显示详情
                    hasFeedback: true, // 是否显示校验图标
                    hideRequiredMark: false, // 是否隐藏必填标志
                },
                global: {
                    span: 24,
                    gutter: 6,
                    active: null, // 当前激活的项
                    editModel: {}, // 表单组件, 列表组件, 高级组件等编辑数据模型
                    editMetas: [], // 表单组件, 列表组件, 高级组件等编辑元数据
                    viewConfig: {}, // 整个视图容器的配置, 包含html代码, 组件元数据, 组件数据等
                    modalMetas: [],
                    drawerMetas: [],
                    animation: 200,
                    viewType: ['basic', 'drawer', 'list'], // 视图类型, 不能改变其顺序
                    delItem: (item) => {
                        vue.delItem(vue.metas, item);
                    },
                    publisherEvent(event, args) {
                        vue.publisherEvent(event, args);
                    },
                    registerListener(listener) {
                        vue.registerListener(listener);
                    },
                    onContainerCreate(type, containerRef) {

                    }
                },
                metas: [],
                listeners: {}, // 监听器列表
                voidCallback: (config) => {this.$log.infoLog("系统使用默认回调"
                    , '如果需要自定义保存, 请传入回调函数(saveCallback)', config)},
            }
        },
        mounted() {
            this.global.saveCallback = this.saveCallback || this.voidCallback;
            this.global.initCallback = this.initCallback || this.voidCallback;

            // 组件初始化
            let initCallback = this.global.initCallback(this.global);
            if(initCallback instanceof Promise) {
                initCallback.then(config => {
                   this.initCallbackHandle(config);
                });
            }
        },
        updated() {

        },
        methods: {
            delItem(metas, meta) {
                if(metas && meta) {
                    metas.forEach((item, index)=>{
                        if(item==meta) {
                            return metas.splice(index, 1);
                        } else if(item.children && item.children.length>0) {
                            this.delItem(item.children, meta);
                        }
                    })
                }
            },
            publisherEvent(event, args) {
                if(!event) return this.$log.warningLog("无效的事件类型", '', event);

                let listenerList = this.listeners[event];
                if(!listenerList) return this.$log.warningLog("找不到和此事件类型对应的监听器", '', event);

                // 调用监听此事件的监听器
                listenerList.forEach(listener => listener.listen(args))
            },
            registerListener(listener) {
                if(!listener) return this.$log.warningLog("无效的监听器 - 注册失败", '', listener);
                let event = listener.event;
                if(!event) return this.$log.warningLog("监听器未指定监听事件(event)", '', listener);
                if(typeof listener.listen != 'function')
                    return this.$log.warningLog("监听器未指定监听函数(listen)", '', listener);

                // 事件不存在, 放入监听列表
                if(!this.listeners[event]) {
                    this.listeners[event] = [listener];
                } else {
                    this.listeners[event].push(listener);
                }
            },
            initCallbackHandle(config) {
                this.metas = config.metas;
                this.modalMetas = config.modalMetas;
                this.drawerMetas = config.drawerMetas;
            },
            previewHandle(type) {
                let onlineRef = this.$refs['onlineRef'];
                onlineRef.onlinePreviewHandle(type);
            }
        }
    }
</script>

<style scoped>
    .ivz-ohl-item {
        cursor: pointer;
        padding: 0px 6px;
        display: inline-block;
    }
</style>
