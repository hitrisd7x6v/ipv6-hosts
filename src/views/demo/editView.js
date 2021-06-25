import Vue from 'vue'

import Data from './data'
import IvzTableView from '@/components/view/IvzEditView.vue'
import IvzDrawerEditTable from '@/components/table/IvzDrawerEditTable.vue'
new Vue({
    el: '#app',
    components: {IvzTableView, IvzDrawerEditTable},
    data: {
        visible: true,
        data: Data.data,
        mates: Data.mates,
        config: Data.config,
        editMetas: {},
        editConfig: {
            table: {
                scroll: {y: 160}
            }
        },
        editActionMetas: {},
        groupMetas: Data.groupMetas,
        actionMetas: Data.actionMetas,
        searchMetas: Data.searchMates
    },
    created () {
        this.actionMetas['Other'] = {id: 'other', label: '数据', position: 'T', color: 'green', callBack: (row) => {
                return new Promise((resolve, reject) => {
                    this.$refs['det'].open()
                })
            }}
        this.editActionMetas['Add'] = this.$getActionMate('Add')
        this.editActionMetas['Edit'] = this.$getActionMate('Edit')
        this.editActionMetas['Save'] = this.$getActionMate('Save')
        this.editActionMetas['Cancel'] = this.$getActionMate('Cancel')
        this.editActionMetas['Query'] = this.$getActionMate('Query', {url: '/test',
            callBack (row) {
                return new Promise((resolve, reject) => {
                    resolve()
                })
            }
        })
    }
})
