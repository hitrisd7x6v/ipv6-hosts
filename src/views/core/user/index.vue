<template>
  <ivz-menu-view>
    <ivz-view-search>
      <ivz-input field="user.name" label="名称" defaultValue="25" />
      <ivz-date-time field="kl" picker="date" label="时间"
                     valueFormat="YYYY-MM-DD hh:mm:ss" defaultValue="2013-05-10"/>
    </ivz-view-search>
    <ivz-view-modal :labelCol="{span: 5}" @submit="submit">
      <ivz-input field="sex" label="性别" />
      <ivz-input field="phone" label="手机" />
    </ivz-view-modal>
    <ivz-view-table :columns="columns" @selectAll="select"
         :dataSource="data" :bordered="true" rowKey="id" size="small">
<!--      <template #c_iteaj="{record, text}">sdf</template>-->
<!--      <template #c_account_name>sdf</template>-->
    </ivz-view-table>
  </ivz-menu-view>
</template>

<script>
import {reactive} from "vue";
import {IvzBasicTable} from '@/components'
import {IvzInput, IvzDateTime} from "@/components/form/basic";
import IvzBasicList from "@/components/list/IvzBasicList.vue";
import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
import {IvzViewTable, IvzMenuView, IvzViewModal, IvzViewSearch} from "@/components/view";
import {FunMetaMaps} from "@/utils/SysUtils";

export default {
  name: "User",
  components: {
    IvzViewTable, IvzDateTime, IvzViewModal, IvzInput, IvzViewSearch,
      IvzBasicTable, IvzBasicList, IvzBasicSearch, IvzMenuView},
  setup() {
    let model = reactive({user: null})
    let columns = [
      {type: 'selection', fixed: true},
      {title: '性别', field: 'sex', dict: 'sex'},
      {title: '手机', field: 'phone'},
      {title: '姓名', field: 'realName'},
      {title: '用户名', field: 'userName'},
      {title: '账号', field: 'account.name'},
      {title: '操作', field: 'action', type: 'action'},
    ]
    let data = [

    ]
    return {model, columns, data}
  },
  mounted() {
    let viewMeta = this.getSearchFunMeta(FunMetaMaps.View);
    let callback = viewMeta.callback;
    viewMeta.callback = (model, meta, a) => {
      callback(model, meta, a);
    }
  },
  methods: {
    edit() {
      this.model.user.name = 8;
    },
    submit(e) {
      let formRef = this.$refs['basicForm'];
      formRef.resetFields();
    },
    select(row, b, a) {

    }
  }
}
</script>

<style scoped>

</style>
