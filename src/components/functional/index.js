import {h, mergeProps, resolveComponent} from 'vue'

const IvzButton = ({meta}, {slots}) => {
    let mergeSlots = meta.props.slots;
    if(mergeSlots instanceof Object) {
        Object.assign(mergeSlots, slots)
    } else {
        mergeSlots = slots;
    }

    return h(resolveComponent('a-button'), meta.props, mergeSlots)
}

export {IvzButton}
