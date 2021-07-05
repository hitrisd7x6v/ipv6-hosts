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
            {field: 'password', title: '密码'},
            {field: 'password1', title: '密码'},
            {field: 'password2', title: '密码'},
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
                    this.$refs['mf'].open()
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
