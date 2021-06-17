<template functional>
    <a-sub-menu :key="props.menus.id">
        <span slot="title">
            <ivz-icon :type="props.menus.icon"></ivz-icon>
            <span>{{ props.menus.name }}</span>
        </span>
        <template v-for="item in props.menus.children">
            <a-menu-item v-if="item.type=='V'" :key="item.url">
                <ivz-icon :type="item.icon"></ivz-icon>
                <span>{{ item.name }}</span>
            </a-menu-item>
            <ivz-sub-menu v-else-if="item.children" :key="item.url" :menus="item" />
        </template>
    </a-sub-menu>
</template>
<script>
export default {
    name: 'IvzSubMenu',
    props: ['menus']
}
</script>

<style scoped>

</style>
