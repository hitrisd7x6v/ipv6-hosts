<template>
  <ivz-menu-view>
    <ivz-view-search></ivz-view-search>
    <ivz-view-table :columns="columns"></ivz-view-table>
    <ivz-view-modal :rules="rules"></ivz-view-modal>
  </ivz-menu-view>
</template>
<!--字典管理-->
<script>
export default {
  name: "DictType",
  setup() {
    let columns = [

    ]
    let rules = {

    }
    return {columns, rules}
  }
}
</script>

<style scoped>

</style>
