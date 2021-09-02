/**
 * 页级表单通用接口
 * @type {{data(): *, created(), methods: {}, mounted(), props: {}}}
 */
import moment from "moment";

export const MixPageForm = {
    props: {
        formGroup: {type: Array, default: () => { return [] }},
        formConfig: {type: Object, default: () => { return {} }}, // 配置项,
        actionMetas: {type: Object, default: () => { return {} }},
        formAliasMetas: {type: Array, default: () => []}
    },
    data () {
        return {
            title: '',
            oriModel: {},
            editModel: {},
            queryParams: {}, // 编辑动作参数
            saveMeta: null,
            operaMeta: {},
            basicFormRefs: [],
            loadingText: '',
            spinning: false,
            basicFormRef: null,
            fieldMetaMap: {},
            identifying: false // 读取详情数据http请求
        }
    },
    created () {
        this.saveMeta = this.actionMetas['Save'];
        this.fieldMetaMap = this.$page.editFieldMetaMap;
    },
    mounted () {
        this.formConfig.mountedFinished(this);
        this.$page.registerVueRef(this, 'form');
    },
    beforeDestroy() {
        this.destroyPageForm();
    },
    methods: {
        mountedFinished (formRef) {
            this.basicFormRefs.push(formRef);
            this.initEditModel(formRef);
        },
        initEditModel (formRef) {
            let actionMeta = this.$page.getStore("actionMeta");
            if(null == actionMeta) { // 默认情况使用新增操作的数据信息
                this.operaMeta = this.actionMetas['Add'] || {};
                this.$page.putStore("editModel", this.getOriModel())
            } else if (actionMeta.id == 'edit') {
                this.operaMeta = this.actionMetas['Edit'];

                this.title = this.formConfig.editTitle
                    ? this.formConfig.editTitle : this.operaMeta['label'];

                if (this.formConfig.editSource === 'local') { // 编辑数据来源于本地从缓存获取
                    formRef.setEditModel(this.getEditModel())
                } else { // 新增的数据从表单对象获取
                    if(!this.identifying) {
                        this.getDetail()
                    }
                }
            } else if(actionMeta.id == 'add') {
                this.operaMeta = this.actionMetas['Add'];

                this.title = this.formConfig.addTitle
                    ? this.formConfig.addTitle : this.operaMeta['label'];

                formRef.setEditModel(this.getEditModel())
            } else {

            }
        },
        groupView(group) {
            return group.view(this.editModel);
        },
        bind(fieldsValue) {
            this.basicFormRefs.forEach(ref=>ref.setFieldsValue(fieldsValue));
        },
        /**
         * 此方法必须在basicForm组件挂载完成之后调用
         * @returns {*}
         */
        getOriModel() {
            return this.$page.getOriModel();
        },
        getEditModel() {
            if(this.$utils.isNotBlank(this.editModel)) {
                return this.editModel;
            } else {
                return this.editModel = this.$page.getEditModel();
            }
        },
        setEditModel(editModel) {
            this.basicFormRefs.forEach(ref=>ref.setEditModel(editModel));
        },
        destroyPageForm() {
            this.editModel = {};
            this.identifying = false;
            this.$page.removePageStore();
            this.$router.push("/IvzSys/void");
            this.$page.registerVueRef(null, 'form');
        },
        resetForm() {
            let oriModel = this.getOriModel();
            this.basicFormRefs.forEach(ref=>ref.resetForm(oriModel))
        },
        getDetail () {
            if (!this.operaMeta) return this.$log.errorLog('缺失编辑元数据'
                , '新增编辑功能点：Edit', this.actionMetas);

            let params = {};
            this.identifying = true;
            let izField = this.$page.izField;
            let editModel = this.getEditModel();
            params[izField] = editModel[izField];

            this.operaMeta.callBack(params).then(resp => {
                this.spinning = true;
                this.loadingText = '正在获取数据详情...';
                let resolve = this.$utils.getPromiseResolve(resp);
                this.$http.get(this.operaMeta.url, {params: params}).then(data => {
                    this.editModel = data.detail;
                    if(!this.editModel) {
                        this.$log.warningLog("获取的详情数据为空", '请检查后台返回', data);
                    } else {
                        this.setEditModel(this.editModel)
                    }
                }).catch(reason => {
                    this.$msg.defaultFailNotify(resolve, reason, this, params)
                }).finally(() => { this.spinning = false })
            });
        },
        cancelHandle () {
            this.actionMetas.Cancel.callBack().then(()=>{
                this.$page.cancel();
            })
        },
        freshenHandle () {
            if (this.actionMetas.Add ==  this.operaMeta) { // 新增的重置按钮直接重置表单
                this.resetForm()
            } else { // 编辑的重置操作
                // 本地数据且不双向绑定则重新设置数据
                if (this.formConfig['editSource'] === 'local') {
                    this.editModel = this.$page.getEditModel();
                    this.setEditModel(this.editModel)
                } else if (this.formConfig['editSource'] === 'remote') { // 远程则重新获取数据
                    this.getDetail(this.queryParams)
                }
            }
        },
        validate() {
            let map = this.basicFormRefs.map(ref=>ref.validate());
            return Promise.all(map);
        },
        submitHandle () {
            if (!this.saveMeta) {
                return this.$log.errorLog('缺失Save元数据', '新增Save元数据', this.actionMetas)
            }
            this.validate().then(resp => {
                let editModel = this.editModel;
                this.saveMeta.callBack(editModel).then(resp => {
                    this.spinning = true;
                    this.loadingText = this.formConfig.submitTip;
                    let resolve = this.$utils.getPromiseResolve(resp);
                    this.$utils.formatDateForEditModel(this.$page.dateFieldMeta, editModel); // 提交之前先格式化日期
                    this.$http.post(this.operaMeta.url, editModel).then(data => {
                        this.$msg.submitSuccessNotify(resolve, data, this, editModel, () => {
                            this.$page.list() // 返回列表页
                        })
                    }).catch(reason => {
                        this.$msg.submitFailNotify(resolve, reason, this, editModel)
                    }).finally(() => { this.spinning = false })
                }).catch(reason => reason)
            })
        }
    }
};
