import {h, mergeProps, resolveComponent} from 'vue'

const IvzButton = ({meta}, {slots}) => {
    let mergeSlots = slots;
    if(meta.props.icon instanceof Function) {
        mergeSlots = {...slots, icon: meta.props.icon}
    }

    return h(resolveComponent('a-button'), meta.props, mergeSlots)
}

export {IvzButton}
