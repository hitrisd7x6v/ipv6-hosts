<template>
  <div class="iz-login iz-login-bg" :style="ivzLoginStyle">
      <div class="iz-login-card">
          <a-card :bordered="false">
              <img slot="title" :src="`${izCtx}/img/logo_login.png`" />
              <a-form :form="form" layout="horizontal">
                  <a-form-item has-feedback :label-col="labelCol" :wrapper-col="wrapperCol">
                      <a-input placeholder="用户名" size="large"
                               v-decorator="['userName', {rules: [{ required: true, message: '请输入用户名' }]}]">
                          <ivz-icon slot="prefix" type="iz-icon-account"></ivz-icon>
                      </a-input>
                  </a-form-item>
                  <a-form-item has-feedback :label-col="labelCol" :wrapper-col="wrapperCol">
                      <a-input placeholder="密码" type="password" size="large"
                               v-decorator="['password', {rules: [{ required: true, message: '请输入密码' }]}]">
                          <ivz-icon slot="prefix" type="iz-icon-password"></ivz-icon>
                      </a-input>
                  </a-form-item>
                  <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
                      <a-input placeholder="验证码" size="large" class="ivz-form-valid"
                               v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }]}]">
                          <ivz-icon slot="prefix" type="iz-icon-validate"></ivz-icon>
                      </a-input>
                      <img @click="clickImg" :src="loginModel.captchaImg" class="ivz-valid-img"/>
                  </a-form-item>
                  <a-form-item style="margin-bottom: 2px">
                      <a-button type="primary" size="large" shape="round" block @click="submit" :loading="loginModel.loading">
                          登 录
                      </a-button>
                  </a-form-item>
              </a-form>
              <div style="text-align: center; padding-top: 3px">
                  <span :class="loginModel.class">{{loginModel.errMsg}}</span>
              </div>
          </a-card>
          <a-divider>其他登录方式</a-divider>
          <a-row type="flex" justify="space-between" :gutter="3">
              <a-col span="6" style="text-align: right">
                  <a-icon type="wechat" :style="iconStyle" />
              </a-col>
              <a-col span="6" style="text-align: center;">
                  <a-icon type="github" :style="iconStyle" />
              </a-col>
              <a-col span="6" style="text-align: left">
                  <a-icon type="alipay-circle" :style="iconStyle" />
              </a-col>
          </a-row>
      </div>
  </div>
</template>
<script>
    import Global from "@/components/global.config"
export default {
  name: 'Login',
  data () {
    return {
      form: null,
      labelCol: {span: 0},
      wrapperCol: {span: 24},
        iconStyle: {fontSize: '36px', cursor: 'pointer'},
        ivzLoginStyle: {backgroundImage: null},
      user: {userName: null, password: null, captcha: null, rememberMe: false},
      loginModel: {
        loading: false,
        errMsg: '',
        class: 'iz-login-tip-error',
        izCaptcha: false,
        captchaImg: Global.captchaUrl
      }
    }
  },
  created: function () {
      this.ivzLoginStyle.backgroundImage = 'url("' + this.izStx + '/img/login.jpg' + '")'
        this.form = this.$form.createForm(this, {
          onValuesChange: (props, values) => {
            this.loginModel.errMsg = ''
          }
        })
        window.onkeydown = (ev) => {
          let code = ev.keyCode
          if (code === 13) {
            this.submit(ev)
          }
        }
  },
  methods: {
    submit (e) {
      this.form.validateFieldsAndScroll((err, user) => {
        if (!err) {
          this.loginModel.loading = true
          this.$http.post(Global.loginUrl, user)
            .then((resp) => {
              this.$nextTick(() => {
                location.href = this.izCtx + resp['successUrl']
              })
            }).catch(reason => {
              this.clickImg()
              this.loginModel.errMsg = reason
              this.loginModel.class = 'iz-login-tip-error'
            }).finally(() => {
              this.loginModel.loading = false
            })
        }
      })
    },
    clickImg () {
      this.loginModel.captchaImg = this.loginModel.captchaImg + '?t' + new Date()
    }
  }
}
</script>
