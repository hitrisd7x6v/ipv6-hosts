<template>
  <a-form :model="model" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
    <ivz-option-form :meta="meta"></ivz-option-form>
  </a-form>
</template>

<script>
import IvzOptionForm from "./form/dataForm/IvzOptionForm.vue";
import HelloWorld from "./components/HelloWorld.vue";
export default {
  components: {HelloWorld, IvzOptionForm},
  setup() {
    let meta={label: '测试', field: 'test', data:[
        {label: 'aa', value: 1},
        {label: 'bb', value: 2},
      ], event: {
        change(val) {
          console.log(val)
        }
      }};
    let model = {test: 1}
    return {meta, model};
  }
}
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
