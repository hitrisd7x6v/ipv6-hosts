<template>
    <a-avatar :size="meta.w" icon="user" @click="activeHandle()" />
</template>

<script>
    import {mixListItem} from "@/components/online/list/MixinListItem";

    export default {
        name: "IvzListAvatar",
        mixins: [mixListItem],
        created() {}
    }
</script>

<style scoped>

</style>
