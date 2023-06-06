<template>
  <a-form-item :label="meta.label" :hasFeedback="config.hasFeedback"
       :labelCol="config.labelCol" :wrapperCol="config.wrapperCol"
       :extra="config.extra" :colon="config.colon" :rules="inner.rules"
       :labelAlign="config.labelAlign" :validateFirst="config.validateFirst">
    <a-date-picker if="inner.sub=='date'" :size="config.size" v-model:value="model[meta.field]"
       :format="config.format" :show-time="config.showTime" :ranges="config.ranges"
       :disabled-date="config.disabledDate" style="width: 100%"
       @change="change" :getCalendarContainer="config.getCalendarContainer"
       :blur="event.blur" :focus="event.focus" @ok="event.ok(model)"
       @openChange="openChange" :disabled="disabled"
       @panelChange="(value, mode) => panelChange({value, mode})">
    </a-date-picker>
    <a-range-picker v-else-if="inner.sub=='dateRange'" v-model:value="model[meta.field]"
        :format="config.format" :show-time="config.showTime" :ranges="config.ranges"
        :disabled-date="config.disabledDate" style="width: 100%" @ok="event.ok(model)"
        :blur="event.blur" :focus="event.focus" :size="config.size"
        @openChange="openChange" :disabled="disabled"
        @panelChange="(value, mode) => panelChange({value, mode})"
        @change="change" :getCalendarContainer="config.getCalendarContainer">
    </a-range-picker>
  </a-form-item>
</template>

<script>
import {commonFormData} from "./FormMixin";

export default {
  name: "IvzDateForm",
  props: ['meta', 'model'],
  mixins: [commonFormData],
  setup(props, ctx) {

  },
}
</script>

<style scoped>

</style>
