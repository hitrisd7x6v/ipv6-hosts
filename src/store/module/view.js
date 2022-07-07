/*视图组件相关的数据存储*/
import {FunMetaMaps} from "@/utils/SysUtils";

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
// 解析视图菜单下面的功能点
function resolverFunMetas(menu) {
    let children = menu.children;
    let searchFunMetas= [], tableFunMetas = [], editFunMetas = [];
    if(children) {
        let saveMeta = {field: FunMetaMaps.Submit, name: '提交', type: 'primary'
            , addUrl: null, editUrl: null, sort: 10, view};
        children.forEach(item => {
            if(item.type != 'A') {
                return console.log(`错误的功能点[${item.name}][${item.type} != 'A']`)
            }

            let {position, permType, type, url, name, sort} = item;
            let meta = {field: permType, name, url, sort, view};

            // 需要保存按钮
            if(meta.field == FunMetaMaps.Add) {
                saveMeta.addUrl = meta.url
            } else if(meta.field == FunMetaMaps.Edit) {
                saveMeta.editUrl = meta.url;
            }

            if(position == 'AM') {
                tableFunMetas.push(meta);
                searchFunMetas.push(meta);
            } else if(position == 'M') {
                searchFunMetas.push(meta);
            } else if(position == 'T') {
                tableFunMetas.push(meta);
            } else {
                console.log(`错误的功能点position[${position}], 取值[M, T, AM]`)
            }
        })
        if(saveMeta.editUrl || saveMeta.addUrl) {
            let cancelMeta = {field: FunMetaMaps.Cancel, name: '取消', sort: 20, view}

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

                state.pageViewInfoMaps[viewMenu['url']] = {
                    viewMenu, // 当前视图的菜单信息
                    config: {}, // 当前视图的配置信息
                    editFunMetas, // 编辑功能按钮
                    tableFunMetas, // 表格功能按钮
                    searchFunMetas, // 搜索栏功能按钮
                    selectedRows: unMounded, // 当前视图选中的行信息(function)

                    editModel: unMounded, // 获取编辑视图组件数据
                    editFormContext: unMounded, // 获取编辑表单上下文
                    editSwitchActive: unMounded, // 当前视图编辑组件的激活状态
                    editLoadingActive: unMounded,

                    searchModel: unMounded, // 获取搜索视图组件数据
                    searchFormContext: unMounded, // 获取搜索表单上下文
                }
            },

            setEditViewContext: (state, {url, formContext
                , model, loadingActive, switchActive}) => {
                let pageViewInfo = state.pageViewInfoMaps[url];

                pageViewInfo.editModel = model;
                pageViewInfo.editFormContext = formContext;
                pageViewInfo.editSwitchActive = switchActive;
                pageViewInfo.editLoadingActive = loadingActive;
            },

            setSearchViewContext: (state, {url, formContext, model}) => {
                let pageViewInfo = state.pageViewInfoMaps[url];

                pageViewInfo.searchModel = model;
                pageViewInfo.searchFormContext = formContext;
            },

            setTableViewContext: (state, {url, selectedRows}) => {
                let pageViewInfo = state.pageViewInfoMaps[url];

                pageViewInfo.selectedRows = selectedRows;
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
