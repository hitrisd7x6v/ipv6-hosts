import {computed, h, reactive, resolveComponent} from 'vue'
const IvzButton = ({meta}, {slots}) => {
    let props = {
        ghost: meta.ghost,
        icon: meta.icon,
        size: meta.size,
        type: meta.type,
        block: meta.block,
        shape: meta.shape,
        loading: meta.loading,
        disabled: meta.disabled,
        onClick: meta.onClick,
        htmlType: meta.htmlType
    }
    return h(resolveComponent('a-button'), props, slots)
}

export {IvzButton}
