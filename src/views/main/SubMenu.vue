<template>
  <a-sub-menu>
    <template #title>
      <ivz-icon :type="menu.icon"></ivz-icon>
      <span class="ivz-level-o">{{menu.name}}</span>
    </template>
    <template v-for="item in menu.children" :key="item.url">
      <template v-if="item.type=='V'">
        <a-menu-item :key="item.url">
          <ivz-icon :type="item.icon"></ivz-icon>
          <span>{{ item.name }}</span>
        </a-menu-item>
      </template>
      <template v-else>
        <ivz-sub-menu :menu="item" :key="item.id"/>
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
