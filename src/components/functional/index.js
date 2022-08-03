import {h, mergeProps, resolveComponent} from 'vue'

const IvzButton = ({meta}, {slots}) => {
    let mergeSlots = slots;
    if(meta.props.icon) {
        mergeSlots = {...slots, icon: () => h(resolveComponent('ivz-icon')
                , {type: meta.props.icon}, [])}
    }

    return h(resolveComponent('a-button'), meta.props, mergeSlots)
}

export {IvzButton}
