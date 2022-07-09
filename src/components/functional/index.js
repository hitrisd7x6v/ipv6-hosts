import {computed, h, reactive, resolveComponent} from 'vue'
const IvzButton = ({meta}, {slots}) => {
    return h(resolveComponent('a-button'), meta.props, slots)
}

export {IvzButton}
