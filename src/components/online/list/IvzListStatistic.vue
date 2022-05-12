<template>
    <div>
        <a-statistic title="Active Users" :value="112893" style="margin-right: 50px" />
        <a-statistic-countdown title="Countdown" :value="deadline"
            style="margin-right: 50px" @finish="onFinish" />
    </div>
</template>

<script>
    export default {
        name: "IvzListStatistic"
    }
</script>

<style scoped>

</style>
