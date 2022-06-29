<template>
  <a-form-item :label="meta.label" :hasFeedback="config.hasFeedback"
       :labelCol="config.labelCol" :wrapperCol="config.wrapperCol"
       :extra="config.extra" :colon="config.colon" :rules="inner.rules"
       :labelAlign="config.labelAlign" :validateFirst="config.validateFirst">
    <a-slider v-if="inner.sub=='slider'" v-model:value="model[meta.field]" :disabled="disabled"
          :dots="config.dots" :marks="config.marks" :min="config.min" :max="config.max"
          :tooltipVisible="config.tooltipVisible" :tipFormatter="config.tipFormatter"
          :blur="event.blur" :focus="event.focus" @change="change" :range="config.range"
          @afterChange="afterChange" :step="config.step">
    </a-slider>
    <a-rate v-else-if="inner.sub == 'rate'" :allowClear="clear" :allowHalf="config.allowHalf"
          v-model:value="model[meta.field]" :count="config.count" @change="change"
          :disabled="disabled" :tooltips="config.tooltips" @keydown="keydown"
          @hoverChange="hoverChange" :blur="event.blur" :focus="event.focus">
    </a-rate>
    <a-switch v-else-if="inner.sub=='switch'" v-model:checked="model[meta.field]"
          :checkedChildren="config.checkedChildren" :unCheckedChildren="config.unCheckedChildren"
          :loading="config.loading" :size="config.size" style="margin-bottom:5px" :disabled="disabled"
          @change="change" :blur="event.blur" :focus="event.focus" @click="event.click">
    </a-switch>
    <a-mentions v-else-if="inner.sub=='mentions'" v-model:value="model[meta.field]" :placement="config.placement"
          :disabled="disabled" :defaultValue="meta.default" :filterOption="config.filterOption" :prefix="config.prefix"
          :split="config.split" :validateSearch="config.validateSearch" :getPopupContainer="config.getPopupContainer"
          @change="change" @select="select" @focus="focus" @blur="blur" @search="search">
      <a-mentions-option v-for="item in meta.data" :key="item.value"
                 :value="item.value">{{item.label}}</a-mentions-option>
    </a-mentions>
  </a-form-item>
</template>

<script>
import {commonFormData} from "./IvzFormMixin";

export default {
  name: "IvzOtherForm",
  props: ['meta', 'model'],
  mixins: [commonFormData]
}
</script>

<style scoped>

</style>
