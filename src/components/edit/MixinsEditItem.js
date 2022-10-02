import {defineComponent} from "vue";

export default defineComponent({

    methods: {
        // 表单组件是否初始化
        isInitForm() {
            return this.formRef != null
        },

        switchActive(visible) {
            this.visible = visible;
        },

        switchSpinning(spinning) {
            this.spinning = spinning;
        },

        /**
         * 打开编辑组件并且等待表单挂载完成
         */
        openEditAtFormInit() {
            this.visible = true;
            return new Promise((resolve, reject) => {
                if(this.formRef) {
                    resolve(this.getEditContext())
                } else {
                    this.$nextTick().then(() =>{
                        if(!this.formRef) {
                            this.$nextTick().then(() => {
                                this.formRef = this.$refs['iemFormRef'];
                                resolve(this.getEditContext())
                            }).catch(reason => reject(reason))
                        } else {
                            this.formRef = this.$refs['iemFormRef'];
                            resolve(this.getEditContext())
                        }
                    }).catch(reason => reject(reason))
                }
            })
        },

        toggleActive() {
            this.visible = !this.visible;
        },

        getEditModel() {
            // 再次从$refs获取, 防止未初始化或者延迟
            return this.$refs['iemFormRef'].getEditModel();
        },

        getEditContext() {
            // 可能出现获取的时候form还未初始化, 自行判断
            if(this.formRef) {
                return this.formRef.getFormContext();
            }

            return null;
        }
    }
})
