<template>
  <div class="iz-login iz-login-bg">
    <div class="iz-login-card">
      <a-card :bordered="false">
        <img slot="title" src="/img/login_logo.png" style="margin-bottom: 12px"/>
        <a-form layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item has-feedback v-bind="validateInfos.userName">
            <a-input placeholder="用户名" size="large" v-model:value="user.userName">
              <ivz-icon slot="prefix" type="iz-icon-account"></ivz-icon>
            </a-input>
          </a-form-item>
          <a-form-item has-feedback v-bind="validateInfos.password">
            <a-input placeholder="密码" type="password" size="large" v-model:value="user.password">
              <ivz-icon #prefix type="iz-icon-password"></ivz-icon>
            </a-input>
          </a-form-item>
          <a-form-item name="captcha" v-bind="validateInfos.captcha">
            <a-input placeholder="验证码" size="large" v-model:value="user.captcha"
                     class="ivz-form-valid">
              <ivz-icon slot="prefix" type="iz-icon-validate"></ivz-icon>
            </a-input>
            <img @click="clickImg" :src="loginModel.captchaImg" class="ivz-valid-img"/>
          </a-form-item>
          <a-form-item style="margin-bottom: 2px">
            <a-button type="primary" size="large" shape="round" block
                      @click="submit" :loading="loginModel.loading">
              登 录
            </a-button>
          </a-form-item>
        </a-form>
        <div style="text-align: center; padding-top: 3px">
          <span :class="loginModel.class">{{loginModel.errMsg}}</span>
        </div>
        <a-divider style="margin: 12px 0px">其他登录方式</a-divider>
        <a-row type="flex" justify="space-between" :gutter="3">
          <a-col span="6" style="text-align: right; cursor: pointer">
<!--            <a-icon type="wechat" :style="iconStyle" />-->
          </a-col>
          <a-col span="6" style="text-align: center; cursor: pointer">
            <ivz-icon type="iz-icon-gitee" style="font-size: 28px"
                      @click="oauth2Login('Gitee')"></ivz-icon>
          </a-col>
          <a-col span="6" style="text-align: left; cursor: pointer">
<!--            <a-icon type="alipay-circle" :style="iconStyle" />-->
          </a-col>
        </a-row>
      </a-card>

    </div>
    <div style="position: absolute; bottom: 0px; text-align: center; width: 100%">
      Copyright © 2020-2021 iteaj.com All Rights Reserved.
    </div>
  </div>
</template>
<script>
import {reactive} from 'vue'
import {Form} from 'ant-design-vue'
import {useRoute} from "vue-router";
import {captchaUri, login, oauth2} from '@/api'
import CoreConsts from "@/components/CoreConsts";

export default {
  name: 'login',
  data () {
    return {
      form: null,
      iconStyle: {fontSize: '36px', cursor: 'pointer'},
    }
  },
  setup() {
    let labelCol = {span: 0};
    let wrapperCol = {span: 24};
    const user = reactive({
      userName: 'admin',
      password: 'admin123456',
      captcha: null});
    const rules = reactive({
      userName: [{type: 'string', required: true, message: ''}],
      password: [{type: 'string', required: true, message: ''}],
    });

    const loginModel = reactive({
      loading: false,
      errMsg: '',
      izCaptcha: false,
      captchaImg: captchaUri,
      class: 'iz-login-tip-error'
    });
    const {validateInfos, validate, validateField} = Form.useForm(user, rules);

    const clickImg = () => {
      loginModel.captchaImg = captchaUri + '?t=' + new Date().getTime()
    }


    window.onkeydown = (ev) => {
      let code = ev.keyCode
      if (code === 13) {
        this.submit()
      }
    }
    return {user, labelCol, wrapperCol, validateInfos, loginModel, clickImg, validate}
  },
  methods: {
    oauth2Login(type) {
      oauth2(type)
    },
    submit() {
      this.validate().then(res => {
        this.loginModel.loading = true;
        login(this.user).then(({code, message})=>{
          if(code == CoreConsts.SuccessCode) {
            this.$router.push("/").finally();
          } else {
            this.clickImg();
            this.loginModel.errMsg = message;
          }
        }).catch(reason => {
          this.clickImg();
        }).finally(() => this.loginModel.loading = false);
      })
    }
  }
}
</script>
<style>
.iz-login-bg {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/img/login.jpg");
}
.iz-login-card {
  top: 18%;
  right: 10%;
  width: 342px;
  position: absolute;
  background-color: rgba(255, 255, 255, 0);
}
.iz-login .ant-input {
  padding-left: 34px!important;
}
.iz-login .ant-input.ant-input-lg {
  border-radius: 20px;
}
.iz-login .ivz-form-valid {
  width: 158px;
}
.iz-login .ivz-valid-img {
  height: 40px;
  width: 108px;
  margin-left: 16px;
  vertical-align: top;
}
.iz-login-card .ant-card {
  background-color: rgba(255, 255, 255, 0);
}
.iz-login-card .ant-card-body {
  padding: 8px 24px 16px;
  text-align: center;
  border-radius: 12px;
  background-color: #ffffffb5;
}
.iz-login-card .ant-card-head {
  line-height: 48px;
  background-color: #ffffffd4;
  border-radius: 16px 16px 0px 0px;
}
.iz-login-card .ant-card-head-title {
  padding: 0px;
  text-align: center;
}
.iz-login-tip {
  text-align: center;
}
.iz-login-tip-error {
  color: #ed4014;
}
.iz-login-tip-success {
  color: #19be6b;
}
</style>
