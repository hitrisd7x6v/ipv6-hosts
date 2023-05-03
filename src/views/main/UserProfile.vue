<template>
    <div class="ivz-uic-avatar">
        <a-avatar :size="128" :src="user.avatar">
            <template #icon>
                <UserOutlined />
            </template>
        </a-avatar>
        <h2 style="margin-top: 3px">{{user.nickName}}</h2>
    </div>
    <div class="ivz-uic-detail">
        <p>{{user.profile}}</p>
        <a-form>
            <ul class="ivz-uid-ul">
                <li class="ivz-uid-li">
                    <user-profile-item v-model="user.account">
                        <template #label>
                            <ivz-icon type="iz-icon-sys-user" /> 用户账号
                        </template>
                    </user-profile-item>
                </li>
                <li class="ivz-uid-li">
                    <user-profile-item v-model="user.phone">
                        <template #label>
                            <PhoneFilled /> 手机号码
                        </template>
                    </user-profile-item>
                </li>
                <li class="ivz-uid-li">
                    <user-profile-item v-model="user.deptName">
                        <template #label>
                            <ivz-icon type="iz-icon-dept" /> 所属部门
                        </template>
                    </user-profile-item>
                </li>
                <li class="ivz-uid-li">
                    <user-profile-item v-model="user.roleName">
                        <template #label>
                            <ivz-icon type="iz-icon-sys-role" /> 所属角色
                        </template>
                    </user-profile-item>
                </li>
            </ul>
        </a-form>
    </div>
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
import { mapGetters } from "vuex";
import { ref, defineComponent, h } from "vue";
import UserProfileItem from "@msn/main/UserProfileItem.vue";
import { editUser } from "@/api";

export default {
    name: "UserProfile",
    components: {
        UserProfileItem, SettingOutlined, EditOutlined, EllipsisOutlined, UserOutlined
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
        return { avatar, fileList }
    },
    methods: {
        submit (value) {
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
