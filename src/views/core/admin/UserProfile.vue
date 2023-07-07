<template>
  <ARow :gutter="18" class="u-user-profile">
    <ACol span="6" style="background: #ffffff;">
      <ACard :bordered="false">
        <div style="text-align: center; padding-top: 8px">
          <a-avatar :size="110" :src="user.avatar" @click="avatarClick">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <h2 class="u-user-name">{{user.name}}</h2>
          <div class="u-user-desc">{{user.remark}}</div>
        </div>
        <div class="u-user-list">
          <div class="u-list-item">

          </div>
        </div>
      </ACard>
    </ACol>
    <ACol span="18">
      <div style="background: #ffffff; padding: 16px">
        <ATabs>
          <a-tab-pane key="1" tab="基本信息">
            <UForm v-model="user" :span="[2, 8]">
              <UInput field="name" label="昵称" size="large" />
              <UInput field="sex" label="性别" size="large" />
              <UInput field="email" label="邮箱" size="large" />
              <UTextarea field="remark" label="个人简介" />
              <UInput field="address" label="地址" />
            </UForm>
          </a-tab-pane>
        </ATabs>
      </div>
    </ACol>
    <a-modal v-model:visible="visible" :footer="null" title="裁剪图片" :width="680">
      <div>
        <ARow class="u-cropper">
          <ACol :span="16" class="u-cropper-item cropper">
            <vueCropper ref="cropper" :img="option.img" :output-size="option.size" :output-type="option.outputType" :info="true" :full="option.full" :fixed="fixed" :fixed-number="fixedNumber"
                        :can-move="option.canMove" :can-move-box="option.canMoveBox" :fixed-box="option.fixedBox" :original="option.original"
                        :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight" :center-box="option.centerBox"
                        @real-time="realTime" :high="option.high" @img-load="imgLoad" mode="cover" :max-img-size="option.max" @crop-moving="cropMoving">
            </vueCropper>
          </ACol>
          <ACol :span="8" class="u-cropper-item preview">
            <div style="overflow: hidden; width: 122px; height: 122px">
              <div class="u-transparent" style="width: 122px; height: 122px">
                <img :src="previews.url" :style="previews.img"/>
              </div>
            </div>
          </ACol>
        </ARow>

        <div class="test-button">
<!--          <label class="btn" for="uploads">upload</label>-->
<!--          <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg"-->
<!--                 @change="uploadImg($event, 1)">-->
          <AButton @click="startCrop" v-if="!crap" class="btn">开始</AButton>
          <AButton @click="stopCrop" v-else class="btn">停止</AButton>
          <AButton @click="clearCrop" class="btn">清除</AButton>
          <AButton @click="refreshCrop" class="btn">刷新</AButton>
          <AButton @click="changeScale(1)" class="btn">放大</AButton>
          <AButton @click="changeScale(-1)" class="btn">缩小</AButton>
          <AButton @click="rotateLeft" class="btn">左转</AButton>
          <AButton @click="rotateRight" class="btn">右转</AButton>
          <AButton @click="finish('base64')" class="btn">预览(base64)</AButton>
          <AButton @click="finish('blob')" class="btn">预览(blob)</AButton>
        </div>
      </div>
    </a-modal>
  </ARow>
</template>
<!--https://github.com/xyxiao001/vue-cropper-->
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
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper";

export default {
    name: "UserProfile",
    components: {
        SettingOutlined, EditOutlined, EllipsisOutlined, UserOutlined, VueCropper
        , PhoneFilled, MailFilled, DeploymentUnitOutlined, FieldTimeOutlined
    },
    computed: {
        ...mapGetters({
            user: 'sys/user'
        })
    },
    data() {
      return {
        show: true,
        fixed: true,
        fixedNumber: [16, 9],
        model: false,
        modelSrc: '',
        crap: false,
        previews: {},
        lists: [
          {
            img: 'https://avatars2.githubusercontent.com/u/15681693?s=460&v=4',
          },
        ],
      }
    },
    setup () {
        let avatar = ref(false);
        let fileList = ref([]);
        let visible = ref(false);
        let crap = ref(false);
        let option = reactive({
          img: 'https://avatars2.githubusercontent.com/u/15681693?s=460&v=4',
          size: 1,
          full: false,
          outputType: 'png',
          canMove: true,
          fixedBox: false,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 160,
          autoCropHeight: 150,
          centerBox: false,
          high: true,
          max: 99999,
        });
        return { avatar, fileList, visible, option, crap}
    },
    methods: {
      avatarClick() {
        this.visible = true;
      },
      startCrop() {
        // start
        this.crap = true;
        this.$refs.cropper.startCrop();
      },
      stopCrop() {
        //  stop
        this.crap = false;
        this.$refs.cropper.stopCrop();
      },
      clearCrop() {
        // clear
        this.$refs.cropper.clearCrop();
      },
      refreshCrop() {
        // clear
        this.$refs.cropper.refresh();
      },
      changeScale(num) {
        num = num || 1;
        this.$refs.cropper.changeScale(num);
      },
      rotateLeft() {
        this.$refs.cropper.rotateLeft();
      },
      rotateRight() {
        this.$refs.cropper.rotateRight();
      },
      finish(type) {
        // 输出
        // var test = window.open('about:blank')
        // test.document.body.innerHTML = '图片生成中..'
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            console.log(data);
            var img = window.URL.createObjectURL(data);
            this.model = true;
            this.modelSrc = img;
          });
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.model = true;
            this.modelSrc = data;
          });
        }
      },
      // 实时预览函数
      realTime(data) {
        debugger
        this.previews = data;
      },

      finish2(type) {
        this.$refs.cropper2.getCropData((data) => {
          this.model = true;
          this.modelSrc = data;
        });
      },
      finish3(type) {
        this.$refs.cropper3.getCropData((data) => {
          this.model = true;
          this.modelSrc = data;
        });
      },
      down(type) {
        // event.preventDefault()
        var aLink = document.createElement('a');
        aLink.download = 'demo';
        // 输出
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            this.downImg = window.URL.createObjectURL(data);
            aLink.href = window.URL.createObjectURL(data);
            aLink.click();
          });
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.downImg = data;
            aLink.href = data;
            aLink.click();
          });
        }
      },

      uploadImg(e, num) {
        //上传图片
        // this.option.img
        var file = e.target.files[0];
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
          return false;
        }
        var reader = new FileReader();
        reader.onload = (e) => {
          let data;
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]));
          } else {
            data = e.target.result;
          }
          if (num === 1) {
            this.option.img = data;
          } else if (num === 2) {
            this.example2.img = data;
          }
        };
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file);
      },
      imgLoad(msg) {
        console.log(msg);
      },
      cropMoving(data) {
        console.log(data, '截图框当前坐标');
      },
    }
}
</script>

<style scoped>
.u-user-profile {
  margin-left: unset!important;
  margin-right: unset!important;
}
.u-user-name {
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 0.1em;
}
.u-cropper {
  width: 100%;
  height: 280px
}
.u-cropper-item.cropper {
  width: 450px;
  height: 100%;
}
.u-cropper-item.preview {
  height: 100%;
  overflow: hidden;
  width: 122px;
  height: 122px;
}
.u-user-list {
  margin-top: 30px;
}
.u-transparent {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC)
}
</style>
