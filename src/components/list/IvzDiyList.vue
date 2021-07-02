<template>
    <div class="ivz-list ivz-diy-list">
        <slot name="test">
            <button @click="$router.push('/form')">表单</button>
        </slot>
    </div>
</template>
<!--自定义列表页-->
<script>
    // import {MixPageList} from "@/components/mixins/MixPageList";

    export default {
        name: "IvzDiyList",
        props: {
            tableConfig: {type: Object}
        }
        // mixins: [MixPageList],
    }
</script>

<style scoped>

</style>
