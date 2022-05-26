<template>
    <img :src="model.src"  @click="activeHandle()" :width="model.width" :height="model.height"/>
</template>

<script>
    import {mixListItem} from "./MixinListItem"
    export default {
        name: "IvzListImg",
        mixins: [mixListItem]
    }
</script>

<style scoped>

</style>
