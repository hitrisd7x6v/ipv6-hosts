import {defineComponent} from "vue";

export default defineComponent({
    created() {
        let editContext = this.getEditContext();
        editContext.setVisible = this.setVisible;
        editContext.setLoading = this.setLoading;
        editContext.asyncVisible = this.openByAsync;
        editContext.getFormContext = this.getFormContext;
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

        switchActive(visible) {
            this.visible = visible;
            this.initFormRef();
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

        /**
         * 异步打开弹框
         * @return {Promise<unknown>}
         */
        openByAsync() {
            this.visible = true;
            return new Promise((resolve, reject) => {
                if(this.formRef) {
                    return resolve(this.getEditModel());
                }

                this.$nextTick().then(() => {
                    this.formRef = this.$refs['iemFormRef']
                    if(!this.formRef) {
                        this.$nextTick().then(() => {
                            this.formRef = this.$refs['iemFormRef']
                            resolve(this.getEditModel());
                        })
                    } else {
                        resolve(this.getEditModel());
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
