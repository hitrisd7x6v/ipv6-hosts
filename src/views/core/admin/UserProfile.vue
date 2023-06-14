<template>
    <UView>
      <UForm v-model="user" :span="[3, 10]">
        <AFormItem label="账号" />
        <UInput field="name" label="用户名" />
      </UForm>
    </UView>
</template>

<script>
import {
  DeploymentUnitOutlined,
  EditOutlined,
  EllipsisOutlined,
  FieldTimeOutlined,
  MailFilled,
  PhoneFilled,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import {mapGetters} from "vuex";
import {reactive, ref} from "vue";
import {editUser} from "@/api";

export default {
    name: "UserProfile",
    components: {
        SettingOutlined, EditOutlined, EllipsisOutlined, UserOutlined
        , PhoneFilled, MailFilled, DeploymentUnitOutlined, FieldTimeOutlined
    },
    computed: {
        ...mapGetters({
            user: 'sys/user'
        })
    },
    setup () {
        let avatar = ref(false);
        let fileList = ref([]);
        return { avatar, fileList}
    },
    methods: {
        submit (value) {
          this.$view.getEditContextByUid()
            return new Promise(((resolve, reject) => {
                editUser(this.user).then(resolve).catch(reject)
            }))
        },
    }
}
</script>

<style scoped>
.ivz-uic-avatar {
    padding-top: 8px;
    text-align: center;
    margin-bottom: 6px;
}
.ivz-uic-detail {
    padding: 0px 5px;
    text-align: center;
}
.ivz-uid-ul {
    margin: 0px;
    padding: 0px;
    list-style: none;
}
.ivz-uid-li {
    padding: 3px;
    height: 42px;
    margin: 3px 0px;
    line-height: 35px;
    border-bottom: 1px solid #e9e9e9;
}
.ivz-uid-li .anticon {
    font-size: 16px;
    vertical-align: text-top;
}
.ivz-uid-item.editable {
    flex-grow: 1;
    text-align: right;
}
</style>
