<template>
  <a-form-item :label="meta.label">
    <a-select v-model:value="meta.field" :allowClear="meta.clear"
        @focus="focus" :options="meta.data" ref="select" @change="change">
    </a-select>
  </a-form-item>
</template>

<script>
export default {
  name: 'IvzOptionForm',
  props: ['meta'],
  setup(props, ctx) {
    let {focus, change} = props.meta.event;
    return {focus, change};
  }
}
</script>

<style scoped>

</style>
