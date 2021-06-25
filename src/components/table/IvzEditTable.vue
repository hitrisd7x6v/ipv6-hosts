<template>
    <div class="ivz-edit-table ivz-border-radius">
        <a-table ref="tableRef" :columns="tableMetas" :data-source="dataSource" bordered
             :position="tableConfig.position" :loading="loading" :indentSize="tableConfig.indentSize"
             size="small" :scroll="tableConfig.scroll" :locale="tableConfig.locale" :rowKey="tableConfig.rowKey"
             :showHeader="tableConfig.showHeader" :pagination="tableConfig.pagination" @change="change"
             :rowSelection="tableConfig.selection" :expandRowByClick="tableConfig.expandRowByClick"
             :defaultExpandedRowKeys="tableConfig.defaultExpandedRowKeys" :rowClassName="()=>{return 'ivz-edit-row'}"
             :defaultExpandAllRows="tableConfig.defaultExpandAllRows" :expandedRowKeys="tableConfig.expandedRowKeys">
            <template v-for="col in slotMetas" :slot="col.tableSlot" slot-scope="text, row, index">
                <slot :name="col.tableSlot" :row="row" :index="index" :value="text">
                    <div v-if="row['EditableFlag'] && col['editable']" :key="col.field">
                        <a-select v-if="col.type=='select'" :allow-clear="col.clear"
                          dropdown-class-name="ivz-select-class" :token-separators="col.config.separators"
                          @change="changeHandle(col, row, text)" :value="row[col.field]"
                          :disabled="disabledHandle(col, row)" :max-tag-count="col.config.tagCount" style="width: 100%">
                            <a-select-option v-for="option in col.data" :key="option.value"
                                 :disabled="option.disabled" class="ivz-option-class">
                                {{option.label}}
                            </a-select-option>
                        </a-select>
                        <a-radio-group v-else-if="col.type=='radio'" :options="col.data" :name="col.field" :disabled="col.disabled"
                           @change="(e)=>changeHandle(col, row, e)" :value="row[col.field]" :default-value="col.default"></a-radio-group>
                        <a-checkbox-group v-else-if="col.type=='checkbox'" :options="col.data" :value="row[col.field]"
                          :default-value="col.default" @change="(val)=>changeHandle(col, row, val)"></a-checkbox-group>
                        <a-input-number v-else-if="col.type == 'number'" :min="col.config.min" :max="col.config.max" :step="col.config.step"
                            :disabled="disabledHandle(col, row)" :blur="eventHandle(col, row, 'blur')" style="width: 100%"
                            :formatter="col.formatter" :precision="col.config.precision" :parser="col.config.parser" :value="row[col.field]"
                            @change="(val)=>changeHandle(col, row, val)" :focus="eventHandle(col, row, 'focus')"></a-input-number>
                        <a-input v-else :type="col.type" :placeholder="col.placeholder"
                             :value="row[col.field]" :disabled="disabledHandle(col, row)"
                             :prefix="col.config.prefix" :suffix="col.config.suffix" :blur="()=>eventHandle(col, row, 'blur')"
                             @press-enter="eventHandle(col, row, 'pressEnter')" @change="(e)=>changeHandle(col, row, e.target.value)" >
                        </a-input>
                    </div>
                    <div v-else v-html="col.formatter(text, row, col)" :key="col.field"></div>
                </slot>
            </template>
            <template slot="action" slot-scope="text, row, index">
                <slot name="action" :row="row" :index="index">
                    <a-row align="middle" justify="center" type="flex">
                        <a-col v-for="mate in mainMetas" :key="mate.id" class="ivz-opera">
                            <a-popconfirm v-if="mate.id=='del'" title="确认删除？" trigger="click"
                                  @confirm="actionHandle(mate, row, index)" :arrow-point-at-center="true"
                                  okText="确认" cancelText="取消">
                                <a-tag :color="mate.color" :class="disabledClass(mate, row)">{{mate.label}}</a-tag>
                            </a-popconfirm>
                            <a-tag v-else :color="mate.color" :class="disabledClass(mate, row)"
                                   @click="actionHandle(mate, row, index)">{{mate.label}}</a-tag>
                        </a-col>
                    </a-row>
                </slot>
            </template>
        </a-table>
    </div>
</template>

<script>
    import {MixBasicTable} from '../mixins/MixBasicTable'
    export default {
        name: 'IvzEditTable',
        mixins: [MixBasicTable],
        props: { },
        data () {
            return {
                backEditModel: {}, // 当前编辑的数据备份
            }
        },
        created () { },
        mounted () { },
        methods: {
            formatter (val, row, col) {
                return val
            },
            // 注册动作 action(String)
            register (actionMate) {
                if (!actionMate || !actionMate.id) {
                    return this.$log.errorLog('注册功能点失败, 不存在或者没有指定id', '请传入正确的功能点对象', actionMate)
                }

                let key = this.$utils.firstUpperCase(actionMate.id)
                if (this.actionMetaKeys.includes(key)) return

                this.actionMetaKeys.push(key)

                if (key === 'Save' || key === 'Cancel') {
                    actionMate['position'] = 'T'
                }

                this.$page.registerPosition('table', actionMate, this.mainMetas, this.moreMetas)
            },
            resetBackModel () {
                this.backEditModel = {} // 重置对象
            },
            addActionHandle (meta, row, index) {
                if (this.isNotBlank(this.backEditModel)) {
                    return this.$msg.warningMessage('请先(保存/取消)当前新增行')
                }
                row['EditableFlag'] = true;
                meta.callBack(row).then(param => {
                    this.backEditModel = row; // 备份新增对象, 用来判断是否一次新增多条
                    this.dataSource.splice(index, 0, row)
                })
            },
            editActionHandle (meta, row) {
                if (this.isNotBlank(this.backEditModel)) {
                    let rowKey = this.tableConfig.rowKey;
                    if (this.backEditModel[rowKey] === row[rowKey]) return;
                    return this.$msg.warningMessage('请先(保存/取消)当前编辑行')
                }
                meta.callBack(row).then(param => {
                    this.$utils.assignProperty(this.backEditModel, row) // 备份当前编辑對象
                    this.$set(row, 'EditableFlag', true) // EditableFlag说明可编辑
                })
            },
            delActionHandle (meta, row, submit) {
                meta.callBack(row).then(param => {
                    let resolve = this.$utils.getPromiseResolve(param)
                    if (row[this.tableConfig.rowKey]) {
                        this.loading = true
                        let delSubmit = [row[this.tableConfig.rowKey]]
                        this.$http.post(meta['url'], delSubmit).then(resp => {
                            this.$msg.delSuccessNotify(resolve, resp, this, row, () => {
                                this.query()
                            })
                        }).catch(reason => {
                            this.$msg.delFailNotify(resolve, reason, this, row)
                        }).finally(() => {
                            this.loading = false
                        })
                    } else {
                        this.$utils.delArrayEle(this.dataSource, row, null)
                    }
                })
            },
            saveActionHandle(meta, row) {
                if (!row['EditableFlag']) return;
                meta.callBack(row).then(param => {
                    let resolve = this.$utils.getPromiseResolve(param);
                    let saveMate = row[this.tableConfig.rowKey] ?
                        this.actionMetas.Edit : this.actionMetas.Add;
                    if (!saveMate.url) {
                        return this.$log.warningLog('没有指定提交Url', '请设置Url', saveMate)
                    }
                    this.loading = true;
                    let submitModel = this.$utils.assignProperty({}, row)
                    delete submitModel['EditableFlag'] // 必须要一处可编辑标签
                    this.$http.post(saveMate.url, submitModel).then(resp => {
                        // 如果保存成功, 则取消当前备份
                        this.cancelActionHandle(this.actionMetas.Cancel, row);
                        this.$msg.submitSuccessNotify(resolve, resp, this, row, () => {
                            this.query()
                        })
                    }).catch(reason => {
                        this.$msg.submitFailNotify(resolve, reason, this, row)
                    }).finally(() => {
                        this.loading = false
                    })
                });
            },
            cancelActionHandle(meta, row) {
                let rowKey = this.tableConfig.rowKey;
                if (this.isNotBlank(this.backEditModel) && this.backEditModel[rowKey] === row[rowKey]) {
                    if (!this.backEditModel[rowKey]) { // 取消新增的行
                        this.backEditModel = {} // 重置对象
                        this.$utils.delArrayEle(this.dataSource, row, null)
                    } else { // 取消编辑的行
                        delete row['EditableFlag']
                        // 还原当前数据备份
                        this.$utils.assignVueProperty(row, this.backEditModel, this)
                        this.backEditModel = {} // 重置对象
                        this.$refs['tableRef'].$forceUpdate() // 强制更新组件
                    }
                }
            },
            otherActionHandle (meta, row, submit) {
                meta.callBack(row).then(param => {
                    let resolve = this.$utils.getPromiseResolve(param)
                    this.$http.post(meta['url'], row).then(resp => {
                        this.$msg.defaultSuccessNotify(resolve, resp, this, row)
                    }).catch(reason => {
                        this.$msg.defaultFailNotify(resolve, reason, this, row)
                    })
                })

            },
            eventHandle (col, row, type) {
                let eventElement = col.event[type];
                if (eventElement) eventElement(row[col.field], row, col)
            },
            changeHandle (col, row, val) {
                this.$set(row, col.field, val);
                col.event.change(val, row, col)
            },
            disabledHandle (col, row) {
                if (!col.disabled) {
                    return false
                } else if (typeof col.disabled === 'function') {
                    return col.disabled(row, col)
                } else {
                    return col.disabled
                }
            }
        }
    }
</script>

<style>
    .ivz-basic-table .ivz-table {
        padding: 6px;
    }
    .ivz-edit-row td{
        height: 36px;
        padding: 2px 4px!important;
    }
</style>
