<template>
  <div class="ivz-basic-list">
    <USearch layout="inline">
      <template #default="{model}">
        <slot name="search" :model="model"></slot>
      </template>
      <template #fun="{metas}">
        <slot name="fun" :metas="metas"></slot>
      </template>
    </USearch>
  </div>
</template>

<script>
import USearch from "@/components/search/BasicSearch.vue";
export default {
  name: "UBasicList",
  components: {USearch},
}
</script>

<style scoped>

</style>
