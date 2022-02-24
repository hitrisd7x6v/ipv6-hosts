import Vue from 'vue'

import Data from './data'
import IvzModalForm from '@/components/form/IvzModalForm'
import IvzBasicView from '@/components/view/IvzBasicView.vue'

new Vue({
    el: '#app',
    components: {IvzBasicView, IvzModalForm},
    data: {
        data: Data.data,
        metas: Data.mates,
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
        groupConfig: Data.groupConfig,
        searchMetas: Data.searchMates,
    },
    created () {
        this.$page.addActionMeta("Modal", {
            id: 'modal',
            status: 'hide',
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
        },
        jump(params) {
            let model = params.row;
            this.$nav({path: '/demo/drawerView.html', params: {name: model.name}, refresh: true});
        }
    }
})
