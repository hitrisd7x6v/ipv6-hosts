import Utils from "@/utils/basic.utils";

let StyleMetas = [
    {title: '宽', type: 'number', field: 'width'},
    {title: '高', type: 'number', field: 'height'},
];
let StyleModel = {
    width: 30,
    height: 50
};
export default {
    IvzListMetas: [
        {title: '基础配置', field: 'basicConfig', metas: [
                {title: 'url', field:  'apiUrl', placeholder: '列表页的数据源Url'}
            ]
        }
    ],
    IvzListModel: {

    },
    label: [
        {title: '基础配置', field: 'basicConfig', metas: [
                {title: '文字', type: 'textarea', field: 'label'}
            ]},
        {title: '样式配置', field: 'styleConfig', metas: StyleMetas}
    ],
    labelModel: {
        label: '测试文本',
        ...StyleModel,
    },
    img: [
        {title: '基础配置', field: 'basicConfig', metas: [
                {title: '图片地址', type: 'text', field: 'src'}
            ]}
    ],
    imgModel: {
        src: '/img/logo.png',
        ...StyleModel,
    },
    getItemMetas(type) {
        let metas = this[type];
        if(!metas) {
            throw new Error(`查询不到在线列表组件：${type}对应的Metas`);
        }
        return metas;
    },
    getItemModel(type) {
        let itemModel = this[type + 'Model'];
        if(!itemModel) {
            throw new Error(`查询不到在线列表类型：${type}对应的Model对象(${type}Model)`);
        }

        return Utils.clone(itemModel);
    }
}
