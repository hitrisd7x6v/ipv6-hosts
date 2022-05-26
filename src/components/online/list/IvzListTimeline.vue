<template>
    <a-timeline @click="activeHandle()">
        <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
        <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
        <a-timeline-item>Technical testing 2015-09-01</a-timeline-item>
        <a-timeline-item>Network problems being solved 2015-09-01</a-timeline-item>
    </a-timeline>
</template>

<script>
    import {mixListItem} from './MixinListItem'
    export default {
        name: "IvzListTimeline",
        mixins: [mixListItem]
    }
</script>

<style scoped>

</style>
