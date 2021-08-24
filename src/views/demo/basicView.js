import Vue from 'vue'

import Data from './data'
import IvzModalForm from '@/components/form/IvzModalForm'
import IvzBasicView from '@/components/view/IvzBasicView.vue'

new Vue({
    el: '#app',
    components: {IvzBasicView, IvzModalForm},
    data: {
        data: Data.data,
        mates: Data.mates,
        config: Data.config,
        ModalMetas: [
            {field: 'name', title: 'text', required: true, span: [6, 16]},
            {field: 'spec', title: 'checkbox', type: 'checkbox', dictType: 'spec', default: ['1']},
            {field: 'test', title: 'slot'},
            {field: 'createTime', title: 'date', type: 'date', required: true, span: [6, 16], default: new Date()},
        ],
        saveMeta: {id: 'save', label: '提交', url: '/test/save', callBack: () => {
                return new Promise((resolve, reject) => {
                    return resolve()
                })
            }},
        groupMetas: Data.groupMetas,
        groupConfig: Data.groupConfig,
        searchMetas: Data.searchMates,
    },
    created () {
        this.$page.addActionMeta("Modal", {
            id: 'modal',
            position: 'T',
            label: '模态框',
            callBack: (model) => {
                return new Promise((resolve, reject) => {
                    this.$refs['mf'].open(model);
                })
            }
        })
    },
    methods: {
        add() {
            this.$refs['ibv'].cancel();
        }
    }
})
