<template>
    <draggable :list="list" :options="options" group="view" style="width: 100%; height: 100%">
        <ivz-basic-view-container v-if="view.type=='IvzBasicView'" :metas="metas"
              :global="global" :view="view" :class="activeClassHandle()" ref="containerRef" />
        <ivz-drawer-view-container v-if="view.type=='IvzDrawerView'" :metas="metas"
               :global="global" :view="view" :class="activeClassHandle()" ref="containerRef" />
        <ivz-edit-view-container v-if="view.type=='IvzEditView'" :metas="metas"
                :global="global" :view="view" :class="activeClassHandle()" ref="containerRef" />
    </draggable>
</template>

<script>
    import draggable from "vuedraggable";
    import IvzBasicViewContainer from "@/components/online/container/IvzBasicViewContainer";
    import IvzDrawerViewContainer from "@/components/online/container/IvzDrawerViewContainer";
    import IvzEditViewContainer from "@/components/online/container/IvzEditViewContainer";
    export default {
        name: "IvzOnlineBody",
        components: {
            draggable,
            IvzEditViewContainer,
            IvzBasicViewContainer,
            IvzDrawerViewContainer,
        },
        props: ['metas', 'root', 'global'],
        watch: {
            /**
             * 1. 一个页面视图容器只能存在一种
             * 2. 如果拖拽另外一个视图到目标的时候将直接覆盖掉原先的视图
             * 3. 如果拖拽的视图和原先的视图是同一种类型, 将不错改变
             * @param ori
             * @param old
             */
            list(ori, old) {
                if(ori.length == 2) {
                    let filter = ori.filter(item => item != this.view);
                    if(filter.length == 1) {
                        // 如果视图类型不一致直接替换掉当前拖拽过来的视图
                        if(filter[0].type != this.view.type) {
                            this.view = filter[0];
                        }

                        this.list.length = 0;
                        this.list[0] = this.view;
                    }
                }
            }
        },
        data() {
            return {
                list: [
                    {type: 'IvzBasicView', id: new Date().getTime()}, // 默认容器
                ],
                view: null,
                options: {
                    type: 'view',
                    handle: 'ivz-drag-handle'
                },
                unActiveClass: ['ivz-drag-container'],
                activeClass: ['ivz-view-active', 'ivz-drag-container'],
            }
        },
        created() {
            this.view = this.list[0];
        },
        updated() {},
        methods: {
            onlinePreviewHandle(type) {
                this.$refs['containerRef'].viewPreview(type);
            },
            activeClassHandle() {
                return this.view.id == this.global.active
                    ? this.activeClass : this.unActiveClass;
            },
            resolverOnlineConfig() {
                let containerRef = this.$refs['containerRef'];
                return containerRef.resolverViewConfig();
            }
        }
    }
</script>

<style scoped>
    .ivz-view-active {
        border-left: 1px dashed #e0e0e0!important;
        border-right: 1px dashed #e0e0e0!important;
    }
    .ivz-drag-container {
        width: 100%;
        height: 100%;
        min-width: 700px;
        border-left: 1px solid #e0e0e0;
        border-right: 1px solid #e0e0e0;
    }
    .ivz-drag-handle .ivz-vo-left {
        float: left;
        height: 32px;
        color: #ffffff;
        padding: 0px 5px;
        line-height: 32px;
        border: 5px solid #1296ff;
    }
</style>
