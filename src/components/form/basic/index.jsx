import {computed, defineComponent, h, resolveComponent} from "vue";
import UForm from "@/components/form/basic/Form.jsx";
import MixinsFormItem from "@/components/form/basic/MixinsFormItem";
import MixinsOptionsItem from "@/components/form/basic/MixinsOptionsItem";

export const UInput = defineComponent({
    name: 'UInput',
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

export const UInputNumber = defineComponent({
    name: 'UInputNumber',
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
export const UInputPassword = defineComponent({
    name: 'UInputPassword',
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

export const UInputGroup = defineComponent({
    name: 'UInputGroup',
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

export const UTextarea = defineComponent({
    name: 'UTextarea',
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

export const UCheckbox = defineComponent({
    name: 'UCheckbox',
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

export const USwitch = defineComponent({
    name: 'USwitch',
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

export const URate = defineComponent({
    name: 'URate',
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

export const USelect = defineComponent({
    name: 'USelect',
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

export const USlider = defineComponent({
    name: 'USlider',
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
export const UCascader = defineComponent({
    name: 'UCascader',
    mixins: [MixinsFormItem, MixinsOptionsItem],
    render() {
        let props = this.getFormItemProps();

        return <a-col {...props}>
            <a-form-item {...props}>
                {<a-cascader {...this.getFormAttrs({options: this.dataSource})} v-slots={this.$slots}></a-cascader>}
            </a-form-item>
        </a-col>
    }

})
export const UAutoComplete = defineComponent({
    name: 'UAutoComplete',
    mixins: [MixinsFormItem, MixinsOptionsItem],
    render() {
        let props = this.getFormItemProps();

        return <a-col {...props}>
            <a-form-item {...props}>
                {<a-auto-complete {...this.getFormAttrs({options: this.dataSource})} v-slots={this.$slots}></a-auto-complete>}
            </a-form-item>
        </a-col>
    }
})

export const URadio = defineComponent({
    name: 'URadio',
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
export const UMentions = defineComponent({
    name: 'UMentions',
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
export const UTreeSelect = defineComponent({
    name: 'UTreeSelect',
    mixins: [MixinsFormItem, MixinsOptionsItem],
    render() {
        let props = this.getFormItemProps();
        return <a-col {...props}>
            <a-form-item {...props}>
                {<a-tree-select {...this.getFormAttrs()} treeData={this.dataSource} v-slots={this.$slots}></a-tree-select>}
            </a-form-item>
        </a-col>
    }

})

const typeMaps = {date: 'a-date-picker', month: 'a-month-picker'
    , range: 'a-range-picker', week: 'a-week-picker', time: 'a-time-picker'}
export const UDateTime = defineComponent({
    name: 'UDateTime',
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
export const UDatePicker = defineComponent({
    name: 'UDatePicker',
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
export const UMonthPicker = defineComponent({
    name: 'UMonthPicker',
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
export const UWeekPicker = defineComponent({
    name: 'UWeekPicker',
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
export const URangePicker = defineComponent({
    name: 'URangePicker',
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
export const UTimePicker = defineComponent({
    name: 'UTimePicker',
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
const formComponents = {UForm, UInput, USelect, UCheckbox, USwitch
    , URate, USlider, UInputNumber, UCascader, UAutoComplete, UInputPassword
    , URadio, UMentions, UDateTime, UTreeSelect, UTextarea, UInputGroup
    , UDatePicker, UMonthPicker, URangePicker, UTimePicker, UWeekPicker}

export default {
    install(app) {
        Object.values(formComponents).forEach(component => {
            app.component(component.name, component);
        })
    }
}
