<template>
    <a-result status="404" title="404" :subTitle="subTitle">
        <template #extra>
            <a-button type="primary" @click="back">点击返回</a-button>
        </template>
    </a-result>
</template>

<script>
    import Utils from '@/utils/basic.utils' // 工具库
    export default {
    name: '404',
    components: {},
    data () {
        return {
            subTitle: '抱歉, 您访问的页面不存在'
        }
    },
    created () {
        let urlParam = Utils.getUrlParam(window.location.href);
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
