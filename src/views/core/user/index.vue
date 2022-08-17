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
    <ivz-view-table :columns="columns" :dataSource="data" :bordered="true" size="small">
      <template #c_account_name>account</template>
    </ivz-view-table>
  </ivz-menu-view>
</template>

<script>
import {reactive} from "vue";
import {IvzBasicTable} from '@/components'
import IvzBasicList from "@/components/list/IvzBasicList.vue";
import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
import {IvzViewTable, IvzMenuView, IvzViewModal, IvzViewSearch} from "@/components/view";
import {FunMetaMaps} from "@/utils/SysUtils";

export default {
  name: "User",
  components: {
    IvzViewTable, IvzViewModal, IvzViewSearch,
      IvzBasicTable, IvzBasicList, IvzBasicSearch, IvzMenuView},
  setup() {
    let model = reactive({user: null})
    let sex = [{label: '男', value: 'man'}, {label: '女', value: 'woman'}]
    let columns = [
      {type: 'selection', fixed: true},
      {title: '用户昵称', field: 'name'},
      {title: '用户账号', field: 'account'},
      {title: '性别', field: 'sex', options: sex},
      {title: '手机', field: 'phone'},
      {title: '邮箱', field: 'email'},
      {title: '状态', field: 'status'},
      {title: '创建时间', field: 'createTime'},
      {title: '操作', field: 'action', type: 'action'},
    ]
    let data = [

    ]
    return {model, columns, data}
  },
  mounted() {
    let viewMeta = this.getSearchFunMeta(FunMetaMaps.View);
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
