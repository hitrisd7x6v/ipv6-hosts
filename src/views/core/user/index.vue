<template>
  <ivz-menu-view>
<!--    <ivz-view-search>-->
<!--      <ivz-input field="user.name" label="名称" defaultValue="25"/>-->
<!--    </ivz-view-search>-->
    <ivz-view-modal title="新增" :labelCol="{span: 5}" @submit="submit">
      <ivz-input name="user.sex" label="性别" />
      <ivz-input name="user.name" label="用户名" />
    </ivz-view-modal>
    <ivz-view-table :columns="columns" @selectAll="select"
         :dataSource="data" :bordered="true" rowKey="id">
      <template #c_phone="{record, text}">{{text}}</template>
      <template #c_account_name>sdf</template>
    </ivz-view-table>
    <a-form ref="basicForm" :model="model">
      <a-form-item :name="['name']" label="用户名">
        <a-input></a-input>
      </a-form-item>
      <a-button @click="submit">重置</a-button>
      <a-button @click="edit">修改</a-button>
    </a-form>
  </ivz-menu-view>
</template>

<script>
import {IvzBasicTable} from '@/components'
import {IvzViewTable, IvzMenuView, IvzViewModal, IvzViewSearch} from "@/components/view";
import {IvzInput} from "@/components/form/basic";
import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
import IvzBasicList from "@/components/list/IvzBasicList.vue";
import {reactive} from "vue";

export default {
  name: "user",
  components: {
    IvzViewTable,
    IvzBasicTable, IvzBasicList, IvzBasicSearch, IvzViewModal, IvzInput, IvzViewSearch, IvzMenuView},
  setup() {
    let model = reactive({user: null})
    let columns = [
      {type: 'selection', fixed: true},
      {title: '性别', dataIndex: 'sex', dict: 'sex'},
      {title: '手机', dataIndex: 'phone'},
      {title: '姓名', dataIndex: 'realName'},
      {title: '用户名', dataIndex: 'userName'},
      {title: '账号', dataIndex: 'account.name'},
      {title: '操作', dataIndex: 'action', type: 'action'
        // , funMetas: [
        //   {field: 'Edit', name: '编辑', callback: (row) => {
        //       console.log(row)
        //     }
        //   }, {
        //     field: 'Del', name: '删除'
        //   }
        // ]
      },
    ]
    let data = [
      {id: 1, phone: '18059222381', sex: 'man', realName: '汪XX', userName: 'iteaj', account: null},
      {id: 2, phone: '18059222382', sex: 'woman', realName: '汪XX', userName: 'iteaj', account: null}
    ]
    return {model, columns, data}
  },
  mounted() {
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
