<template>
    <a-comment @click="activeHandle()">
        <span slot="actions" key="comment-nested-reply-to">Reply to</span>
        <a slot="author">Han Solo</a>
        <a-avatar
                slot="avatar"
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="Han Solo"
        />
        <p slot="content">
            We supply a series of design principles, practical patterns and high quality design resources
            (Sketch and Axure).
        </p>
        <a-comment>
            <span slot="actions">Reply to</span>
            <a slot="author">Han Solo</a>
            <a-avatar
                    slot="avatar"
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    alt="Han Solo"
            />
            <p slot="content">
                We supply a series of design principles, practical patterns and high quality design
                resources (Sketch and Axure).
            </p>
        </a-comment>
    </a-comment>
</template>

<script>
    import {mixListItem} from "./MixinListItem"
    export default {
        name: "IvzListTable",
        mixins: [mixListItem]
    }
</script>

<style scoped>

</style>
