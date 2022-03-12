<template>
    <div class="ivz-oc-drawer">
        <a-drawer title="Basic Drawer" placement="right" :width="420"
                :closable="false" :visible="true" getContainer=".ivz-oc-drawer">
            <draggable :list="metas" :options="options" group="item"
                       :animation='200' class="ivz-ocd-drag">
                <ivz-form-item v-for="meta in metas" :meta="meta"
                               :global="global" :key="meta.id"></ivz-form-item>
            </draggable>
        </a-drawer>
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    import IvzFormItem from "@/components/online/item/IvzFormItem";
    export default {
        name: "IvzDrawerViewContainer",
        components: {
            draggable,IvzFormItem
        },
        props: ['metas', 'global'],
        data() {
            return {
                options: {
                    ghostClass: 'ghost',
                    // forceFallback: true,
                    chosenClass: 'active',
                    dragClass: 'drag-handle'
                }
            }
        },
        created() {
            console.log(this)
        },
        updated() {
            console.log("drawer - " + this);
        }
    }
</script>

<style>
    .ivz-oc-drawer .ant-drawer{
        position: absolute;
    }
    .ivz-oc-drawer .ant-drawer-body {
        width: 100%;
        height: 100%;
    }
    .ivz-ocd-drag {
        width: 100%;
        min-height: 320px;
    }
</style>
