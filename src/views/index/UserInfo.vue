<template>
  <a-drawer title="用户基础信息" v-model:visible="visible"
      placement="right" :closable="false" :get-container="getContainer"
      :after-visible-change="afterVisibleChange">

  </a-drawer>
</template>

<script>
import {ref, reactive} from 'vue'
export default {
  name: "UserInfo",
  setup() {
    const visible = ref(false);

    return {visible}
  },
  methods: {
    getContainer() {
      return document.getElementById("container")
    },
    afterVisibleChange() {

    }
  }
}
</script>

<style scoped>

</style>
