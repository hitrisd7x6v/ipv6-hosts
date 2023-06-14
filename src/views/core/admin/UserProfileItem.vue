<template>
  <div class="ivz-upi-item">
    <div class="upi-form">
      <a-form-item :colon="false" :label-col="{span: 8}" :wrapper-col="{span: 16}">
        <template #label>
          <slot name="label"></slot>
        </template>
        <div @click="editHandle">
          <slot v-if="editing">
            <a-input v-model:value="value" size="small" ref="oriInput"
               @change="changeHandle" @blur="blurHandle" style="text-align: center">
              <template #suffix>
                <LoadingOutlined v-show="loading" spin/>
              </template>
            </a-input>
          </slot>
          <span v-else class="ivz-upi-label">{{value}}</span>
        </div>
      </a-form-item>
    </div>
<!--    <div class="upi-icon">-->
<!--      <EditOutlined v-show="this.editable"/>-->
<!--    </div>-->
  </div>
</template>

<script>
import {EditOutlined, LoadingOutlined} from '@ant-design/icons-vue'
import {ref} from "vue";
export default {
  name: "UserProfileItem",
  components: {EditOutlined, LoadingOutlined},
  props: ['modelValue', 'blur', 'editable'],
  setup({modelValue}) {
    let value = modelValue || ref(null);

    let loading = ref(false);
    let editing = ref(false);

    return {editing, value, loading}
  },
  updated() {
    this.value = this.$props['modelValue'];
  },
  methods: {
    blurHandle() {
      this.loading = true;
      this.blur(this.value).finally(() => {
        this.loading = false
        this.editing = false
      })
    },
    editHandle() {
      if(this.editable) {
        this.editing = true;
        this.$nextTick().then(() => {
          this.$refs['oriInput'].focus();
        })
      }
    },
    changeHandle(e) {
      let valueEvent = this.$attrs['onUpdate:modelValue'];
      valueEvent(this.value);
    }
  }
}
</script>

<style>
.ivz-upi-item {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
}
.ivz-upi-item .upi-form {
  flex-grow: 1;
}
.ivz-upi-item .upi-icon {
  flex-grow: 0;
  cursor: pointer;
  flex-basis: 22px;
}
.ivz-upi-item .ivz-upi-label {
  width: 100%;
  height: 100%;
  padding: 0px 5px;
  text-align: right;
  display: inline-block
}
.ivz-upi-item .ant-input {
  border-top: 0px!important;
  border-left: 0px!important;
  border-right: 0px!important;
  text-align: center!important;
}
.ivz-upi-item .ant-input:focus {
  box-shadow: unset!important;
}
.ivz-upi-item .ant-input-affix-wrapper {
  border-top: 0px!important;
  border-left: 0px!important;
  border-right: 0px!important;
}
.ivz-upi-item .ant-input-affix-wrapper-focused {
  box-shadow: none;
}
</style>
