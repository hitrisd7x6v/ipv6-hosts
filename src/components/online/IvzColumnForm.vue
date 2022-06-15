<template>
  <a-input-group>
      <a-input v-model="model[meta.field]" :allowClear="true" style="width: 98px"
         @change="(val)=>changeHandle(val.target.value, meta)" :placeholder="meta.placeholder"/>
      <a-cascader style="width: 108px" :options="options"
          :load-data="loadData" v-model="meta.key" placeholder="请选择字段"  />
  </a-input-group>
</template>

<!--表列名组件-->
<script>
export default {
  name: "IvzColumnForm",
  props: ["meta", "model", "global"],
  watch: {
    options: {
      handler(newValue, oldValue) {
        console.log(newValue)
      }
    }
  },
  data() {
    return {
      options: []
    }
  },
  created() {
    this.options = this.global.selectedForeign
  },
  methods: {
    changeHandle() {

    },
    loadData() {

    }
  }
}
</script>

<style scoped>

</style>
