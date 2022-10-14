<template>
  <a-sub-menu :key="menu.id">
    <template #title>
      <ivz-icon :type="menu.icon"></ivz-icon>
      <span class="ivz-level-o">{{menu.name}}</span>
    </template>
    <template v-for="item in menu.children">
      <template v-if="item.type=='V'">
        <a-menu-item :key="item.url">
          <ivz-icon :type="item.icon"></ivz-icon>
          <span>{{ item.name }}</span>
        </a-menu-item>
      </template>
      <template v-else-if="item.type=='M'">
        <ivz-sub-menu :menu="item"/>
      </template>
    </template>
  </a-sub-menu>
</template>

<script>
export default {
  name: "IvzSubMenu",
  props: {
    menu: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style scoped>

</style>
