<template>
    <a-result status="403" title="403" :subTitle="subTitle">
        <template #extra>
            <a-button type="primary" @click="back">点击返回</a-button>
        </template>
    </a-result>
</template>

<script>
    export default {
        name: '403',
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
        methods: {
            back() {
                history.go(-1);
            }
        }
    }
</script>
