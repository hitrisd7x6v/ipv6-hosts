import {defineComponent, h, resolveComponent} from "vue";
import IvzForm from "@/components/form/basic/IvzForm";
import MixinsFormItem from "@/components/form/basic/MixinsFormItem";
import MixinsOptionsItem from "@/components/form/basic/MixinsOptionsItem";

export const IvzInput = defineComponent({
    name: 'IvzInput',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return <a-col {...props}>
            <a-form-item {...props}>
                {<a-input {...this.getFormAttrs()} v-slots={this.$slots}></a-input>}
            </a-form-item>
        </a-col>
    }

})

export const IvzInputNumber = defineComponent({
    name: 'IvzInputNumber',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return <a-col {...props}>
            <a-form-item {...props}>
                {<a-input-number {...this.getFormAttrs({style: {width: '100%'}})} v-slots={this.$slots}></a-input-number>}
            </a-form-item>
        </a-col>
    }

})
export const IvzInputPassword = defineComponent({
    name: 'IvzInputPassword',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return <a-col {...props}>
            <a-form-item {...props}>
                {<a-input-password {...this.getFormAttrs()} v-slots={this.$slots}></a-input-password>}
            </a-form-item>
        </a-col>
    }
})

export const IvzInputGroup = defineComponent({
    name: 'IvzInputGroup',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();

        return <a-col {...props}>
            <a-form-item {...props}>
                <a-input-group {...this.$attrs} compact>
                    {this.$slots.default ? this.$slots.default(this.formContext.getEditModel(), this.formContext) : []}
                </a-input-group>
            </a-form-item>
        </a-col>
    }
})

export const IvzTextarea = defineComponent({
    name: 'IvzTextarea',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return <a-col {...props}>
            <a-form-item {...props}>
                <a-textarea {...this.getFormAttrs()}></a-textarea>
            </a-form-item>
        </a-col>
    }

})

export const IvzCheckbox = defineComponent({
    name: 'IvzCheckbox',
    mixins: [MixinsFormItem, MixinsOptionsItem],
    setup(props, {slots}) {
        let defaultSlots
        if(props.options instanceof Array || props.dict || props.url) {
            defaultSlots = (attrs) => h(resolveComponent('a-checkbox-group'), attrs, slots.default)
        } else {
            defaultSlots = (attrs) => h(resolveComponent('a-checkbox'), attrs, slots.default)
        }

        return {defaultSlots}
    },
    render() {
        let props = this.getFormItemProps();

        return <a-col {...props}>
            <a-form-item {...props}>
                {this.defaultSlots(this.getFormAttrs({options: this.dataSource}))}
            </a-form-item>
        </a-col>
    }

})

export const IvzSwitch = defineComponent({
    name: 'IvzSwitch',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return <a-col {...props}>
            <a-form-item {...props}>
                {<a-switch {...this.getCheckedAttrs()} v-slots={this.$slots}></a-switch>}
            </a-form-item>
        </a-col>
    }

})

export const IvzRate = defineComponent({
    name: 'IvzRate',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return <a-col {...props}>
            <a-form-item {...props}>
                {<a-rate {...this.getFormAttrs()} v-slots={this.$slots}></a-rate>}
            </a-form-item>
        </a-col>
    }

})

export const IvzSelect = defineComponent({
    name: 'IvzSelect',
    mixins: [MixinsFormItem, MixinsOptionsItem],
    render() {
        let props = this.getFormItemProps();
        return <a-col {...props}>
            <a-form-item {...props}>
                {<a-select {...this.getFormAttrs({options: this.dataSource})} v-slots={this.$slots}></a-select>}
            </a-form-item>
        </a-col>
    }
})

export const IvzSlider = defineComponent({
    name: 'IvzSlider',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();

        return <a-col {...props}>
            <a-form-item {...props}>
                {<a-slider {...this.getFormAttrs()} v-slots={this.$slots}></a-slider>}
            </a-form-item>
        </a-col>
    }

})
export const IvzCascader = defineComponent({
    name: 'IvzCascader',
    mixins: [MixinsFormItem, MixinsOptionsItem],
    render() {
        let props = this.getFormItemProps();

        return <a-col {...props}>
            <a-form-item {...props}>
                {<a-cascader {...this.getFormAttrs()} v-slots={this.$slots}></a-cascader>}
            </a-form-item>
        </a-col>
    }

})
export const IvzAutoComplete = defineComponent({
    name: 'IvzAutoComplete',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();

        return <a-col {...props}>
            <a-form-item {...props}>
                {<a-auto-complete {...this.getFormAttrs()} v-slots={this.$slots}></a-auto-complete>}
            </a-form-item>
        </a-col>
    }

})

export const IvzRadio = defineComponent({
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

        return <a-col {...props}>
            <a-form-item {...props}>{slots()}</a-form-item>
        </a-col>
    }

})
export const IvzMentions = defineComponent({
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
export const IvzTreeSelect = defineComponent({
    name: 'IvzTreeSelect',
    mixins: [MixinsFormItem, MixinsOptionsItem],
    render() {
        let props = this.getFormItemProps();

        return <a-col {...props}>
            <a-form-item {...props}>
                {<a-tree-select {...this.getFormAttrs({treeData: this.dataSource})} v-slots={this.$slots}></a-tree-select>}
            </a-form-item>
        </a-col>
    }

})

const typeMaps = {date: 'a-date-picker', month: 'a-month-picker'
    , range: 'a-range-picker', week: 'a-week-picker', time: 'a-time-picker'}
export const IvzDateTime = defineComponent({
    name: 'IvzDateTime',
    props: ['picker'],
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        let tag = typeMaps[this.$props['picker']] || 'a-date-picker';

        return <a-col {...props}>
            <a-form-item {...props}>
                {h(resolveComponent(tag), this.getFormAttrs(), this.$slots)}
            </a-form-item>
        </a-col>
    }
})
export const IvzDatePicker = defineComponent({
    name: 'IvzDatePicker',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return <a-col {...props}>
            <a-form-item {...props}>
                <ADatePicker {...this.getFormAttrs()} v-slots={this.$slots}/>
            </a-form-item>
        </a-col>
    }
})
export const IvzMonthPicker = defineComponent({
    name: 'IvzMonthPicker',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return <a-col {...props}>
            <a-form-item {...props}>
                <AMonthPicker {...this.getFormAttrs()} v-slots={this.$slots}/>
            </a-form-item>
        </a-col>
    }
})
export const IvzWeekPicker = defineComponent({
    name: 'IvzWeekPicker',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return <a-col {...props}>
            <a-form-item {...props}>
                <AWeekPicker {...this.getFormAttrs()} v-slots={this.$slots}/>
            </a-form-item>
        </a-col>
    }
})
export const IvzRangePicker = defineComponent({
    name: 'IvzRangePicker',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return <a-col {...props}>
            <a-form-item {...props}>
                <ARangePicker {...this.getFormAttrs()} v-slots={this.$slots}/>
            </a-form-item>
        </a-col>
    }
})
export const IvzTimePicker = defineComponent({
    name: 'IvzTimePicker',
    mixins: [MixinsFormItem],
    render() {
        let props = this.getFormItemProps();
        return <a-col {...props}>
            <a-form-item {...props}>
                <ATimePicker {...this.getFormAttrs()} v-slots={this.$slots}/>
            </a-form-item>
        </a-col>
    }
})
const formComponents = {IvzForm, IvzInput, IvzSelect, IvzCheckbox, IvzSwitch
    , IvzRate, IvzSlider, IvzInputNumber, IvzCascader, IvzAutoComplete, IvzInputPassword
    , IvzRadio, IvzMentions, IvzDateTime, IvzTreeSelect, IvzTextarea, IvzInputGroup
    , IvzDatePicker, IvzMonthPicker, IvzRangePicker, IvzTimePicker, IvzWeekPicker}

export default {
    install(app) {
        Object.values(formComponents).forEach(component => {
            app.component(component.name, component);
        })
    }
}
