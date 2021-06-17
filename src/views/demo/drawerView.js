import Vue from 'vue'

import Data from './data'
import IvzDrawerView from '@/components/view/IvzDrawerView.vue'
new Vue({
    el: '#app',
    components: {IvzDrawerView},
    data: {
        mates: Data.mates,
        config: Data.config,
        groupMetas: Data.groupMetas,
        searchMetas: Data.searchMates,
        actionMetas: Data.actionMetas
    }
})
