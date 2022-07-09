<template>
  <a-list item-layout="horizontal" :data-source="dataSource" :pagination="true">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        >
          <template #title>
            <a href="https://www.antdv.com/">{{ item.title }}</a>
          </template>
          <template #avatar>
            <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>

<script>
import {getNotifyList} from "@/api";
import {ref} from "vue";

export default {
  name: "UserNotifyList",
  setup() {
    let dataSource = ref([]);
    getNotifyList().then(({data}) => {
      dataSource.value = data;
    })

    return {dataSource};
  }
}
</script>

<style scoped>

</style>
