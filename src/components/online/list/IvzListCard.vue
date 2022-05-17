<template>
    <a-card hoverable :style="getStyle()">
        <img slot="cover" alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"/>
        <template slot="actions" class="ant-card-actions">
            <a-icon key="setting" type="setting" />
            <a-icon key="edit" type="edit" />
            <a-icon key="ellipsis" type="ellipsis" />
        </template>
        <a-card-meta title="Card title" description="This is the description">
            <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        </a-card-meta>
    </a-card>
</template>

<script>
    import {mixListItem} from "@/components/online/list/MixinListItem";

    export default {
        name: "IvzListCard",
        mixins: [mixListItem],
        methods: {
            getStyle() {
                return {width: `${this.meta.w - 2}px`, height: `${this.meta.h - 2}px`}
            }
        }
    }
</script>

<style scoped>

</style>
