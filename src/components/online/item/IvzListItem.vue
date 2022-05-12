<template>
    <ivz-card v-if="meta.type == 'card'" :meta="meta" :model="model"></ivz-card>
    <ivz-list-avatar v-else-if="meta.type=='avatar'" :meta="meta" :model="model" />
    <ivz-list-table v-else-if="meta.type == 'table'" :meta="meta" :model="model" />
    <ivz-online-list v-else-if="meta.type == 'list'" :meta="meta" :model="model" />
    <ivz-list-comment v-else-if="meta.type == 'comment'" :meta="meta" :model="model" />
    <ivz-list-timeline v-else-if="meta.type == 'timeline'" :meta="meta" :model="model" />
</template>

<script>
    import IvzCard from "@/components/online/list/IvzCard";
    import IvzListTable from "@/components/online/list/IvzListTable";
    import IvzOnlineList from "@/components/online/list/IvzOnlineList";
    import IvzListComment from "@/components/online/list/IvzListComment";
    import IvzListAvatar from "@/components/online/list/IvzListAvatar";
    import IvzListTimeline from "@/components/online/list/IvzListTimeline";
    export default {
        name: "IvzListItem",
        components: {IvzListTimeline, IvzListAvatar, IvzListTable, IvzListComment, IvzOnlineList, IvzCard},
        props: ['meta'],
        data() {
            return {
                model: {}
            }
        }
    }
</script>

<style scoped>

</style>
