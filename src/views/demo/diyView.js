import Vue from 'vue'

import Data from './data'
import IvzDiyView from '@/components/view/IvzDiyView.vue'
new Vue({
    el: '#app',
    components: {IvzDiyView},
    data: {
        data: Data.data,
        mates: Data.mates,
        config: Data.config,
        groupMetas: Data.groupMetas,
        searchMetas: Data.searchMates,
        actionMetas: Data.actionMetas
    }
})
