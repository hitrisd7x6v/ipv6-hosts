<template>
	<div class="ivz-list-item" :style="{width: meta.w - 1 +'px', height: meta.h - 1 +'px', position: 'relative'}">
		<ivz-list-card v-if="meta.type == 'card'" :meta="meta" :global="global"></ivz-list-card>
		<ivz-list-img v-else-if="meta.type == 'img'" :meta="meta" :global="global" />
		<ivz-list-avatar v-else-if="meta.type=='avatar'" :meta="meta" :global="global" />
		<ivz-list-table v-else-if="meta.type == 'table'" :meta="meta" :global="global" />
		<ivz-online-list v-else-if="meta.type == 'list'" :meta="meta" :global="global" />
		<ivz-list-label v-else-if="meta.type == 'label'" :meta="meta" :global="global" />
		<ivz-list-comment v-else-if="meta.type == 'comment'" :meta="meta" :global="global" />
		<ivz-list-timeline v-else-if="meta.type == 'timeline'" :meta="meta" :global="global" />
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
	import IvzListLabel from "@/components/online/list/IvzListLabel";
	import IvzListImg from "@/components/online/list/IvzListImg";
    export default {
        name: "IvzListItem",
        components: {
			IvzListImg,
			IvzListLabel,
			IvzListTimeline, IvzListAvatar, IvzListTable, IvzListComment, IvzOnlineList, IvzListCard},
        props: ['meta', 'global'],
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
	.ivz-list-item {
		text-align: center;
		margin: 0px auto;
	}
</style>
