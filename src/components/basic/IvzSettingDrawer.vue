<template>
    <a-drawer @close="close" :closable="false" :width="420"
              placement="right" get-container="#slider-drawer"
              :visible="visible" :headerStyle="{height: '0px'}">
        <a-form-model :model="model" :colon="false" :rules="rules"
              :label-col="labelCol" :wrapper-col="wrapperCol"
              ref="form" :hideRequiredMark="true">
        <div class="ivz-it-content">
            <div style="text-align: center; padding: 0px">
                <a-upload name="avatar" list-type="picture-card" :data="data"
                          :show-upload-list="false" @change="avatarChange"
                          :action="action">
                    <div class="ivz-itc-avatar">
                        <a-avatar :size="102" :src="model.avatar" alt="404" :loadError="avatarError">
                            <a-icon slot="icon" v-if="model.avatar==null || model.avatar == ''" type="user" />
                            <ivz-icon slot="icon" type="iz-icon-not" v-if="avatar404" :style="{fontSize: '56px', color: 'black'}"/>
                        </a-avatar>
                    </div>
                </a-upload>
            </div>
<!--            <div style="text-align: center; ">-->
<!--                <label style="font-size: 16px">{{model.name}}</label>-->
<!--            </div>-->
            <div class="ivz-itc-profile">
                <label>{{model.remark}}</label>
            </div>
            <div class="ivz-itc-config">
                <div>
                    <a-form-model-item class="ivz-itc-item" label="用户名" prop="name">
                        <a-input v-model="model.name" v-show="status.name"
                            @blur="blurHandle('name')" ref="name"/>
                        <label class="ivz-itc-label" v-show="!status.name">{{model.name}}</label>
                    </a-form-model-item>
                    <a class="ivz-itc-span" @click="statusHandle('name')">
                        修改
                    </a>
                </div>
                <div>
                    <a-form-model-item class="ivz-itc-item" label="邮箱" prop="email">
                        <a-input v-model="model.email" v-show="status.email"
                             @blur="blurHandle('email')" ref="email"/>
                        <label class="ivz-itc-label" v-show="!status.email">{{model.email}}</label>
                    </a-form-model-item>
                    <a class="ivz-itc-span" @click="statusHandle('email')">
                        修改
                    </a>
                </div>
                <div>
                    <a-form-model-item class="ivz-itc-item" label="手机号" prop="phone">
                        <a-input v-model="model.phone" v-show="status.phone"
                             @blur="blurHandle('phone')" ref="phone"/>
                        <label class="ivz-itc-label" v-show="!status.phone">{{model.phone}}</label>
                    </a-form-model-item>
                    <a class="ivz-itc-span" @click="statusHandle('phone')">
                        修改
                    </a>
                </div>
                <div>
                    <a-form-model-item class="ivz-itc-item" label="密码" prop="password">
                        <a-input-password v-model="model.password" ref="password" placeholder="密码长度八位以上"
                              v-show="status.password" @blur="blurHandle('password')"/>
                        <label class="ivz-itc-label" v-show="!status.password">***********</label>
                    </a-form-model-item>
                    <a class="ivz-itc-span" @click="statusHandle('password')">
                        修改
                    </a>
                </div>
                <div>
                    <a-form-model-item class="ivz-itc-item" label="简介" prop="remark">
                        <a-input v-model="model.remark" v-show="status.remark" @blur="blurHandle('remark')"/>
                        <label class="ivz-itc-label" v-show="!status.remark">{{model.remark}}</label>
                    </a-form-model-item>
                    <a class="ivz-itc-span" @click="statusHandle('remark')">
                        修改
                    </a>
                </div>
            </div>
            <div class="ivz-itc-footer">
                <a-button type="primary" shape="circle" :loading="loading"
                      @click="submit" size="large">
                    <ivz-icon type="iz-icon-submit" :style="{fontSize: '24px'}"/>
                </a-button>
            </div>
        </div>
        </a-form-model>
    </a-drawer>
</template>

<script>
    import Global from "@/components/global.config"
    export default {
        name: "IvzSettingDrawer",
        data() {
            return  {
                data: {},
                visible: false,
                activityItem: 1,
                loading: false,
                fileList: [],
                avatar404: false,
                labelCol: { span: 4 },
                wrapperCol: { span: 18 },
                action: Global.avatarUrl,
                model: {
                    name: '',
                    phone: '',
                    email: '',
                    remark: '',
                    avatar: null,
                    password: null
                },
                rules: {
                    name: [
                        {required: true, message: ' '}
                    ],
                    password: [
                        {min: 8, message: ' '}
                    ]
                },
                status: {
                    password: false,
                    name: false,
                    email: false,
                    phone: false,
                    remark: false,
                }
            }
        },
        methods: {
            open() {
                this.visible = true;
            },
            close() {
                this.visible = false;
            },
            toggle() {
                this.visible = !this.visible;
            },
            init(user) {
                if(user && !user['password']) {
                    this.$set(user, 'password', null);
                }

                this.model = user ? user : this.model;
            },
            submit() {
                this.$refs['form'].validate().then(valid=>{
                    if(valid) {
                        this.loading = true;
                        this.$http.post(Global.modUserUrl, this.model).then(resp=>{
                            Object.keys(this.status).forEach(key=>this.status[key]=false)
                        }).catch(reason => {
                            this.$msg.errorNotify(reason);
                        }).finally(()=>{
                            this.loading = false;
                        })
                    }
                });
            },
            blurHandle(type) {

            },
            statusHandle(type) {

                // 校验上一个表单的状态
                Object.keys(this.status).forEach(item=>{
                    if(this.status[item]) {
                        this.$refs['form'].validateField(item, (a, resp)=>{
                            if(resp == null) { // 校验成功
                                this.status[item] = false;
                            }
                        });
                    }
                });

                // 如果全部校验通过
                let booleans = Object.values(this.status).filter(item=>item);
                if(booleans.length == 0) this.status[type] = true;
            },
            avatarError() {
                this.avatar404 = true;
            },
            avatarChange({file, fileList, event}) {
                this.$log.debugLog("头像上传", '上传状态改变', file);

                if(file.status == 'done') {
                    let response = file.response;
                    if(response.code == 200) {
                        this.model.avatar = response.data.url + "?t=" + new Date().getTime();
                    } else {
                        this.$msg.errorNotify(response.message);
                        this.$log.errorLog("上传头像失败", '未知错误', response.data);
                    }
                }
            }
        }
    }
</script>

<style>
    .ivz-it-content {
        color: #000000;
    }
    .ivz-it-content .ant-upload-list {
        /*display: none;*/
    }
    .ivz-it-content input {
        border-top: 0px;
        border-left: 0px;
        border-right: 0px;
        border-radius: 0px;
        text-align: center;
        /*border-bottom: 1px solid #afafaf;*/
    }

    .ivz-it-content input:focus {
        box-shadow: 0px 0px 0px 0px;
        border-left-color:  rgba(255, 255, 255, 0);
        border-bottom-color: rgba(255, 255, 255, 0);
        border-right-color:  rgba(255, 255, 255, 0);
    }
    .ivz-itc-avatar {
        width: 114px;
        cursor: pointer;
        text-align: center;
        border-radius: 50%;
        display: inline-block;
        border: 6px solid #ffffffb0;
        box-shadow: 0px 0px 6px 0px #c4c4c4;
    }
    .ivz-itc-profile {
        color: #888585;
        font-size: 12px;
        text-align: center;
        /*text-indent: 3em;*/
    }
    .ivz-itc-config {
        padding: 0px 24px;
        color: #353739;
        list-style: none;
        margin-top: 32px;
    }
    .ivz-itc-item {
        width: 250px;
        margin-right: 6px;
        display: inline-block;
    }
    .ivz-itc-span {
        height: 40px;
        font-size: 12px;
        cursor: pointer;
        line-height: 40px;
        margin-left: 24px;
        display: inline-block;
    }
    .ivz-itc-label {
        width: 230px;
        padding-left: 24px;
        display: inline-block;
    }

    .ivz-it-content .ant-upload.ant-upload-select-picture-card {
        border: 0px;
        margin-right: 0px;
        margin-bottom: 0px;
        background-color: unset;
    }

    .ivz-it-content .ant-upload-picture-card-wrapper {
        width: unset;
    }

    .ivz-itc-footer {
        text-align: center;
        margin: 8px 16px;
    }
</style>
