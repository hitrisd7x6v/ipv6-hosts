<template>
  <div class="ivz-basic-list">
    <ivz-basic-search layout="inline">
      <template #default="{model}">
        <slot name="search" :model="model"></slot>
      </template>
      <template #fun="{metas}">
        <slot name="fun" :metas="metas"></slot>
      </template>
    </ivz-basic-search>
  </div>
</template>

<script>
import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
export default {
  name: "IvzBasicList",
  components: {IvzBasicSearch},
}
</script>

<style scoped>

</style>
