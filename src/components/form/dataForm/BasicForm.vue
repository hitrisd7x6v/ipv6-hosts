<template>
  <a-form-item :label="meta.label" :hasFeedback="config.hasFeedback"
       :labelCol="config.labelCol" :wrapperCol="config.wrapperCol"
       :extra="config.extra" :colon="config.colon" :rules="inner.rules"
       :labelAlign="config.labelAlign" :validateFirst="config.validateFirst">
    <a-input v-if="inner.sub='text'" v-model:value="model[meta.field]" :defaultValue="meta.default"
       :type="meta.type" :size="config.size" :prefix="config.prefix"
       :placeholder="meta.placeholder" :allowClear="meta.clear" :suffix="config.suffix"
       :disabled="disabled" @change="change" @pressEnter="pressEnter" @search="search">
    </a-input>
    <a-input-number v-else-if="inner.sub == 'number'" v-model:value="model[meta.field]" :size="config.size"
      :disabled="disabled" @change="change" :step="config.step" :min="config.min" :max="config.max"
      :formatter="config.formatter" :precision="config.precision" :parser="config.parser"
      :defaultValue="meta.default" style="width: 100%" :blur="event.blur" :focus="event.focus">
    </a-input-number>
    <a-checkbox v-else-if="inner.sub=='checkbox'" v-model:checked="model[meta.field]"
                :disabled="disabled" :autofocus="config.autofocus" @change="change"></a-checkbox>
    <a-radio v-else-if="inner.sub=='radio'" v-model:checked="meta.field"
             :autofocus="config.autofocus" @change="change" :disabled="disabled"></a-radio>
    <a-textarea v-else-if="inner.sub == 'textarea'" :placeholder="placeholder"
      @press-enter="pressEnter" @change="change" :disabled="disabled" v-model:value="model[meta.field]"
      :rows="config.rows" :blur="event.blur" :focus="event.focus" :autosize="config.autoSize">
    </a-textarea>
  </a-form-item>
</template>

<script>
import {commonFormData} from "./FormMixin";

export default {
  name: "UBasicForm",
  props: ['meta', 'model'],
  mixins: [commonFormData]
}
</script>

<style scoped>

</style>
