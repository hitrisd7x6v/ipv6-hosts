<template>
    <div class="ivz-oc-list" id="list-drop" @dragover="dragoverHandle">
        <div class="ivz-ocl-vdr" @drop="dropHandle">
            <vdr v-for="meta in metas" :key="meta.id" :x="meta.x" :y="meta.y" :w="meta.w" :h="meta.h"
                 :isConflictCheck="true" :snapTolerance="10" :grid="[5, 5]"
                 :lockAspectRatio="meta.lockAspectRatio" :handles="meta.handles"
                 @refLineParams="getRefLineParams" :snap="true" :active="global.active==meta.id"
                 v-on:dragging="onDrag" v-on:resizing="(x,y,w,h) => onResize(x,y,w,h,meta)">
                <ivz-list-item :meta="meta" :global="global" @delMetaItem="delMetaItem"></ivz-list-item>
            </vdr>
        </div>
        <span class="ref-line v-line"
              v-for="item in vLine" v-show="item.display"
              :style="{ left: item.position, top: item.origin, height: item.lineLength}"
        />
        <span class="ref-line h-line"
              v-for="item in hLine" v-show="item.display"
              :style="{ top: item.position, left: item.origin, width: item.lineLength}"
        />
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    import vdr from 'vue-draggable-resizable-gorkys'
    import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
    import IvzListItem from "@/components/online/item/IvzListItem";
    import EditMetas from "@/components/online/list/PreviewListMeta";
    export default {
        name: "IvzListViewContainer",
        props: ['view', 'global', 'metas'],
        components: {IvzListItem, vdr, draggable},
        data: function () {
            return {
                vLine: 0,
                hLine: 0,
                options: {
                    type: 'list'
                }
            }
        },
        created() {
            this.global.publisherEvent('viewCreate', this);
            this.activeHandle();
        },
        methods: {
            activeHandle() {
                this.global.active = this.view.id;
                this.model = EditMetas.IvzListModel;

                this.global.editModel = this.model;
                this.global.editMetas = EditMetas.IvzListMetas;
            },
            viewPreview(type) {

            },
			delMetaItem(meta) {
				this.activeHandle();
				this.global.delItem(meta);
			},
            onResize: function (x, y, width, height,meta) {
                meta.x = x;
                meta.y = y;
                meta.w = width;
                meta.h = height;
            },
            onDrag: function (x, y) {},
            onListAddHandle() {

            },
            // 辅助线回调事件
            getRefLineParams (params) {
                const { vLine, hLine } = params
                this.vLine = vLine
                this.hLine = hLine
            },
            dropHandle(ev) {
                ev.preventDefault()
                let dataTransfer = ev.dataTransfer;
                let metaContent = dataTransfer.getData("application/json");
                if(metaContent) {
                    let meta = JSON.parse(metaContent);
                    meta.x = ev.layerX;
                    meta.y = ev.layerY;
                    this.metas.push(meta);
                }
            },
            dragoverHandle(ev) {
                ev.preventDefault();
            },
            getViewType() {
                return this.global.viewType[2];
            }
        }
    }
</script>

<style scoped>
	.vdr.active {
		border: 1px dashed #1296ff;
		box-shadow: 0px 0px 3px 0px #6eb5ff;
	}
    .ivz-oc-list {
        width: 100%;
        height: 100%;
        position: relative;
        background: linear-gradient(-90deg, rgba(0, 0, 0, 0.07) 1px, transparent 1px) 0% 0% / 20px 20px, linear-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px) 0% 0% / 20px 20px;
    }
    .ivz-ocl-vdr {
        width: 100%;
        height: 100%;
        overflow: auto;
        position: relative;
    }
</style>
