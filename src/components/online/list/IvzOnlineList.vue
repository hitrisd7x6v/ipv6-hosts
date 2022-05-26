<template>
    <a-list item-layout="horizontal" :data-source="dataSource" @click="activeHandle()">
        <a-list-item  slot="renderItem" slot-scope="item, index">
            <a-list-item-meta
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            >
                <a slot="title" href="https://www.antdv.com/">{{ item.title }}</a>
                <a-avatar
                        slot="avatar"
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
            </a-list-item-meta>
        </a-list-item>
    </a-list>
</template>

<script>
    import {mixListItem} from "./MixinListItem"
    export default {
        name: "IvzOnlineList",
        mixins: [mixListItem],
        data() {
            return {
                dataSource: [
                    {
                        title: 'Title 1',
                    },
                    {
                        title: 'Title 1',
                    },
                    {
                        title: 'Title 1',
                    }
                ]
            }
        }
    }
</script>

<style scoped>

</style>
