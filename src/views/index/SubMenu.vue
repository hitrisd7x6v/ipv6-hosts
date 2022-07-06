<template>
  <a-sub-menu v-bind="$attrs" :key="menuInfo.url">
    <template #title>
      <ivz-icon :type="menuInfo.icon"></ivz-icon>
      <span class="ivz-level-o" v-text="menuInfo.name"></span>
    </template>
    <template v-for="item in menuInfo.children">
      <template v-if="item.type=='V'">
        <a-menu-item :key="item.url">
          <ivz-icon :type="item.icon"></ivz-icon>
          <span>{{ item.name }}</span>
        </a-menu-item>
      </template>
      <template v-else>
        <ivz-sub-menu :menu-info="item"/>
      </template>
    </template>
  </a-sub-menu>
</template>

<script>
export default {
  name: "IvzSubMenu",
  props: {
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style scoped>

</style>
