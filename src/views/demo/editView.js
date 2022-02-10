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
                selection: {}
            },
        },
        editActionMetas: {},
        groupMetas: Data.groupMetas,
        searchMetas: Data.searchMates
    },
    created () {
        this.$page.addActionMeta("Other", {id: 'other', label: '数据', position: 'T', color: 'green', callBack: (row) => {
                return new Promise((resolve, reject) => {
                    this.$refs['det'].open()
                })
            }});
        this.editActionMetas['Add'] = this.$page.getActionMeta('Add')
        this.editActionMetas['Edit'] = this.$page.getActionMeta('Edit')
        this.editActionMetas['Save'] = this.$page.getActionMeta('Save')
        this.editActionMetas['Cancel'] = this.$page.getActionMeta('Cancel')
        this.editActionMetas['Query'] = this.$page.getActionMeta('Query', {url: '/test',
            callBack (row) {
                return new Promise((resolve, reject) => {
                    resolve()
                })
            }
        })
    }
})
