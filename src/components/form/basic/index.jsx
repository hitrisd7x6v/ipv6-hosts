import {defineComponent, h, mergeProps, resolveComponent} from "vue";
import MixinsFormItem from "@/components/form/basic/MixinsFormItem";
import IvzForm from "@/components/form/basic/IvzForm";
import MixinsOptionsItem from "@/components/form/basic/MixinsOptionsItem";
const IvzInput = defineComponent({
    name: 'IvzInput',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return h(resolveComponent('a-form-item'), props, () => {
            let attrs = this.getFormAttrs()
            return this.$slots.default ? this.$slots.default() :
                h(resolveComponent('a-input'), attrs, {...this.$slots})
        })
    }

})

const IvzInputNumber = defineComponent({
    name: 'IvzInputNumber',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return h(resolveComponent('a-form-item'), props, () => {
            let attrs = this.getFormAttrs({style: {width: '100%'}});
            return h(resolveComponent('a-input-number'), attrs)
        })
    }

})

const IvzTextarea = defineComponent({
    name: 'IvzTextarea',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return h(resolveComponent('a-form-item'), props, () => {
            let attrs = this.getFormAttrs()
            return this.$slots.default ? this.$slots.default() :
                h(resolveComponent('a-textarea'), attrs, {...this.$slots})
        })
    }

})

const IvzCheckbox = defineComponent({
    name: 'IvzCheckbox',
    mixins: [MixinsFormItem, MixinsOptionsItem],
    render() {

        let slots = this.$slots.default  ? () => {
            return this.$slots.default()
        } : () => {
            let attrs = this.getFormAttrs();
            return h(resolveComponent('a-checkbox'), attrs, () => this.$slots)
        }

        let props = this.getFormItemProps();
        return h(resolveComponent('a-form-item'), props, slots)
    }

})

const IvzSwitch = defineComponent({
    name: 'IvzSwitch',
    mixins: [MixinsFormItem],
    render() {

        let props = this.getFormItemProps();
        return h(resolveComponent('a-form-item'), props, () => {
            let attrs = this.getCheckedAttrs();
            return h(resolveComponent('a-switch'), attrs, {...this.$slots})
        })
    }

})

const IvzRate = defineComponent({
    name: 'IvzRate',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return h(resolveComponent('a-form-item'), props, () => {
            let attrs = this.getFormAttrs();
            return h(resolveComponent('a-rate'), attrs, [])
        })
    }

})

const IvzSelect = defineComponent({
    name: 'IvzSelect',
    mixins: [MixinsFormItem, MixinsOptionsItem],
    render() {
        let props = this.getFormItemProps();
        return h(resolveComponent('a-form-item'), props, () => {
            let attrs = this.getFormAttrs({options: this.dataSource});
            return h(resolveComponent('a-select'), attrs, {...this.$slots})
        })
    }
})

const IvzSlider = defineComponent({
    name: 'IvzSlider',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return h(resolveComponent('a-form-item'), props, () => {
            let attrs = this.getFormAttrs();
            return h(resolveComponent('a-slider'), attrs, {...this.$slots})
        })
    }

})
const IvzCascader = defineComponent({
    name: 'IvzCascader',
    mixins: [MixinsFormItem, MixinsOptionsItem],
    render() {
        let props = this.getFormItemProps();
        return h(resolveComponent('a-form-item'), props, () => {
            let attrs = this.getFormAttrs();
            return h(resolveComponent('a-cascader'), attrs, {...this.$slots})
        })
    }

})
const IvzAutoComplete = defineComponent({
    name: 'IvzAutoComplete',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return h(resolveComponent('a-form-item'), props, () => {
            let attrs = this.getFormAttrs();
            return h(resolveComponent('a-auto-complete'), attrs, {...this.$slots})
        })
    }

})

const IvzRadio = defineComponent({
    name: 'IvzRadio',
    mixins: [MixinsFormItem, MixinsOptionsItem],
    render() {
        let slots = this.$slots.default ? () => {
            return this.$slots.default()
        } : () => {
            let attrs = this.getFormAttrs({options: this.dataSource});
            return h(resolveComponent('a-radio-group'), attrs)
        }

        let props = this.getFormItemProps();
        return h(resolveComponent('a-form-item'), props, slots)
    }

})
const IvzMentions = defineComponent({
    name: 'IvzMentions',
    mixins: [MixinsFormItem],
    render() {

        let slots = () => {
            let mentionsSlots = this.$slots.default;
            if(this.$attrs.options && !this.$slots.default) {
                let slots = [];
                this.$attrs.options.forEach(option => {
                    slots.push(h(resolveComponent('a-mentions-option')
                        , {value: option.value}, option.value))
                })

                mentionsSlots = () => slots;
            }

            let attrs = this.getFormAttrs();
            return h(resolveComponent('a-mentions'), attrs, mentionsSlots)
        }

        let props = this.getFormItemProps();
        return h(resolveComponent('a-form-item'), props, slots)
    }

})
const IvzTreeSelect = defineComponent({
    name: 'IvzTreeSelect',
    mixins: [MixinsFormItem, MixinsOptionsItem],
    render() {
        let props = this.getFormItemProps();
        return h(resolveComponent('a-form-item'), props, () => {
            let attrs = this.getFormAttrs({treeData: this.dataSource});
            return h(resolveComponent('a-tree-select'), attrs, {...this.$slots})
        })
    }

})

const typeMaps = {date: 'a-date-picker', month: 'a-month-picker'
    , range: 'a-range-picker', week: 'a-week-picker', time: 'a-time-picker'}
const IvzDateTime = defineComponent({
    name: 'IvzDateTime',
    props: ['picker'],
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        let tag = typeMaps[this.$props['picker']] || 'a-date-picker';
        return h(resolveComponent('a-form-item'), props, () => {
            let attrs = this.getFormAttrs();
            return h(resolveComponent(tag), attrs, this.$slots)
        })
    }

})

const formComponent = {IvzForm, IvzInput, IvzSelect, IvzCheckbox, IvzSwitch
    , IvzRate, IvzSlider, IvzInputNumber, IvzCascader, IvzAutoComplete
    , IvzRadio, IvzMentions, IvzDateTime, IvzTreeSelect, IvzTextarea}

export default {
    install(app) {
        Object.keys(formComponent).forEach(name => {
            app.component(name, formComponent[name])
        })
    }
}
