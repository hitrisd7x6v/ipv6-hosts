<template>
	<div style="position: relative">
		<div>
			<ivz-list-card v-if="meta.type == 'card'" :meta="meta" :model="model"></ivz-list-card>
			<ivz-list-avatar v-else-if="meta.type=='avatar'" :meta="meta" :model="model" />
			<ivz-list-table v-else-if="meta.type == 'table'" :meta="meta" :model="model" />
			<ivz-online-list v-else-if="meta.type == 'list'" :meta="meta" :model="model" />
			<ivz-list-comment v-else-if="meta.type == 'comment'" :meta="meta" :model="model" />
			<ivz-list-timeline v-else-if="meta.type == 'timeline'" :meta="meta" :model="model" />
		</div>
		<div class="ivz-item-opera">
			<span class="ivz-io-icon" @click.stop="delItem">
				<ivz-icon type="iz-icon-delete" :style="{color: '#ffffff', fontSize: '18px'}"></ivz-icon>
			</span>
		</div>
	</div>
</template>

<script>
    import IvzListCard from "@/components/online/list/IvzListCard";
    import IvzListTable from "@/components/online/list/IvzListTable";
    import IvzOnlineList from "@/components/online/list/IvzOnlineList";
    import IvzListComment from "@/components/online/list/IvzListComment";
    import IvzListAvatar from "@/components/online/list/IvzListAvatar";
    import IvzListTimeline from "@/components/online/list/IvzListTimeline";
    export default {
        name: "IvzListItem",
        components: {IvzListTimeline, IvzListAvatar, IvzListTable, IvzListComment, IvzOnlineList, IvzListCard},
        props: ['meta'],
        data() {
            return {
                model: {}
            }
        },
		methods: {
			delItem() {
				this.$emit("delMetaItem", this.meta);
			}
		}
    }
</script>

<style scoped>

</style>
