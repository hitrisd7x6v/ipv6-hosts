<template>
    <div class="ivz-basic-search ivz-border-radius ivz-block-outer">
        <ul class="ivz-basic-opera ivz-border-radius">
            <li class="ivz-opera-left">
                <div style="color: #606266;">
                    <ivz-icon type="iz-icon-chaxun" :style="{fontSize: '22px', verticalAlign: 'text-top'}"></ivz-icon>
                    &nbsp;<em style="vertical-align: bottom; font-size: 16px">{{resource.name}}</em>
                </div>
            </li>
            <li class="ivz-opera-right">
                <a-button-group>
                    <template v-if="searchMainMetas">
                        <a-button v-for="item in searchMainMetas" :key="item.id"
                                  :type="item.color" @click="actionEvent(item)">
                            <span>&nbsp;{{item.label}}</span>
                        </a-button>
                    </template>
                    <a-dropdown v-if="!isBlank(searchMoreMetas)">
                        <a-menu slot="overlay" @click="actionEvent">
                            <template v-for="item in searchMoreMetas">
                                <a-menu-item :key="item.id">
                                    {{item.label}}
                                </a-menu-item>
                            </template>
                        </a-menu>
                        <a-button type="dashed">
                            更多&nbsp;<a-icon type="down" size="16px"></a-icon>
                        </a-button>
                    </a-dropdown>
                </a-button-group>
            </li>
            <li style="clear: both"></li>
        </ul>
        <slot name="search">
            <ivz-search-model class="ivz-search-bottom" :search-model="searchModel" ref="searchRef"
                 :metas="searchMetas" :form-config="searchConfig" @pressEnter="pressEnter">
            </ivz-search-model>
        </slot>
    </div>
</template>

<script>

    import IvzSearchModel from "@/components/form/IvzSearchModel";
    import Resolver from "@/utils/resolver.utils";
    export default {
        name: "IvzPageSearch",
        components: {IvzSearchModel},
        props: {
            searchModel: {type: Object, default: () => {}},
            searchConfig: {type: Object, default: () => {}},
            searchMetas: {type: Array, default: () => []},
            actionMetas: {type: Object, default: () => {}, required: true}
        },
        data() {
            return {
                resource: {},
                oriModel: {},
                fieldMetaMap: {},
                actionMetaKeys: [],
                searchMainMetas: [],
                searchMoreMetas: [],
            }
        },
        created() {
            this.resource = this.$page.menu;
            this.initActionMates(this.actionMetas);
            this.oriModel = this.$page.oriSearchModel;
            this.fieldMetaMap = this.$page.searchFieldMetaMap;
        },
        methods: {
            actionEvent(meta) {
                switch (meta['id']) {
                    case 'add':
                        let oriModel = this.$page.getOriModel(this);
                        this.$page.putStore("actionMeta", meta);
                        this.$page.putStore("editModel", oriModel);
                        this.$page.add(oriModel, meta, 0);
                        break;
                    case 'view':
                        this.$page.query();
                    default:
                        this.$page.putStore('actionMeta', meta);
                        this.$router.push("/IvzSys/action"); break;
                }
            },
            pressEnter (model, col) {
                if (col.config.enterSearch) { // 按enter键搜索
                    this.$router.push("/IvzSys/list");
                }
            },
            initActionMates (actionMetas) {
                if (this.isBlank(actionMetas)) {
                    return this.$log.warningLog('设置功能动作按钮', '未指定任何功能动作', actionMetas)
                }

                Object.keys(actionMetas).forEach(key => {
                    let actionMeta = actionMetas[key]
                    if (!actionMeta.id) {
                        return this.$log.warningLog('注册功能点失败, 不存在或者没有指定id', '请传入正确的功能点对象', actionMeta)
                    }

                    if (this.actionMetaKeys.includes(key)) return

                    if (key === 'View') {
                        this.queryMate = actionMeta
                    }

                    this.actionMetaKeys.push(key)
                    Resolver.registerPosition('search', actionMeta, this.searchMainMetas, this.searchMoreMetas)
                })
            }
        }
    }
</script>

<style scoped>

</style>
