<template>
  <a-modal v-model:visible="visible" class="ivz-edit-modal ivz-edit-dialog"
    :maskClosable="maskClosable" :width="width" :destroyOnClose="destroyOnClose"
           :afterClose="afterClose" :centered="centered" :closable="closable"
           :bodyStyle="bodyStyle">
    <template #title>
      <slot name="title">{{title}}</slot>
    </template>
    <ivz-form>
      <slot></slot>
    </ivz-form>
    <template #footer>
      <slot name="fun">
        <template v-for="meta in funMetas" :key="meta.field">
          <ivz-button :meta="meta">{{meta.name}}</ivz-button>
        </template>
      </slot>
    </template>
  </a-modal>
</template>

<script>
import IvzForm from "@/components/form/basic/IvzForm";
export default {
  name: "IvzEditModal",
  components: {IvzForm},
  props: {
    title: String,
    visible: Boolean,
    bodyStyle: Object,
    afterClose: Function,
    centered: Boolean,
    destroyOnClose: Boolean,
    width: {type: String | Number},
    maskClosable: {default: false},
    closable: {type: Boolean, default: false},
    funMetas: {type: Array, default: () => []},
  },
  mounted() {

  },

}
</script>

<style scoped>

</style>
