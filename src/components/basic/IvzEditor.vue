<template>
    <div>
        <a-spin tip="图片上传中..." :spinning="spinning">
            <editor v-model="value" :init="meta.config.tinymce"
                    :disabled="disabled" @onClick="onClick">
            </editor>
        </a-spin>
    </div>
</template>

<script>
    import Editor from '@tinymce/tinymce-vue'
    // 更多插件参考：https://www.tiny.cloud/docs/plugins/
    export default {
        name: "IvzEditor",
        components: {Editor},
        props: {
            meta: {type: Object, required: true},
            model: {type: Object, required: true},
            disabled: {type: Boolean,default: false},
        },
        watch: {
            value: function (newVal) {
                this.$utils.deepSetValue(this.meta.field, newVal, this.model)
            }
        },
        data() {
            return {
                value: '',
                tinymce: null,
                spinning: false
            }
        },
        created() {
            this.tinymce = this.meta.config.tinymce;
            if(!this.tinymce['images_upload_handler']) {
                this.tinymce['images_upload_handler'] = this.defaultImageUploadHandler;
            }
            this.value = this.$utils.getDeepValue(this.meta.field, this.model);
        },
        before() {

        },
        mounted() {
            tinymce.init({})
        },
        methods: {
            // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
            // 需要什么事件可以自己增加
            onClick (e) {
                this.meta.event.click(e, this.model, this.meta);
            },
            // 可以添加一些自己的自定义事件，如清空内容
            clear () {
                this.value = ''
            },
            defaultImageUploadHandler(blobInfo, success, failure) {
                const formData = this.getFormData(blobInfo.blob());

                this.spinning = true;
                this.$http.post(this.meta.config.action, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(resp=>{
                    success(resp.url);
                }).catch(reason => {
                    failure(reason);
                }).finally(()=>{
                    this.spinning = false;
                })
            },
            getFormData(blob) {
                let config = this.meta.config;
                let formData = new FormData;

                let name = config.name || 'file';
                formData.append(name, blob);

                // 静态参数
                let staticParams = config.params || {};
                Object.keys(staticParams).forEach(item => {
                    formData.append(item, staticParams[item]);
                });

                // 动态参数
                let fieldParams = config.fields || [];
                fieldParams.forEach(field => {
                    formData.append(field, this.$utils.getDeepValue(field, this.model))
                });

                return formData;
            }
        }
    }
</script>

<style scoped>

</style>
