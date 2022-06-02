import Utils from "@/utils/basic.utils";
import PreviewData from "./preview.data";

let isAuto = [
    {label: 'int', value: 'int'},
    {label: 'bigint', value: 'bigint'},
    {label: 'uuid', value: 'uuid'},
];
let ParentMenus = PreviewData.getParentMenus();

let AllFieldType = [
    {label: 'char', value: 'CHAR'},
    {label: 'varchar', value: 'VARCHAR'},
    {label: 'int', value: 'INT'},
    {label: 'bigint', value: 'BIGINT'},
    {label: 'decimal', value: 'DECIMAL'},
    {label: 'date', value: 'DATE'},
    {label: 'time', value: 'TIME'},
    {label: 'datetime', value: 'DATETIME'},
    {label: 'timestamp', value: 'TIMESTAMP'},
    {label: 'float', value: 'FLOAT'},
    {label: 'double', value: 'DOUBLE'},
    {label: 'enum', value: 'ENUM'},
    {label: 'text', value: 'TEXT'},
    {label: 'mediumtext', value: 'MEDIUMTEXT'},
];
// 'horizontal'|'vertical'|'inline'
let ViewLayout = [
    // {label: 'inline', value: 'inline'},
    {label: 'vertical', value: 'vertical'},
    {label: 'horizontal', value: 'horizontal'},
];
let Placement = [
    {label: '左', value: 'right'},
    {label: '上', value: 'top'},
];
let tableView = [
    {label: '分页', value: 'pagination'},
    {label: '边框', value: 'bordered'},
    {label: '固定高度', value: 'fixedHeight'},
];
let FormOther = [
    {label: '必填', value: 'required'},
    {label: '清空', value: 'clear'},
    {label: '禁用', value: 'disabled'},
];
let FieldView = [
    {label: '搜索栏', value: 'search'},
    {label: '编辑页', value: 'form'},
    {label: '列表页', value: 'table'},
    {label: '详情页', value: 'detail'},
];
let KeyType = [
    {label: 'int', value: 'int'},
    {label: 'bigint', value: 'bigint'},
    {label: 'varchar', value: 'varchar'},
];
let OtherType = [
    {label: '唯一', value: 'unique'},
    {label: '索引', value: 'index'},
];
let Primary = [
    {label: 'null', value: 'unique'},
    {label: '自增', value: 'auto'},
    {label: '唯一', value: 'unique'},
];
let Selection = [
    {label: '无', value: 'none'},
    {label: '单选', value: 'radio'},
    {label: '多选', value: 'checkbox'},
];
let Position = [
    {label: '表栏', value: 'T'},
    {label: 'TM', value: 'TM'},
    {label: '主栏', value: 'M'},
    {label: 'MM', value: 'MM'},
    {label: 'AM', value: 'AM'},
];
let LabelAlign = [
    {label: '左对齐', value: 'left'},
    {label: '右对齐', value: 'right'}
];
let BooleanOptions = [
    {label: '是', value: true},
    {label: '否', value: false}
];
let ModeOptions = [
    {label: '默认', value: 'default'},
    {label: '多选', value: 'multiple'},
    {label: '标签', value: 'tags'}
];
let DateOptions= [
    {label: '日期', value: 'date'},
    {label: '时间', value: 'time'},
    {label: '月', value: 'month'},
    {label: '年', value: 'year'},
];
let DateOperaOptions = [
    {label: '时间', value: 'showTime'},
    {label: '今天', value: 'showToday'},
];
let TextValidate = [
    {label: '手机', value: 'phone'},
    {label: '邮箱', value: 'email'},
    {label: '日期', value: 'date'},
    {label: '范围', value: 'range'},
    {label: 'Url', value: 'Url'},
    {label: 'Ip', value: 'ip'},
    {label: '长度', value: 'len'},
    {label: '身份证', value: 'idCard'},
    {label: '银行卡', value: 'bank'},
    {label: '正则表达式', value: 'regexp'},
    {label: '字母', value: 'word'},
    {label: '汉字', value: 'chinese'},
    {label: '自定义', value: 'cus'},
];
let ItemRequiredMetas = [
    {field: 'name', title: '字段名', type: 'text'},
    {field: 'label', title: '字段标题', type: 'text'},
    {field: 'fieldType', title: '字段类型', type: 'text'},
];
let OperaMetas = [
    {field: 'otherForm', title: '操作属性', type: 'checkbox', data: FormOther
        , change: (val, meta, model)=>{
            model['clear'] = val.includes('clear') || false;
            model['disabled'] = val.includes('disabled') || false;
            if(val.includes('required')) {
                model.required = true;
                model.rules.push({required: true, message: '必填'});
            } else {
                model.required = false;
                model.rules.push({required: false});
            }
        }
    },
    {title: '校验', field: 'validate', type: 'validate', data: TextValidate}
];
let TableMetas = [
    {field: 'name', title: '字段名', type: 'text', rules: [{required: true, message: '字段名必填'}], placeholder: '表字段名（user_name）'},
    {field: 'label', title: '字段标题', type: 'text', rules: [{required: true, message: '字段标题必填'}], placeholder: '字段标题（用户名）'
        , change: (val, meta, model)=>{
            model['comment'] = val;
        }
    },
    {field: 'fieldType', title: '字段类型', type: 'fieldType', data: AllFieldType
        , lengthField: 'typeLength', lengthDisabled: false, rules: [{required: true, message: '字段类型必填'}]
        , change: (val, meta, model)=>{

        }},
    {field: 'otherType', title: '字段配置', type: 'checkbox', data: OtherType
        , change: (val, meta, model)=>{
            if(val.includes('unique')) {
                model['unique'] = true;
            } else {
                model['unique'] = false;
            }
            if(val.includes('index')) {
                model['index'] = true;
            } else {
                model['index'] = false;
            }
        }},
    {field: 'fieldView', title: '字段显示', type: 'checkbox', data: FieldView
        , change: (val, meta, model)=>{
            model['isForm'] = val.includes('form');
            model['isTable'] = val.includes('table');
            model['isDetail'] = val.includes('detail');
            model['isSearch'] = val.includes('search');
        }},
];
let TableModel = {
    name: '',
    label: '',
    width: null,
    isForm: true,
    isTable: true,
    isDetail: true,
    isSearch: false,
    comment: '',
    index: false,
    unique: false,
    required: false,
    otherType: [],
    typeLength: '',
    fieldView: ['form', 'table', 'detail'],
    // required: false,
};
let FormMetas = [
    {title: '字段名', field: 'name', type: 'text', rules: [{required: true, message: '字段名必填'}]},
    {title: '字段标题', field: 'label', type: 'text', rules: [{required: true, message: '字段标题必填'}]},
];
let FormModel = {
    name: '',
    label: '',
    rules: [],
    span: 0,
    extra: '',
    clear: false,
    validate: null,
    disabled: false,
    readonly: false,
    labelCol: null,
    placeholder: '',
    wrapperCol: null,
    validateValue: '',
    otherForm: ['clear'],
};
let OptionsMetas = [
    {title: '数据源', field: 'dataType', type: 'options'},
];
let OptionsModel = {
    options: [],
    dictValue: [],
    urlValue: null,
    dataType: 'cus',
    valueField: 'value',
    labelField: 'label',
}
let OtherMetas = [
    {field: 'width', title: '表格列宽', type: 'number', step: 1, placeholder: '表格当前列占的宽度'},
    {field: 'placeholder', title: '占位内容', type: 'text', placeholder: '表单说明（请输入用户名）'},
    {field: 'extra', title: 'extra', type: 'text', placeholder: 'antdv表单的extra属性'},
    {title: '列占比', field: 'span', type: 'slider', change: (val, meta, model) => {
            model.span = val;
        }, min: 0, max: 24, step: 1, marks: {0: '0', 6: '6', 12: '12', 18: '18', 24: '24'}},
    {title: '列布局', field: 'formCol', type: 'slider', change: (val, meta, model) => {
            if(val[0] + val[1] > 24) return;
            model.labelCol = val[0] ? {span: val[0]} : null;
            model.wrapperCol = val[1] ? {span: val[1]} : null;
        }, range: true, min: 0, max: 24, step: 1, marks: {0: '0', 6: '标签', 12: '12', 18: '表单', 24: '24'}},
];
let DrawerMetas = [
    {title: '抽屉方向', type: 'radio', field: 'placement', data: Placement
        , change: (val, meta, model)=> {
            if(val == 'right') model.drawerRate = 360;
            else model.drawerRate = 280;
        }},
    {title: '展示遮罩', type: 'radio', field: 'mask', data: BooleanOptions},
    {title: '蒙层关闭', type: 'radio', field: 'maskClosable', data: BooleanOptions},
];
let DrawerModel = {
    mask: true,
    drawerRate: 420,
    maskClosable: true,
    placement: 'right',
};
let Perms = [
    {label: '新增', value: 'Add'},
    {label: '删除', value: 'Del'},
    {label: '修改', value: 'Edit'},
    {label: '查询', value: 'View'},
    {label: '导入', value: 'Import'},
    {label: '导出', value: 'Export'},
    {label: '查看详情', value: 'Detail'},
];
// 下划线转换驼峰
function toHump(name) {
    if(!name) return '';
    return name.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}
// 驼峰转换下划线
function toLine(name) {
    if(!name) return '';
    return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}
let DataMock = {};
export default {
    IvzBasicView: [
        {title: '数据表配置', field: 'tableConfig', metas: [
                {field: 'tableName', title: '表名', type: 'text', rules: [{required: true, message: '表名必填'}], placeholder: '数据库表名（t_user）'},
                {field: 'comment', title: '表说明', type: 'text', change: (val, meta, model)=>{
                        model.addTitle = "新增"+val;
                        model.editTitle = "修改"+val;
                    }, placeholder: '数据库表说明（会员表）'},
                {field: 'menuId', title: '父菜单', type: 'treeSelect', data: ParentMenus},
                {field: 'keyField', title: '主键字段', type: 'text', rules: [{required: true, message: '主键字段必填'}]},
                {field: 'keyType', title: '主键自增', type: 'radio', data: isAuto, radioStyle: 'button'},
            ]},
        // {title: '视图配置', field: 'formConfig', metas: [
        //
        //         // {field: 'align', title: '标签对齐', type: 'radio', data: LabelAlign},
        //         // {field: 'layout', title: '布局方式', type: 'select', data: ViewLayout}
        //     ]},
        {title: '表格配置', field: 'listConfig', metas: [
                {field: 'selection', title: '选择功能', type: 'radio', data: Selection},
                {field: 'tableView', title: '表格显示', type: 'checkbox', data: tableView, change: (val, meta, model)=>{
                        model['isBorder'] = val.includes('bordered');
                        model['isPage'] = val.includes('pagination');
                        model['fixedHeight'] = val.includes('fixedHeight');
                    }}
            ]},
        {
            title: '其他配置', field: 'otherConfig', metas: [
                {field: 'addTitle', title: '新增标题', type: 'text'},
                {field: 'editTitle', title: '修改标题', type: 'text'},
            ]
        }
    ],
    IvzBasicModel: {
        column: 1,
        perms: [],
        tableName: null,
        addTitle: null,
        editTitle: null,
        keyType: 'int',
        align: 'right',
        keyField: 'id',
        formCol: [4, 18],
        isBorder: true,
        isPage: true,
        comment: '',
        selection: 'none',
        fixedHeight: true,
        layout: 'horizontal',
        labelCol: {span: 4},
        wrapperCol: {span: 18},
        activeKey: ['tableConfig', 'formConfig'],
        tableView: ['bordered', 'pagination', 'fixedHeight'],
    },
    IvzDrawerView: [
        {title: '数据表配置', field: 'tableConfig', metas: [
                {field: 'tableName', title: '表名', type: 'text', rules: [{required: true, message: '表名必填'}], placeholder: '数据库表名（t_user）'},
                {field: 'comment', title: '表说明', type: 'text', change: (val, meta, model)=>{
                        model.addTitle = "新增"+val;
                        model.editTitle = "修改"+val;
                    }, placeholder: '数据库表说明（会员表）'},
                {field: 'menuId', title: '父菜单', type: 'treeSelect', data: ParentMenus},
                {field: 'keyField', title: '主键字段', type: 'text', rules: [{required: true, message: '主键字段必填'}]},
                {field: 'keyType', title: '主键自增', type: 'radio', data: isAuto, radioStyle: 'button'},
            ]},
        {title: '表单配置', field: 'formConfig', metas: [
                {field: 'layout', title: '布局方式', type: 'radio', data: ViewLayout},
                {title: '列数', field: 'column', type: 'slider', change: (val, meta, model, global) => {
                        model.column=val;
                        global.span = 24 / val;
                        model.drawerRate = (val * 360) - (val-1) * 38;
                    }, min: 1, max: 3, step: 1, marks: {1: '1列', 2: '2', 3: '3列'}
                },
                {title: '列布局', field: 'formCol', type: 'slider', change: (val, meta, model) => {
                    if(val[0] + val[1] > 24) return;
                    model.labelCol = {span: val[0]};
                    model.wrapperCol = {span: val[1]};
                }, range: true, min: 3, max: 21, step: 1, marks: {3: '3', 6: '标签', 12: '12', 18: '表单', 21: '21'}},
                ...DrawerMetas,
            ]
        },
        {title: '表格配置', field: 'listConfig', metas: [
                {field: 'selection', title: '选择功能', type: 'radio', data: Selection},
                {field: 'tableView', title: '表格显示', type: 'checkbox', data: tableView, change: (val, meta, model)=>{
                        model['isBorder'] = val.includes('bordered');
                        model['isPage'] = val.includes('pagination');
                        model['fixedHeight'] = val.includes('fixedHeight');
                    }}
            ]},
        {
            title: '其他配置', field: 'otherConfig', metas: [
                {field: 'addTitle', title: '新增标题', type: 'text'},
                {field: 'editTitle', title: '修改标题', type: 'text'},
            ]
        }
    ],
    IvzViewModel: {
        span: 24,
        column: 1,
        perms: [],
        width: 920,
        tableName: null,
        addTitle: null,
        editTitle: null,
        keyType: 'int',
        align: 'right',
        keyField: 'id',
        formCol: [6, 14],
        isBorder: true,
        isPage: true,
        comment: '',
        selection: 'none',
        fixedHeight: true,
        layout: 'horizontal',
        labelCol: {span: 6},
        wrapperCol: {span: 14},
        ...DrawerModel,
        activeKey: ['tableConfig', 'formConfig'],
        tableView: ['bordered', 'pagination', 'fixedHeight'],
    },
    modal: [
        {
            title: '自定义功能配置', field: 'basicConfig', metas: [
                {title: '模态框标题', field: 'title', type: 'text', rules: [{required: true, message: '模态框标题必填'}]},
                {title: '功能标识', field: 'permId', type: 'text', rules: [{required: true, message: '功能标识必填'}], placeholder: '比如： password'},
                {title: '功能名称', field: 'permTitle', type: 'text', rules: [{required: true, message: '功能名称必填'}], placeholder: '比如： 修改密码'},
                {title: '功能位置', field: 'position', type: 'select'
                    , required: true, placeholder: '选择功能点放置位置', data: Position},
                {title: '功能地址(url)', field: 'url', type: 'text', placeholder: '比如： /core/user/pwd'},
                {title: '列布局', field: 'formCol', type: 'slider', change: (val, meta, model) => {
                        if(val[0] + val[1] > 24) return;
                        model.labelCol = {span: val[0]};
                        model.wrapperCol = {span: val[1]};
                    }, range: true, min: 3, max: 21, step: 1, marks: {3: '3', 6: '标签', 12: '12', 18: '表单', 21: '21'}},
                {title: '高/宽', field: 'length', type: 'slider', range: true, min: 220, max: 880
                    , step: 10, marks: {220: '高', 480: '480', 680: '680', 880: '宽'}},
                {title: '显示遮罩层', field: 'mask', type: 'radio', data: BooleanOptions},
                {title: '垂直居中', field: 'centered', type: 'radio', data: BooleanOptions},
                {title: '显示关闭按钮', field: 'closable', type: 'radio', data: BooleanOptions},
            ]
        }
    ],
    modalModel: {
        url: '',
        title: '自定义功能',
        permId: '',
        mask: false,
        position: 'T',
        permTitle: '',
        closable: true,
        centered: false,
        formCol: [6, 16],
        length: [260, 520],
        labelCol: {span: 6},
        wrapperCol: {span: 15},
        maskClosable: true,
    },
    group: [
        {title: '基础配置', field: 'basicConfig', metas: [
                {field: 'name', title: '组标题', type: 'text', rules: [{required: true, message: '组标题必填'}]},
                {field: 'field', title: '字段名', type: 'text', rules: [{required: true, message: '字段名必填'}]},
                {field: 'desc', title: '组说明', type: 'text'},
                {field: 'tableSpan', title: '表头分组', type: 'radio', data: BooleanOptions}
            ]
        }
    ],
    groupModel: {
        name: '',
        desc: '',
        field: '',
        tableSpan: false,
        activeKey: ['basicConfig'],
    },
    text: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    textForm: [
        // {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas, ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    textModel: {
        ...FormModel, ...TableModel,
        inputType: 'TEXT',
        fieldType: 'VARCHAR',
        activeKey: ['tableConfig', 'formConfig'],
    },
    password: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                ...OperaMetas,
                {title: '显示密码', field: 'visibility', type: 'radio', data: BooleanOptions},
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    passwordForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas, ...OperaMetas,
                {title: '显示密码', field: 'visibility', type: 'radio', data: BooleanOptions},
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    passwordModel: {
        ...FormModel, ...TableModel,
        visibility: false,
        fieldType: 'VARCHAR',
        activeKey: ['tableConfig', 'formConfig'],
    },
    radio: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                ...OptionsMetas, ...OperaMetas
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    radioForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas, ...OptionsMetas, ...OperaMetas,
                {title: '校验', field: 'validate', type: 'validate', data: TextValidate}
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    radioModel: {
        ...FormModel, ...TableModel, ...OptionsModel,
        dataType: 'cus',
        dataValue: '',
        activeKey: ['tableConfig', 'formConfig'],
    },
    select: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                ...OptionsMetas, ...OperaMetas,
                {title: '是否多选', field: 'mode', type: 'radio', data: ModeOptions}
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    selectForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas, ...OptionsMetas, ...OperaMetas,
                {title: '是否多选', field: 'mode', type: 'radio', data: ModeOptions},
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    selectModel: {
        ...FormModel, ...TableModel, ...OptionsModel,
        mode: 'default', // 是否多选
        fieldType: 'VARCHAR',
        activeKey: ['tableConfig', 'formConfig'],
    },
    number: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                {title: '最小值', field: 'min', type: 'number'},
                {title: '最大值', field: 'max', type: 'number'},
                {title: '步长', field: 'step', type: 'number'},
                ...OperaMetas
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    numberForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas,
                {title: '最小值', field: 'min', type: 'number'},
                {title: '最大值', field: 'max', type: 'number'},
                {title: '步长', field: 'step', type: 'number'},
                ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    numberModel: {
        ...FormModel, ...TableModel,
        min: 0, max: 0, step: null,
        fieldType: 'INT',
        activeKey: ['tableConfig', 'formConfig'],
    },
    checkbox: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                ...OptionsMetas, ...OperaMetas
            ]
        },
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    checkboxForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas, ...OptionsMetas, ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    checkboxModel: {
        ...FormModel, ...TableModel, ...OptionsModel,
        fieldType: 'VARCHAR',
        activeKey: ['tableConfig', 'formConfig'],
    },
    slider: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                {title: '最小值', field: 'min', type: 'number'},
                {title: '最大值', field: 'max', type: 'number'},
                {title: '步长', field: 'step', type: 'number'},
                ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    sliderForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas,
                {title: '最小值', field: 'min', type: 'number'},
                {title: '最大值', field: 'max', type: 'number'},
                {title: '步长', field: 'step', type: 'number'},
                ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    sliderModel: {
        ...FormModel, ...TableModel,
        min: 1, max: 50, step: 1,
        fieldType: 'INT',
        activeKey: ['tableConfig', 'formConfig'],
    },
    rate: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                {title: '数量', field: 'count', type: 'number', min: 1, step: 1},
                {title: '半选', field: 'allowHalf', type: 'radio', data: BooleanOptions},
                ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    rateForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas, ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]}
    ],
    rateModel: {
        ...FormModel, ...TableModel,
        count: 5,
        allowHalf: true,
        fieldType: 'FLOAT',
        activeKey: ['tableConfig', 'formConfig'],
    },
    time: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                {title: '日期格式', field: 'format', type: 'text'},
                {title: '表显示格式', field: 'viewFormat', type: 'text'},
                ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    timeForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas,
                {title: '日期格式', field: 'format', type: 'text'},
                {title: '表显示格式', field: 'viewFormat', type: 'text'},
                ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]}
    ],
    timeModel: {
        ...FormModel,
        ...TableModel,
        fieldType: 'TIME',
        format: 'HH:mm:ss',
        viewFormat: 'HH:mm:ss',
        activeKey: ['tableConfig', 'formConfig'],
    },
    date: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                {title: '日期格式', field: 'format', type: 'text'},
                {title: '显示类型', field: 'show', type: 'checkbox', data: DateOperaOptions
                    , change: (val, meta, model)=>{
                        model['showTime'] = val.includes('showTime');
                        model['showToday'] = val.includes('showToday');
                    }},
                ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    dateForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas,
                {title: '日期格式', field: 'format', type: 'text'},
                {title: '表显示格式', field: 'viewFormat', type: 'text'},
                {title: '显示类型', field: 'show', type: 'checkbox', data: DateOperaOptions
                    , change: (val, meta, model)=>{
                        model['showTime'] = val.includes('showTime');
                        model['showToday'] = val.includes('showToday');
                    }},
                ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]}
    ],
    dateModel: {
        ...FormModel, ...TableModel,
        show: [],
        showTime: false,
        showToday: false,
        fieldType: 'DATE',
        format: 'YYYY-MM-DD HH:mm:ss',
        activeKey: ['tableConfig', 'formConfig'],
    },
    tree: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                ...OptionsMetas
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas,
                {title: '多选框', field: 'checkable', type: 'radio', data: BooleanOptions},
            ]},
    ],
    treeForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas, ...OptionsMetas
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas,
                {title: '多选框', field: 'checkable', type: 'radio', data: BooleanOptions},
            ]},
    ],
    treeModel: {
        ...FormModel, ...TableModel, ...OptionsModel,
        fieldType: 'INT',
        checkable: false,
        activeKey: ['tableConfig', 'formConfig'],
    },
    editor: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    editorForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas, ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    editorModel: {
        ...FormModel,
        ...TableModel,
        fieldType: 'MEDIUMTEXT',
        activeKey: ['tableConfig', 'formConfig'],
    },
    upload: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    uploadForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas, ...OperaMetas,
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    uploadModel: {
        ...FormModel,
        ...TableModel,
        fieldType: 'VARCHAR',
        activeKey: ['tableConfig', 'formConfig'],
    },
    cascade: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                ...OptionsMetas, ...OperaMetas
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    cascadeForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas, ...OptionsMetas, ...OperaMetas
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    cascadeModel: {
        ...FormModel, ...TableModel, ...OptionsModel,
        fieldType: 'VARCHAR',
        activeKey: ['tableConfig', 'formConfig'],
    },
    textarea: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                ...OperaMetas,
                {title: '最大行', field: 'autoSize', type: 'number', min: 1, step: 1}
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    textareaForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas, ...OperaMetas,
                {title: '最大行', field: 'autoSize', type: 'number', min: 1, step: 1}
            ]},
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    textareaModel: {
        ...FormModel,
        ...TableModel,
        fieldType: 'TEXT',
        activeKey: ['tableConfig', 'formConfig'],
    },
    stree: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                ...OptionsMetas, ...OperaMetas,
                {title: '是否多选', field: 'multiple', type: 'radio', data: BooleanOptions}
            ]
        },
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]},
    ],
    streeForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas, ...OptionsMetas, ...OperaMetas,
                {title: '是否多选', field: 'multiple', type: 'radio', data: BooleanOptions}
            ]
        },
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]
        },
    ],
    streeModel: {
        ...FormModel, ...TableModel, ...OptionsModel,
        multiple: false,
        fieldType: 'INT',
        activeKey: ['tableConfig', 'formConfig'],
    },
    switch: [
        {title: '基础配置', field: 'tableConfig', metas: TableMetas},
        {title: '表单配置', field: 'formConfig', metas: [
                ...OperaMetas,
                {field: 'checkedChildren', title: '选中标签', type: 'text', placeholder: '比如：开'},
                {field: 'unCheckedChildren', title: '未选中标签', type: 'text', placeholder: '比如：关'},
            ]
        },
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]
        },
    ],
    switchForm: [
        {title: '表单配置', field: 'formConfig', metas: [
                ...FormMetas, ...OperaMetas,
                {field: '选中标签', title: 'checkedChildren', type: 'text', placeholder: '比如：开'},
                {field: '未选中标签', title: 'unCheckedChildren', type: 'text', placeholder: '比如：关'},
            ]
        },
        {title: '其他配置', field: 'otherConfig', metas: [
                ...OtherMetas
            ]
        },
    ],
    switchModel: {
        ...FormModel, ...TableModel,
        checkLabel: null, unCheckLabel: null,
        activeKey: ['tableConfig', 'formConfig'],
    },
    getItemMetas(type) {
        let metas = this[type];

        if(!metas) {
            throw new Error(`查询不到类型：${type}对应的Metas`);
        }

        return metas;
    },
    getFormItemMetas(type) {
        let metas = this[type + 'Form'];
        if(!metas) {
            throw new Error(`查询不到类型：${type}对应的Metas`);
        }
        return metas;
    },
    getItemModel(type) {
        let itemModel = this[type + 'Model'];
        if(!itemModel) {
            throw new Error(`查询不到类型：${type}对应的Model对象(${type}Model)`);
        }

        return Utils.clone(itemModel);
    },
    resolverSqlScript(metas, model) {

        let sql = `drop table if exists ${model.tableName};`;
        let autoIncrement = model.keyType == 'int' ||
        model.keyType == 'bigint' ? 'AUTO_INCREMENT' : '';
        let keyType = model['keyType'] == 'uuid' ? 'VARCHAR(42)' : model['keyType'];
        let columns = `${model.keyField} ${keyType} NOT NULL ${autoIncrement},`;

        let indexs = "";
        function doResolverSql(metas) {
            metas.forEach(meta => {
                if(meta.type == 'action') return;

                if(meta.metas || meta.children) {
                    doResolverSql(meta.metas || meta.children);
                } else {
                    let metaModel = meta.model;
                    let typeLength = !metaModel['typeLength'] ? '' : metaModel['typeLength'].indexOf('(') > 0 ? metaModel['typeLength'] : `(${metaModel['typeLength']})`;
                    let column = `${metaModel.name} ${metaModel.fieldType+typeLength} ${metaModel.default ? ('DEFAULT '+metaModel.default) : ''} ${metaModel.required ? 'NOT NULL' : 'NULL'} comment '${metaModel['comment']}',`;

                    if(metaModel['unique']) {
                        indexs += `CREATE INDEX index_${metaModel.name} ON ${model.tableName} (${metaModel.name});`
                    } else if(metaModel['index']) {
                        indexs += `CREATE UNIQUE INDEX unique_index_${metaModel.name} ON ${model.tableName} (${metaModel.name});`
                    }

                    columns += column;
                }
            })
        }
        doResolverSql(metas); // 生成列sql

        columns += `PRIMARY KEY (${model.keyField})`;
        let comment = model['comment'] ? `${model['comment']}` : '';
        sql += `create table ${model.tableName} (${columns}) comment '${model.comment}';`;

        return sql += indexs;
    },
    resolverGroupToMeta(model, global) {
        let meta = {title: model['name'], field: '', type: 'group'};
        if(model['tableSpan']) {
            meta.children = [];
        } else {
            meta.metas = [];
        }

        return meta;
    },
    /**
     * 解析普通表单元
     * @param model
     * @param global
     * @returns {*}
     */
    resolverCommonItemToMeta(model, global) {
        let meta = {
            data: [],
            rules: [],
            type: model['type'],
            field: model['name'] || model['id'],
            clear: model['clear'],
            title: model['label'],
            default: model[model.id],
            required: model['required'],
            disabled: model['disabled'],
            placeholder: model['placeholder']
            , config: {
                extra: model['extra']
            }
        };
        if(model['extra']) meta.config.extra = model['extra'];
        if(model['checkedChildren']) meta['checkedChildren'] = model['checkedChildren'];
        if(model['unCheckedChildren']) meta['unCheckedChildren'] = model['unCheckedChildren'];
        return this.handleForm(model, meta);
    },
    /**
     * 解析页级元数据
     * @param model
     * @param global
     * @returns {*}
     */
    resolverItemToMeta(model, global) {
        let meta = {
            type: model['type'],
            width: model['width'],
            field: model['name'] || model['id'],
            clear: model['clear'],
            title: model['label'],
            isForm: model['isForm'],
            default: model[model.id],
            isTable: model['isTable'],
            required: model['required'],
            disabled: model['disabled'],
            isDetail: model['isDetail'],
            isSearch: model['isSearch'],
            placeholder: model['placeholder']
            , config: {}
        };
        let validate = model['validate'];
        if(validate) {
            if(validate == "cus") {
                meta['validator'] = (rule, val, callBack) => {
                    console.log(`${meta.field}启用了自定义校验: ${val}`)
                }
            } else {
                meta.rule = validate;
                meta[validate] = model['validateValue']
            }
        }

        if(model['span']) meta.config.span = model['span'];
        if(model['extra']) meta.config.extra = model['extra'];
        if(model['labelCol']) meta.config.labelCol = model['labelCol'];
        if(model['wrapperCol']) meta.config.wrapperCol = model['wrapperCol'];
        if(model['hasFeedback']) meta.config.hasFeedback = model['hasFeedback'];
        if(model['checkedChildren']) meta['checkedChildren'] = model['checkedChildren'];
        if(model['unCheckedChildren']) meta['unCheckedChildren'] = model['unCheckedChildren'];
        return this.handleForm(model, meta);
    },
    handleForm(model, meta) {
        this.handleText(model, meta, global);
        this.handleTree(model, meta, global);
        this.handleDate(model, meta, global);
        this.handleRate(model, meta, global);
        this.handleRadio(model, meta, global);
        this.handleUpload(model, meta, global);
        this.handleSlider(model, meta, global);
        this.handleEditor(model, meta, global);
        this.handleSwitch(model, meta, global);
        this.handleSelect(model, meta, global);
        this.handleNumber(model, meta, global);
        this.handlePassword(model, meta, global);
        this.handleCascade(model, meta, global);
        this.handleTextArea(model, meta, global);
        this.handleCheckbox(model, meta, global);
        this.handleTreeSelect(model, meta, global);

        return meta;
    },
    handleText(model, meta) {

    },

    handleTree(model, meta) {
        if(model['type'] == 'tree') {
            this.handleOptionsItem(model, meta);
        }
    },

    handleDate(model, meta) {

    },

    handleRate(model, meta) {
        if(model['allowHalf']) {
            meta.config.allowHalf = true
        }
    },

    handleRadio(model, meta) {
        if(model['type'] == 'radio') {
            this.handleOptionsItem(model, meta);
        }
    },

    handleUpload(model, meta) {

    },

    handleSlider(model, meta) {
        if(model.type == 'number') {
            meta['min'] = model['min'];
            meta['max'] = model['max'];
            meta['step'] = model['step'];
        }
    },

    handleEditor(model, meta) {

    },

    handleSwitch(model, meta) {

    },

    handleSelect(model, meta) {
        if(model['type'] == 'select') {
            this.handleOptionsItem(model, meta);
        }
    },

    handleNumber(model, meta) {
        if(model.type == 'number') {
            meta['min'] = model['min'];
            meta['max'] = model['max'];
            meta['step'] = model['step'];
        }
    },

    handlePassword(model, meta) {
        if(model.type == 'password') {
            meta['visibility'] = model['visibility'];
        }
    },

    handleCascade(model, meta) {
        if(model['type'] == 'cascade') {
            this.handleOptionsItem(model, meta);
        }
    },

    handleTextArea(model, meta) {

    },

    handleCheckbox(model, meta) {
        if(model['type'] == 'checkbox') {
            this.handleOptionsItem(model, meta);
        }
    },

    handleTreeSelect(model, meta) {
        if(model['type'] == 'stree') {
            this.handleOptionsItem(model, meta);
            meta['multiple'] = model['multiple']
        }
    },
    handleOptionsItem(model, meta) {
        if(model['dataType'] == 'cus') {
            meta['data'] = model['options'];
        } else if(model['dataType'] == 'dict') {
            meta['dictType'] = model['dictValue'][0];
        } else if(model['dataType'] == 'url') {
            meta['url'] = model['urlValue'];
        }
    }
}
