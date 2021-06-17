import Vue from 'vue'

import Data from './data'
import IvzSlotTableView from "@/components/view/IvzSlotTableView";
new Vue({
    el: '#app',
    components: {IvzSlotTableView},
    data: {
        data: Data.data,
        config: Data.config,
        groupMetas: Data.groupMetas,
        searchMetas: Data.searchMates,
        actionMetas: Data.actionMetas
    },
    methods: {
        test(row) {
            this.$refs['dtv'].edit(row);
        }
    }
})
