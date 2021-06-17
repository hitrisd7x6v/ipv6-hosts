import Vue from 'vue'

import Data from './data'
import IvzSlotFormView from "@/components/view/IvzSlotFormView";
new Vue({
    el: '#app',
    components: {IvzSlotFormView},
    data: {
        data: Data.data,
        config: Data.config,
        groupMetas: Data.groupMetas,
        searchMetas: Data.searchMates,
        actionMetas: Data.actionMetas
    },
    methods: {

    }
})
