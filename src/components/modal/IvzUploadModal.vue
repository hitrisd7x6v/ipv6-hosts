<template>
  <a-modal v-model:visible="visible" :closable="false" :title="title" @cancel="cancel">
    <a-spin size="small" :tip="tip" :spinning="spinning">
      <a-upload-dragger @change="fileUploadChange" :accept="upload.accept"
          :fileList="fileList" :beforeUpload="beforeUpload" :multiple="upload.multiple"
          :remove="removeHandle" :disabled="upload.disabled">
        <div style="min-height: 138px">
          <p class="ant-upload-drag-icon">
            <CloudUploadOutlined />
          </p>
          <slot name="desc">
            <p class="ant-upload-text">
              点击或者拖入需要上传的文件
            </p>
          </slot>
        </div>
      </a-upload-dragger>
    </a-spin>
    <template #footer>
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" :loading="spinning" @click="submit">上传</a-button>
    </template>
  </a-modal>
</template>

<script>
import {reactive, ref} from "vue";
import {CloudUploadOutlined} from "@ant-design/icons-vue";
import {msgError, msgWarn} from "@/utils/message";
import {POST} from "@/utils/request";

export default {
  name: 'IvzUploadModal',
  components: {CloudUploadOutlined},
  props: {
    title: {type: String, default: '上传文件'},
    tip: {type: String, default: '文件上传中...'},
    upload: {type: Object, default: function () {return {}}}
  },
  setup() {
    let response = ref();
    let fileList = ref([]);
    let visible = ref(false);
    let spinning = ref(false);

    return {fileList, visible, spinning, response}
  },
  methods: {
    switchActive(status) {
      this.visible = status
    },

    switchSpinning(status) {
      this.spinning = status;
    },

    beforeUpload(file) {
      return false;
    },

    submit() {
      if(this.fileList.length == 0) {
        return msgWarn("请选择要上传的文件");
      }

      if(this.upload.submit instanceof Function) {
        this.spinning = true;
        this.upload.submit(this.fileList).then(() => {
          this.fileList.length = 0;
          this.cancel();
        }).finally(()=>{
          this.spinning = false
        })
      } else {
        this.spinning = true;
        let files = this.getFiles();

        POST(this.upload.action, files).then(resp => {
          this.cancel();
          this.response = resp;
          this.fileList.length = 0;
        }).catch(reason => {
          msgError(reason)
        }).finally(() => {
          this.spinning = false
        })
      }
    },

    getFiles() {
      const formData = new FormData();
      this.fileList.forEach(file => {
        formData.append(this.upload.name, file);
      });

      return formData;
    },

    getResponse() {
      return this.response;
    },

    removeHandle(file) {
      if(this.upload.remove instanceof Function) {
        this.upload.remove(file, this.fileList)
      } else {
        this.fileList.forEach((item, index) => {
          if(item.name == file.name) {
            this.fileList.splice(index, 1);
          }
        })
      }
    },

    cancel() {
      this.visible = false;
      this.spinning = false;
    },
    fileUploadChange({file, fileList, event}) {
      this.fileList = fileList;
    }
  }
}
</script>

<style scoped>

</style>
