/**
 * 页级表单组件拆分出来的基础数据
 * @type {{data(): *, created(): void, props: {tableConfig: {type: ObjectConstructor, required: boolean}, data: {default: null, type: ArrayConstructor}}}}
 */

export const MixSplitForm = {
    data () {
        return {
            title: '',
            queryParams: {}, // 编辑动作参数
            saveMeta: null,
            operaMeta: null,
            loadingText: '',
            spinning: false,
            basicFormRef: null
        }
    },
    created () {
        this.saveMeta = this.actionMetas['Save']
        if(this.$route.path == '/IvzSys/edit') {
            this.queryParams = this.$route.query
            this.operaMeta = this.actionMetas.Edit
        } else {
            this.operaMeta = this.actionMetas.Add
        }
    },
    mounted () {
        this.formConfig.mountedFinished(this)
    },
    methods: {
        mountedFinished (formRef) {
            this.basicFormRef = formRef
            this.initEditModel()
        },
        initEditModel () {
            if (this.actionMetas.Edit ==  this.operaMeta) {
                this.title = this.formConfig.editTitle
                    ? this.formConfig.editTitle : this.operaMeta['label']

                if (this.formConfig.editSource === 'local') { // 编辑数据来源于本地从缓存获取
                    let editModel = this.$page.getStore('editModel')
                    this.basicFormRef.setEditModel(editModel)
                } else { // 新增的数据从表单对象获取
                    this.getDetail(this.queryParams)
                }
            } else {
                this.title = this.formConfig.addTitle
                    ? this.formConfig.addTitle : this.operaMeta['label']

                let addModel = this.basicFormRef.getOriFormModel()
                this.basicFormRef.setEditModel(addModel)
            }
        },
        getDetail (params) {
            if (!this.operaMeta) return this.$log.errorLog('缺失编辑元数据', '新增编辑功能点：Edit', this.actionMetas)

            this.operaMeta.callBack(params).then(resp => {
                this.spinning = true
                this.loadingText = '正在获取数据详情...'
                let resolve = this.$utils.getPromiseResolve(resp)
                this.$http.get(this.operaMeta.url, {params: params}).then(data => {
                    this.basicFormRef.setEditModel(data.detail)
                    this.$msg.defaultSuccessNotify(resolve, data, this, params)
                }).catch(reason => {
                    this.$msg.defaultFailNotify(resolve, reason, this, params)
                }).finally(() => { this.spinning = false })
            })
        },
        cancelHandle () {
            this.actionMetas.Cancel.callBack().then(()=>{
                this.$router.push('/IvzSys/cancel')
            })
        },
        freshenHandle () {
            if (this.actionMetas.Add ==  this.operaMeta) { // 新增的重置按钮直接重置表单
                this.basicFormRef.resetForm()
            } else { // 编辑的重置操作
                // 本地数据且不双向绑定则重新设置数据
                if (this.formConfig['editSource'] === 'local') {
                    let editModel = this.$page.getStore('editModel')
                    this.basicFormRef.setEditModel(editModel)
                } else if (this.formConfig['editSource'] === 'remote') { // 远程则重新获取数据
                    this.getDetail(this.$route.queryParams)
                }
            }
        },
        submitHandle () {
            if (!this.saveMeta) {
                return this.$log.errorLog('缺失Save元数据', '新增Save元数据', this.actionMetas)
            }
            this.basicFormRef.validate().then(resp => {
                let editModel = this.basicFormRef.getEditModel()
                this.saveMeta.callBack(editModel).then(resp => {
                    this.spinning = true
                    this.loadingText = this.formConfig.submitTip
                    let resolve = this.$utils.getPromiseResolve(resp)
                    this.$http.post(this.operaMeta.url, editModel).then(data => {
                        this.$msg.submitSuccessNotify(resolve, data, this, editModel, () => {
                            this.$router.push('/IvzSys/list'); // 返回列表页
                        })
                    }).catch(reason => {
                        this.$msg.submitFailNotify(resolve, reason, this, editModel)
                    }).finally(() => { this.spinning = false })
                }).catch(reason => reason)
            })
        }
    }
}
