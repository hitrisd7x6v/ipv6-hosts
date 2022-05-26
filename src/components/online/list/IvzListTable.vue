<template>
    <a-table :columns="columns" :data-source="dataSource"  @click="activeHandle()"/>
</template>

<script>
    import {mixListItem} from "@/components/online/list/MixinListItem";

    export default {
        name: "IvzListTable",
        mixins: [mixListItem],
        data() {
            return {
                columns: [
                    {title: 'demo', key: 'demo'}
                ],
                dataSource: []
            }
        }
    }
</script>

<style scoped>

</style>
