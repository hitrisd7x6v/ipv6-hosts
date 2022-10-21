import {defineComponent, provide, ref} from "vue";
import {RowContextKey} from "@/utils/ProvideKeys";
export const IvzRow = defineComponent({
    name: 'IvzRow',
    props: ['span'],
    setup(props) {
        provide(RowContextKey, {
            span: props.span
        })
    },
    render() {
        return <a-row {...this.$attrs} v-slots={this.$slots} />
    }
})
