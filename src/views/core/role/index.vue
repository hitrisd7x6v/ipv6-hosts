<template>
  <ivz-menu-view>
    <ivz-view-search @submit="changeHandle" ref="ivzForm">
        <ivz-input name="name" label="名称" defaultValue="8" @change="changeHandle"/>
        <ivz-select name="sex" label="性别" :options="options"
                    style="width: 158px;" :wrapper-col="{span: 18}"/>
        <ivz-switch name="status" checkedChildren="开" label="状态"></ivz-switch>
        <ivz-radio name="ko" :options="options" label="ko"/>
        <ivz-mentions name="kk" :options="options" />
        <ivz-date-time name="kl" picker="date" label="时间"
           valueFormat="YYYY-MM-DD hh:mm:ss" defaultValue="2013-05-10"/>
    </ivz-view-search>
  </ivz-menu-view>
</template>

<script>
import {reactive} from "vue";
import IvzForm from "@/components/form/basic/IvzForm";
import {IvzDateTime, IvzMentions, IvzInput, IvzSelect, IvzSwitch, IvzRadio} from "@/components/form/basic";
import IvzBasicList from "@/components/list/IvzBasicList.vue";
import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
import IvzMenuView from "@/components/view/IvzMenuView.vue";
import {IvzViewSearch} from "@/components/view";
export default {
  name: "Role",
  components: {
    IvzViewSearch,
    IvzMenuView,
    IvzBasicSearch,
    IvzDateTime, IvzMentions, IvzRadio, IvzSwitch, IvzSelect, IvzForm, IvzInput, IvzBasicList},
  setup() {
    let metas = reactive([
      {key: 'name', title: '名称'},
      {key: 'sex', title: '性别'},
      {key: 'status', title: '状态'},
      {key: 'ko', title: '这是'},
      {key: 'kk', title: '那是'},
      {key: 'kl', title: '时间'},
    ])
    let options = [
      {label: '男', value: 'man'},
      {label: '女', value: 'woman'},
    ]
    let model = {value: 3}
    let funMetas = [
      {field: 'query', name: '查询', type: 'primary', config: {}}
    ]
    return {metas, model, options, funMetas}
  },
  methods: {
    changeHandle(val) {
      let value = val.target.value;
      if(value == 'fk35') {
        let ref = this.$refs['ivzForm'];
        ref.setEditModel({name: '测试', sex: 'woman'})
      }
      // this.$refs['ivzForm'].setEditModel({name: 'skdfj'});
      // this.metas[0].title = val.target.value;
    }
  }
}
</script>

<style scoped>

</style>
