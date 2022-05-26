<template>
    <div @click="activeHandle()">
        <a-statistic title="Active Users" :value="112893" style="margin-right: 50px" />
        <a-statistic-countdown title="Countdown" :value="deadline"
            style="margin-right: 50px" @finish="onFinish" />
    </div>
</template>

<script>
    import {mixListItem} from "./MixinListItem"
    export default {
        name: "IvzListStatistic",
        mixins: [mixListItem]
    }
</script>

<style scoped>

</style>
