<template>
    <label v-html="model.label" @click="activeHandle()"></label>
</template>

<script>
    import {mixListItem} from "./MixinListItem"
    export default {
        name: "IvzListLabel",
        mixins: [mixListItem]
    }
</script>

<style scoped>

</style>
