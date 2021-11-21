const CacheApi = window.parent.CacheApi || {}
export const MixError = {

    methods: {
        back() {
            CacheApi.closeAndBack();
        }
    }
}
