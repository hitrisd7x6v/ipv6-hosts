import EditMetas from "@/components/online/EditMetas";
import PreviewView from "@/components/online/preview.data";
import PreviewUtils from "@/utils/preview.utils";

export const MixinViewConfig = {
    props: ['metas', 'global', 'view'],
    data() {
        return {
            model: {},
            modalMetas: [],
            viewConfig: {},
            modalConfigs: [],
            options: {
                type: 'container',
                ghostClass: 'ghost',
                // forceFallback: true,
                chosenClass: 'active',
                dragClass: 'drag-handle'
            }
        }
    },
    created() {
        this.activeHandle();
        this.modalMetas = this.global.modalMetas;
        this.global.publisherEvent('viewCreate', this);
    },
    methods: {
        onMove(evt) {
            let form = evt['draggedContext']['element'];
            let to = evt['relatedContext']['component'];

            let options = to['options'];
            if(form.type == 'group') { // 组不能拖拽到组

                if(options.type == 'group') return false;
            } else { // 项拖拽到组
                if(options.type == 'group') {

                }
            }
        },
        activeHandle() {
            this.global.active = this.view.id;
            this.model = EditMetas.IvzViewModel;

            this.global.editModel = this.model;
            this.global.editMetas = EditMetas[this.view.type];

            if(this.$refs['viewModelRef'])
                this.$refs['viewModelRef'].validate();
        },
        onAddHandle(e) {
            if(this.metas) {
                this.metas.forEach((meta, index) => {
                    if(meta.type == 'modal') {
                        this.modalMetas.push(meta);
                        this.metas.splice(index, 1);
                        this.global.modalMetas = this.modalMetas;
                    }
                });
            }
        },
        columnHandle(val) {
            this.model.column=val;
            this.global.span = 24 / val;
        },
        formColHandle(val) {
            if(val[0] + val[1] > 24) return;
            this.model.labelCol = {span: val[0]};
            this.model.wrapperCol = {span: val[1]};
        },
        delMetaItem(meta) {
            this.activeHandle();
            this.global.delItem(meta);
        },
        removeModalHandle(meta) {
            this.modalMetas.forEach((item, index) => {
                if(item == meta) {
                    let model = item.model;
                    this.modalMetas.splice(index, 1);
                    this.global.modalMetas = this.modalMetas;
                    this.$page.delActionMeta(model['permId']);
                }
            })
        },
        handleSearchMetas(editMeta, searchMetas) {
            if(!editMeta.isSearch) return;

            let dict=editMeta['dict'], url = editMeta['url'], data = editMeta['data'];
            let meta = {
                type: editMeta.type,
                field: editMeta.field,
                title: editMeta.title,
                config: {}
            };

            if(url) meta['url'] = url;
            if(data) meta['data'] = data;
            if(dict) meta['dict'] = dict;
            searchMetas.push(meta);
        },
        viewPreview(type) {
            this.viewConfig = this.resolverViewConfig();
            this.viewConfig.htmlCode = this.resolverPageTemplate();
            this.viewConfig.sqlScript = EditMetas.resolverSqlScript(this.metas, this.model);

            this.$refs['previewRef'].open(type, this.viewConfig);
        },
        getPageConfig() {
            return {
                form: {
                    layout: this.model.layout,
                    column: this.model.column,
                    addTitle: this.model.addTitle,
                    editTitle: this.model.editTitle,
                    labelCol: this.model['labelCol'],
                    wrapperCol: this.model['wrapperCol']
                },
                table: {
                    rowKey: this.model['keyField']
                },
                detail: {},
                search: {}
            }
        },
        resolverViewConfig() {
            let viewConfig = {
                metas: [], searchMetas: [],
                config: this.getPageConfig(),
                data: [],
                htmlCode: null,
                sqlScript: null,
                view: this.model
            };
            let vue = this;
            let model = this.model;
            function doResolverItems(metas, viewMetas) {
                metas.forEach(meta => {
                    if(meta.type == 'modal') return;

                    if(meta.type == 'group') {
                        let groupMetas = EditMetas.resolverGroupToMeta(meta.model, vue.global);

                        viewMetas.push(groupMetas);
                        doResolverItems(meta.children, groupMetas.metas || groupMetas.children);
                    } else {
                        let viewMeta = EditMetas.resolverItemToMeta(meta.model, vue.global);
                        viewMetas.push(viewMeta);

                        if(meta.model.isSearch) {
                            let searchMeta = EditMetas.resolverCommonItemToMeta(meta.model, vue.global);
                            viewConfig.searchMetas.push(searchMeta);
                        }

                        viewMeta['labelCol'] = model.labelCol;
                        viewMeta['wrapperCol'] = model.wrapperCol;

                    }
                });

                return viewConfig;
            }

            // 解析模态框配置
            this.handleModalConfig();
            // 处理表格配置
            this.handleTableConfig(viewConfig.config.table, this.model);

            // 解析元数据
            doResolverItems(this.metas, viewConfig.metas);
            viewConfig.metas.push({title: '操作', field: 'action', type: 'action'}); // 增加操作元数据

            // 创建需要模拟的数据
            PreviewView.createMockData(this.metas, this.model);
            return viewConfig;
        },
        // 解析模态框配置
        handleModalConfig() {
            let modalConfig = [];
            let modalItemRefs = this.$refs['modalItem'];
            if(modalItemRefs && modalItemRefs.length >0) {
                modalItemRefs.forEach(modalItem => {
                    let resolverModalConfig = modalItem.resolverModalConfig();
                    modalConfig.push(resolverModalConfig);

                    let modalMeta = modalItem.meta;
                    let modalModel = modalItem.model;

                    let vue = this;
                    this.$page.addActionMeta(modalModel['permId']
                        , {label: modalModel.permTitle, position: modalModel.position
                            , callBack: (model) => {
                                return new Promise(() => {
                                    let id = modalMeta.id;
                                    let modalFormRef = vue.$refs[id][0];
                                    modalFormRef.open(model);
                                })
                            }
                        });
                })
            }
            this.modalConfigs = modalConfig;
        },
        handleTableConfig(config, model) { // 处理表格配置
            if(model['selection'] != 'none') {
                this.$set(config, 'selection', {
                    type: model['selection']
                });
            }
            config['bordered'] = model['isBorder'];
            config['fixedHeight'] = model['fixedHeight'];
            if(model['isPage']) config['pagination'] = {}
        },
        resolverModalTemplates() {
            let modalTemplates = '';
            let modalItemRefs = this.$refs['modalItem'];
            if(modalItemRefs && modalItemRefs.length >0) {
                modalItemRefs.forEach(modalItem => {
                    modalTemplates += modalItem.resolverHtmlTemplate() + '\r\n\t\t\t';
                })
            }
            return modalTemplates;
        },
        resolverModalConfig() {
            let pageConfig = {};
            let modalItemRefs = this.$refs['modalItem'];
            if(modalItemRefs && modalItemRefs.length >0) {
                modalItemRefs.forEach(modalItem => {
                    let permId = modalItem.getPermId();

                    // 获取功能模态框配置
                    let config = modalItem.resolverJavaScript();

                    // 权限标识作为对象key
                    pageConfig[permId] = config;
                })
            }

            return pageConfig;
        }
    }
}
