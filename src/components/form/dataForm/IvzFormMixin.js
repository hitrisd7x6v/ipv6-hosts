import {computed} from 'vue'
export const commonFormData = {
    setup(props, ctx) {
        let {config, event, inner} = props.meta;
        const disabled = computed(()=>{
            return props.meta.disabled;
        });
        return {config, event, inner, disabled};
    },
    methods: {
        blur(e) {
            this.handleEvent(e, this.event.blur);
        },
        focus(e) {
            this.handleEvent(e, this.event.focus);
        },
        select(val) {
            this.handleEvent(val, this.event.select);
        },
        change(val) {
            this.handleEvent(val, this.event.change);
        },
        deselect(val) {
            this.handleEvent(val, this.event.deselect);
        },
        search(val) {
            this.handleEvent(val, this.event.search);
        },
        treeExpand(val) {
            this.handleEvent(val, this.event.treeExpand);
        },
        keydown(e) {
            this.handleEvent(e, this.event.keydown);
        },
        inputKeydown(e) {
            this.handleEvent(e, this.event.inputKeydown);
        },
        pressEnter(e) {
            this.handleEvent(e, this.event.pressEnter);
        },
        openChange(status) {
            this.handleEvent(status, this.event.openChange);
        },
        afterChange(val) {
            this.handleEvent(val, this.event.afterChange);
        },
        panelChange(val) {
            this.handleEvent(val, this.event.panelChange);
        },
        hoverChange(val) {
            this.handleEvent(val, this.event.hoverChange)
        },
        handleEvent(val, fun) {
            if(typeof fun == 'function') {
                fun(val, this.model, this.meta);
            }
        }
    }
}
