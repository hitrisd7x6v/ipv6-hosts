<template>
    <div>
        <button @click="$router.push('/list')">返回list</button>
    </div>
</template>
<!--自定义表单页-->
<script>
    export default {
        name: 'IvzDiyForm',
        components: {},
        props: {},
        data () {
            return {
                model: null, // 当前编辑的表单对象
                oriModel: null // 原始表单字段对象
            }
        },
        created () {
            console.log("list created")
        },
        mounted () {
            console.log("list mounted")
        },
        methods: {

        }
    }
</script>

<style>
</style>
