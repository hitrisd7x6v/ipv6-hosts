/*视图组件相关的数据存储*/
import {FunMetaMaps, getMetaConfig} from "@/utils/SysUtils";
import {clone} from "@/utils/MetaUtils";

/**
 *  此按钮的状态
 * @param editModel 当前编辑的数据
 * @param meta
 * @return false(不显示) | true(显示)
 */
function view(editModel, meta) {
    return true
}

function unMounded() {
    console.warn('获取数据失败, 组件还未挂载完成');
}
function unMoundedEdit() {
    console.warn('组件未挂载完成或者缺少编辑视图组件 IvzViewModal, IvzViewDrawer等');
}
// 解析视图菜单下面的功能点
function resolverFunMetas(menu) {
    let searchFunMetas= [], tableFunMetas = [], editFunMetas = [];
    if(!menu) {
        console.warn(`不能解析功能点, 菜单信息为[null], 将不包含任何功能`)
        return {searchFunMetas, tableFunMetas, editFunMetas}
    }

    let children = menu.children;
    if(children) {
        let props = getMetaConfig(FunMetaMaps.Submit);
        let saveMeta = {field: FunMetaMaps.Submit, name: '提交'
            , addUrl: null, editUrl: null, sort: 30, view, props};
        children.forEach(item => {
            if(item.type != 'A') {
                return console.log(`错误的功能点[${item.name}][${item.type} != 'A']`)
            }

            let {position, permType, type, url, name, sort} = item;
            let props = getMetaConfig(permType);
            let meta = {field: permType, name, url, sort, view, props};

            // 需要保存按钮
            if(meta.field == FunMetaMaps.Add) {
                saveMeta.addUrl = meta.url
            } else if(meta.field == FunMetaMaps.Edit) {
                saveMeta.editUrl = meta.url;
            }

            if(position == 'AM') {
                tableFunMetas.push(meta);
                searchFunMetas.push(clone(meta));
            } else if(position == 'M') {
                searchFunMetas.push(meta);
            } else if(position == 'T') {
                tableFunMetas.push(meta);
            } else {
                console.log(`错误的功能点position[${position}], 取值[M, T, AM]`)
            }
        })

        if(saveMeta.editUrl || saveMeta.addUrl) {
            let props = getMetaConfig(FunMetaMaps.Cancel);
            let cancelMeta = {field: FunMetaMaps.Cancel, name: '取消', sort: 50, view, props}

            editFunMetas.push(cancelMeta)
            editFunMetas.push(saveMeta);
        }
    }

    return {searchFunMetas, tableFunMetas, editFunMetas}
}

export default function registerViewModule(store) {
    store.registerModule('view', {
        namespaced: true,
        state: {
            pageViewInfoMaps: {/*url -> config */}, // 页级视图配置信息
        },
        getters: {
            // 页视图信息
            pageViewData: state => (url) => state.pageViewInfoMaps[url],
            editModel: state => url => state.pageViewInfoMaps[url].editModel(),
            editActive: state => url => state.pageViewInfoMaps[url].editActive,
            searchModel: state => url => state.pageViewInfoMaps[url].searchModel(),
            selectedRows: state => url => state.pageViewInfoMaps[url].selectedRows(),
            editFunMetas: state => (url) => state.pageViewInfoMaps[url].editFunMetas,
            tableFunMetas: state => url => state.pageViewInfoMaps[url].tableFunMetas,
            searchFunMetas: state => url => state.pageViewInfoMaps[url].searchFunMetas
        },
        mutations: {
            registerPageView: (state, viewMenu) => {
                let {searchFunMetas, tableFunMetas, editFunMetas} = resolverFunMetas(viewMenu);

                let viewInfo = {
                    viewMenu, // 当前视图的菜单信息
                    config: {}, // 当前视图的配置信息
                    editFunMetas, // 编辑功能按钮
                    tableFunMetas, // 表格功能按钮
                    searchFunMetas, // 搜索栏功能按钮
                    selectedRows: unMounded, // 当前视图选中的行信息(function)
                    loadingTableData: unMounded, // 加载表数据源

                    editModel: unMoundedEdit, // 获取编辑视图组件数据
                    editFormContext: unMoundedEdit, // 获取编辑表单上下文
                    editSwitchActive: unMoundedEdit, // 当前视图编辑组件的激活状态
                    editLoadingActive: unMoundedEdit,
                    editSwitchSpinning: unMoundedEdit, // 切换提交状态

                    searchModel: unMounded, // 获取搜索视图组件数据
                    searchFormContext: unMounded, // 获取搜索表单上下文

                    getEditFunMeta: (field) => editFunMetas.find(item => item.field == field),
                    getTableFunMeta: (field) => tableFunMetas.find(item => item.field == field),
                    getSearchFunMeta: (field) => searchFunMetas.find(item => item.field == field)
                }

                viewInfo['getEditFunMeta'] = (field) => viewInfo.editFunMetas.find(item => item.field == field)
                viewInfo['getTableFunMeta'] = (field) => viewInfo.tableFunMetas.find(item => item.field == field)
                viewInfo['getSearchFunMeta'] = (field) => viewInfo.searchFunMetas.find(item => item.field == field)

                state.pageViewInfoMaps[viewMenu['url']] = viewInfo;
            },

            setEditViewContext: (state, {url, formContext
                , model, loadingActive, switchActive, switchSpinning}) => {
                let pageViewInfo = state.pageViewInfoMaps[url];

                pageViewInfo.editModel = model;
                pageViewInfo.editFormContext = formContext;
                pageViewInfo.editSwitchActive = switchActive;
                pageViewInfo.editLoadingActive = loadingActive;
                pageViewInfo.editSwitchSpinning = switchSpinning;
            },

            setSearchViewContext: (state, {url, formContext, model}) => {
                let pageViewInfo = state.pageViewInfoMaps[url];

                pageViewInfo.searchModel = model;
                pageViewInfo.searchFormContext = formContext;
            },

            setTableViewContext: (state, {url, selectedRows, loadingTableData}) => {
                let pageViewInfo = state.pageViewInfoMaps[url];

                pageViewInfo.selectedRows = selectedRows;
                pageViewInfo.loadingTableData = loadingTableData;
            },

            // 移除页视图数据, 在页视图组件卸载的时候调用
            removePageViewData: (state, viewMenu) => {
              delete state.pageViewInfoMaps[viewMenu.url]
            },

            switchEditVisibleTo: (state, {visible, url}) => {
                let viewInfo = state.pageViewInfoMaps[url];
                if(visible === undefined) {
                    viewInfo.editActive = !viewInfo.editActive;
                } else {
                    viewInfo.editActive = visible;
                }
            }
        }
    })
}
