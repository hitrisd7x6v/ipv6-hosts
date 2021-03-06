/**
 * 系统全局常量配置
 */
export default {
    PageSize: 'size', // 分页条数字段
    PageCurrent: 'current', // 分页页数

    DefaultPID: 'pid',
    DefaultRowKey: 'id', // 整个系统的默认rowKey
    SuccessCode: 200, // 默认成功码
    ConfirmTitle: '操作提示', // 默认确认标题
    ConfirmContent: '确认要执行操作?', // 默认确认内容

    DelSuccessMsg: '删除记录成功', // 默认删除成功提示, 以后台返回的消息为准
    DelConfirmTitle: '删除提示', // 默认删除提示框标题
    DelConfirmContent: '确认删除选中的记录吗？', // 默认删除提示框内容

    DefaultConfirmTitle: '操作确认',
    DefaultConfirmContent: '确认提交此操作吗',

    DefaultExecSuccess: '执行成功',

    SubmitSuccessMsg: '数据提交成功', // 默认数据提交成功提示
    OtherOperaSuccessMsg: '操作成功', // 默认其他动作操作成功的提示

    PrimaryUid: 'Primary', // 主要视图标识(UViewDrawer、UViewModal、UTable、USearch)
    PrimaryEditRef: 'Primary:EditRef',
    PrimaryTableRef: 'Primary:TableRef',
    PrimaryDetailRef: 'Primary:DetailRef',
    PrimarySearchRef: 'Primary:SearchRef',

    DefaultEditUid: 'UVEdit',
    DefaultTableUid: 'UVTable',
    DefaultDetailUid: 'UVDetail',
    DefaultSearchUid: 'UVSearch',

    FormSpinResetTip: '数据重置中...',
    FormSpinSubmitTip: '数据提交中...',
    FormSpinLoadingTip: '数据加载中...',
    TableSpinLoadingTip: '数据加载中...',

    Options_LabelField: 'label',
    Options_ValueField: 'value',
    Options_ChildrenField: 'children',

    //<URow col='modal | drawer | search | {xs: 24, sm: 24, ...}'>
    TypeColConfig: {
        modal: {xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 8, xxxl: 8},
        drawer: {xs: 24, sm: 24, md: 12, lg: 12, xl: 8, xxl: 8, xxxl: 8},
        search: {xs: 24, sm: 24, md: 12, lg: 8, xl: 6, xxl: 4, xxxl: 4}
    },

    // 功能标识
    FuncNameMeta: {ADD: 'ADD', DEL: 'DEL', EDIT: 'EDIT', QUERY: 'QUERY', IMPORT: 'IMPORT', EXPORT: 'EXPORT'
        , CANCEL: 'CANCEL', RESET: 'RESET', EXPAND: 'EXPAND', SUBMIT: 'SUBMIT', DETAIL: 'DETAIL'
        , CONFIRM: 'CONFIRM', EXEC: 'EXEC'},

    FuncBtnTypeMaps: { // 功能按钮的默认配置
        ADD: {type: 'primary'},
        DEL: {type: 'primary', danger: true},
        EDIT: {type: '#3b5999'},
        QUERY: {type: 'primary'}, // 查询
        VIEW: {type: 'primary'}, // 查询 和query选其一
        IMPORT: {type: 'default'},
        EXPORT: {type: 'orange'},
        EXPAND: {type: 'primary', ghost: true},
        CANCEL: {type: 'default'},
        DETAIL: {type: '#87d068'},
        RESET: {type: 'primary', ghost: true},
        DEFAULT: {type: 'default'},
        SUBMIT: {type: 'primary'}
    },
    FuncTagColorMaps: { // 功能Tag默认颜色配置
        ADD: '#2db7f5',
        DEL: '#f50',
        EDIT: '#3b5999',
        QUERY: '#108ee9',
        IMPORT: 'default',
        EXPORT: 'orange',
        CANCEL: 'red',
        DETAIL: '#87d068',
        RESET: 'warning',
        DEF: 'default',
        SUBMIT: 'blue',
        VIEW: '#108ee9',
        CONFIRM: 'warning', // 弹框确认操作
        EXEC: 'processing', // 执行自定义http请求
    }

}