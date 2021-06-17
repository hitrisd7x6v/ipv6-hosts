<template>
    <div class="ivz-list ivz-diy-list">
        <slot name="search" :config="searchConfig" :metas="searchMetas" :model="searchModel"></slot>
        <slot name="table" :config="tableConfig" :metas="tableMetas" :data="data"></slot>
    </div>
</template>
<!--自定义列表页-->
<script>
    import {MixPageList} from "@/components/mixins/MixPageList";

    export default {
        name: "IvzDiyList",
        mixins: [MixPageList],
    }
</script>

<style scoped>

</style>
