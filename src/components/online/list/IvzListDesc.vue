<template>
    <a-descriptions title="User Info" @click="activeHandle()">
        <a-descriptions-item label="UserName">
            Zhou Maomao
        </a-descriptions-item>
        <a-descriptions-item label="Telephone">
            1810000000
        </a-descriptions-item>
        <a-descriptions-item label="Live">
            Hangzhou, Zhejiang
        </a-descriptions-item>
        <a-descriptions-item label="Remark">
            empty
        </a-descriptions-item>
        <a-descriptions-item label="Address">
            No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
        </a-descriptions-item>
    </a-descriptions>
</template>

<script>
    import {mixListItem} from "@/components/online/list/MixinListItem";

    export default {
        name: "IvzListDesc",
        mixins: [mixListItem],
    }
</script>

<style scoped>

</style>
