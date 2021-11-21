<template>
    <a-result status="403" title="403" :subTitle="subTitle">
        <template #extra>
            <a-button type="primary" @click="back">点击返回</a-button>
        </template>
    </a-result>
</template>

<script>
    import {MixError} from "@/views/error/MixError";

    export default {
        name: '403',
        mixins:  [MixError],
        components: {},
        data () {
            return {
                subTitle: '抱歉, 您无权限访问此功能'
            }
        },
        created () {
            let urlParam = this.$utils.getUrlParam(window.location.href);
            this.subTitle = urlParam['errMsg'] || this.subTitle;
        },
        mounted () {

        },
    }
</script>
