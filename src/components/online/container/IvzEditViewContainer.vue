<template>
    <draggable :list="list" group="test">
        <div class="ivz-view-opera">EditView</div>
        <div v-for="item in list" :key="item.id">{{item.name}}</div>
    </draggable>
</template>

<script>
    import draggable from "vuedraggable";
    export default {
        name: "IvzEditViewContainer",
        components: {
            draggable
        },
        data() {
            return {
                list: [

                ]
            }
        }
    }
</script>

<style scoped>

</style>
