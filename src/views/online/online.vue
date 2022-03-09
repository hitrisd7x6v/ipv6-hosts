<template>
    <div class="ivz-online-layout">
        <div class="ivz-online-header">
            <h2>ivzone 在线页面设计</h2>
        </div>
        <div class="ivz-online-body">
            <div class="ivz-ol-item ivz-oli-left">

            </div>
            <div class="ivz-ol-item ivz-oli-content">
                <vdr v-on:dragging="onDrag" v-on:resizing="onResize" :parent="true"
                     :onDragStart="onDragStartCallback"  :grid=[10,10] @ondrop="drop" @dragstop="onDragstop">
                    <p>ksdjf</p>
                </vdr>
            </div>
            <div class="ivz-ol-item ivz-oli-right">

            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "Online",
        data: function () {
            return {
                width: 0,
                height: 0,
                x: 0,
                y: 0
            }
        },
        methods: {
            onResize: function (x, y, width, height) {
                this.x = x
                this.y = y
                this.width = width
                this.height = height
            },
            onDrag: function (x, y) {
                this.x = x
                this.y = y
            },
            onDragStartCallback(ev) {
                console.log(ev)
            },
            onDragCallback(x, y) {

            },
            drop() {
                alert(3);
            },
            allowDrop(ev) {
                alert(4)
                ev.preventDefault();
            },
            onDragstop(x, y, z) {
                console.log(`${x} : ${y} : ${z}`)
            }
        }
    }
</script>

<style scoped>

</style>
