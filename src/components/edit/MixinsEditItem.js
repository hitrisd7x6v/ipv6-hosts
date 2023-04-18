import {defineComponent} from "vue";

export default defineComponent({
    created() {
        let editContext = this.getEditContext();
        editContext.setVisible = this.setVisible;
        editContext.setLoading = this.setLoading;
        editContext.asyncVisible = this.openByAsync;
        editContext.setLoadingTip = this.setLoadingTip;
        editContext.getFormContext = this.getFormContext;
    },
    unmounted() {

    },
    mounted() {
        this.formRef = this.$refs['iemFormRef'];
    },
    methods: {
        // 表单组件是否初始化
        isInitForm() {
            return this.formRef != null
        },

        setVisible(visible) {
            this.visible = visible;
        },

        setLoading(status) {
            this.spinning = status;
        },

        setLoadingTip(tip) {
            this.spinTip = tip;
        },

        switchActive(visible) {
            this.visible = visible;
            this.initFormRef();
        },

        switchSpinning(spinning) {
            this.spinning = spinning;
        },

        /**
         * 异步打开弹框, 表单初始化完成后会出发编辑事件
         * @param row 编辑的行 非必填
         * @param isResetToInit {Boolean} 是否重置编辑模型 非必填
         * @return {Promise<unknown>}
         */
        openByAsync(row, isResetToInit) {
            this.visible = true;
            return new Promise((resolve, reject) => {
                if(this.formRef) {
                    if(isResetToInit) {
                        // 重置到初始化时的数据
                        this.getFormContext().resetModel();
                    }

                    let editModel = this.getEditModel();
                    this.$emit("edit", editModel, row)
                    return resolve(editModel);
                }

                this.$nextTick().then(() => {
                    this.formRef = this.$refs['iemFormRef']
                    if(!this.formRef) {
                        this.$nextTick().then(() => {
                            let editModel = this.getEditModel();
                            this.$emit("edit", editModel, row)
                            resolve(editModel);
                        })
                    } else {
                        let editModel = this.getEditModel();
                        this.$emit("edit", editModel, row)
                        resolve(editModel);
                    }
                })
            })
        },

        getEditModel() {
            // 再次从$refs获取, 防止未初始化或者延迟
            if(this.$refs['iemFormRef']) {
                return this.$refs['iemFormRef'].getEditModel();
            } else {
                return null;
            }
        },

        /**
         * @returns {FormContext|null}
         */
        getFormContext() {
            // 可能出现获取的时候form还未初始化, 自行判断
            if(this.formRef) {
                return this.formRef.getFormContext();
            }

            return null;
        },

        getEditContext() {
            return this.editContext;
        },

        initFormRef() {
            if(this.visible && !this.formRef) {
                this.$nextTick().then(() => {
                    this.formRef = this.$refs['iemFormRef']
                    if(!this.formRef) {
                        this.$nextTick().then(() => {
                            this.formRef = this.$refs['iemFormRef']
                        })
                    }
                })
            }
        }
    }
})
