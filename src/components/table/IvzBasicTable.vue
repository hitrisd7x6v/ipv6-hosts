<template>
    <a-table ref="tableRef" :rowKey="tableConfig.rowKey" :dataSource="dataSource" :columns="tableMetas"
             :rowClassName="tableConfig.rowClassName" :position="tableConfig.position" @change="change"
             :bordered="tableConfig.bordered" :loading="loading" :indentSize="tableConfig.indentSize"
             :size="tableConfig.size" :scroll="tableConfig.scroll" :pagination="tableConfig.pagination"
             :defaultExpandAllRows="tableConfig.defaultExpandAllRows" :expandedRowKeys="tableConfig.expandedRowKeys"
             class="ivz-view-table ivz-block-outer ivz-border-radius" :expandRowByClick="tableConfig.expandRowByClick"
             :defaultExpandedRowKeys="tableConfig.defaultExpandedRowKeys" :rowSelection="tableConfig.selection">
        <template v-for="col in slotMetas" :slot="col.tableAlias" slot-scope="text, record, index">
            <slot :name="col.tableAlias" :value="text" :row="record" :index="index">
                <div v-html="col.formatter(text, record, col)" :key="col.field" style="display: inline-block"></div>
            </slot>
        </template>
        <template slot="action" slot-scope="text, record, index">
            <slot name="action" :row="record" :index="index">
                <a-row type="flex" justify="center" :gutter="0" align="middle">
                    <template v-if="isNotBlank(mainMetas)">
                        <a-col v-for="item in mainMetas" :key="item['id']" class="ivz-opera">
                            <a-tag :color="item.color" :class="disabledClass(item, record)"
                                   @click="actionHandle(item, record)">{{item.label}}</a-tag>
                        </a-col>
                    </template>
                    <a-col v-if="isNotBlank(moreMetas)" class="ivz-opera ivz-tm">
                        <a-popover trigger="hover" placement="left"
                                   :autoAdjustOverflow="false" :arrowPointAtCenter="true">
                            <div slot="content">
                                <a :class="['ivz-opera-icon', item.class, item.disabled ? 'disabled' : null]"
                                   v-for="more in moreMetas" :key="more.id" @click="actionHandle(more, record)">
                                    <i :class="['izc ivz-action-icon', more.icon]"></i>
                                </a>
                            </div>
                            <span class="ivz-opera-icon">
                          <ivz-icon type="iz-icon-more" size="14px"></ivz-icon>
                          <span>更多</span>
                        </span>
                        </a-popover>
                    </a-col>
                </a-row>
            </slot>
        </template>
    </a-table>
</template>

<script>
import {MixBasicTable} from '../mixins/MixBasicTable'
import PageOptions from "@/components/page.config";
export default {
    name: 'IvzBasicTable',
    mixins: [MixBasicTable],
    props: {},
    data () {
        return {}
    },
    created () {

    },
    methods: {
        register (actionMate) {
            if (!actionMate) throw new Error('未指定元对象')
            let key = this.$utils.firstUpperCase(actionMate.id)

            if (this.actionMetaKeys.includes(key)) return

            this.actionMetaKeys.push(key)
            this.$page.registerPosition('table', actionMate, this.mainMetas, this.moreMetas)
            return this
        },
        addActionHandle (meta, row, index) { },
        editActionHandle (meta, row) {
            if(!meta || !row)
                return this.$log.warningLog("错误的编辑参数", '请指定正确的参数', row);
            meta.callBack(row, this).then(() => {
                PageOptions.putStore('editModel', row);
                let query = {};
                query[PageOptions.izField] = row[PageOptions.izField]
                this.$router.push({path: '/IvzSys/edit', query: query})
            }).catch(reason => {});
        },
        delActionHandle: function (mate, selectionRows, submit) {
            mate.callBack(selectionRows, this).then((resp) => {
                let resolve = this.$utils.getPromiseResolve(resp)
                let tipTitle = resolve.tipTitle ? resolve.tipTitle : '数据删除操作!'
                let tipContent = resolve.tipContent ? resolve.tipContent : `您确认删除此条数据?`
                this.$msg.confirm(tipTitle, tipContent).then(() => {
                    this.loading = true
                    // 删除时提交的数据只能是id或者是id数组
                    if (!(this.isArray(submit))) {
                        submit = [submit[this.$page.izField]]
                    }
                    this.$http.post(mate.url, submit).then(data => {
                        this.$msg.delSuccessNotify(resolve, data, this, submit, () => {
                            this.query()
                        })
                    }).catch(reason => {
                        this.$msg.delFailNotify(resolve, reason, this, submit)
                    }).finally(() => {
                        this.loading = false
                    })
                }).catch(reason => null)
            }).catch(reason => {})
        },
        otherActionHandle: function (mate, selectionRows, submit) {
            mate.callBack(selectionRows).then(resp => {
                let resolve = this.$utils.getPromiseResolve(resp)
                let tipTitle = resolve.tipTitle
                let tipContent = resolve.tipContent
                if (tipTitle && tipContent) { // 需要提交确认
                    this.$msg.confirm(tipTitle, tipContent).then(() => {
                        this.loading = true
                        this.$http.post(mate.url, submit).then(data => {
                            this.$msg.submitSuccessNotify(resolve, data, this, submit)
                        }).catch(reason => {
                            this.$msg.submitFailNotify(resolve, reason, this, submit)
                        }).finally(() => {
                            this.loading = false
                        })
                    }).catch(reason => null)
                } else { // 不需要提交确认
                    this.loading = true
                    this.$http.post(mate.url, submit).then(data => {
                        this.$msg.submitSuccessNotify(resolve, data, this, submit)
                    }).catch(reason => {
                        this.$msg.submitFailNotify(resolve, reason, this, submit)
                    }).finally(() => {
                        this.loading = false
                    })
                }
            })
        },
    }
}
</script>

<style>
    .ivz-basic-table {
        background-color: #FFFFFF;
    }
    .ivz-basic-table .ivz-table {
        padding: 3px 6px 0px;
    }
</style>
