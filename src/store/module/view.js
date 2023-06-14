/*视图组件相关的数据存储*/
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
            setEditViewContext: (state, {url, formContext, openEditView
                , model, loadingActive, switchActive, switchSpinning}) => {
                let pageViewInfo = state.pageViewInfoMaps[url];

                pageViewInfo.editModel = model;
                pageViewInfo.openEditView = openEditView;
                pageViewInfo.editFormContext = formContext;
                pageViewInfo.switchEditView = switchActive;
                pageViewInfo.editLoadingActive = loadingActive;
                pageViewInfo.editSwitchSpinning = switchSpinning;
            },

            setSearchViewContext: (state, {url, formContext, model}) => {
                let pageViewInfo = state.pageViewInfoMaps[url];

                pageViewInfo.searchModel = model;
                pageViewInfo.searchFormContext = formContext;
            },

            setTableViewContext: (state, {url, selectedRows
                , selectedKeys, loadingTableData, dataSource, expanded}) => {
                let pageViewInfo = state.pageViewInfoMaps[url];

                pageViewInfo.expanded = expanded;
                pageViewInfo.dataSource = dataSource;
                pageViewInfo.selectedRows = selectedRows;
                pageViewInfo.selectedKeys = selectedKeys;
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
