<template>
  <a-calendar v-model:value="value">
    <template #dateCellRender="{ current: value }">
        <template v-for="(item, index) in getListData(value)" :key="index">
          <a-tooltip title="prompt text">
            <a-badge :status="item.type" :text="item.content" />
          </a-tooltip>
        </template>
    </template>
<!--    <template #monthCellRender="{ current: value }">-->
<!--      <div v-if="getMonthData(value)" class="notes-month">-->
<!--        <section>{{ getMonthData(value) }}</section>-->
<!--        <span>Backlog number</span>-->
<!--      </div>-->
<!--    </template>-->
  </a-calendar>
</template>
<!--用户操作记录-->
<script>
import {ref} from "vue";

export default {
  name: "UserOperaHistory",
  setup() {
    const value = ref();

    const getListData = (value) => {
      let listData;
      switch (value.date()) {
        case 8:
          listData = [
            { type: 'warning', content: 'This is warning event.' },
            { type: 'success', content: 'This is usual event.' },
          ];
          break;
        case 10:
          listData = [
            { type: 'warning', content: 'This is warning event.' },
            { type: 'success', content: 'This is usual event.' },
            { type: 'error', content: 'This is error event.' },
          ];
          break;
        case 15:
          listData = [
            { type: 'warning', content: 'This is warning event' },
            { type: 'success', content: 'This is very long usual event。。....' },
            { type: 'error', content: 'This is error event 1.' },
            { type: 'error', content: 'This is error event 2.' },
            { type: 'error', content: 'This is error event 3.' },
            { type: 'error', content: 'This is error event 4.' },
          ];
          break;
        default:
      }
      return listData || [];
    };

    const getMonthData = (value) => {
      if (value.month() === 8) {
        return 1394;
      }
    };

    return {value, getListData, getMonthData};
  }
}
</script>

<style scoped>

</style>
