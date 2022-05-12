<template>
    <a-avatar :size="meta.w" icon="user" />
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
