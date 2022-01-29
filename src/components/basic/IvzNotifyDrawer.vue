<template>
    <a-drawer @close="close" :closable="false" :width="460"
              placement="right" get-container="#slider-drawer"
              :visible="notifyVisible" :headerStyle="{height: '0px'}">
        <div class="ivz-nt-content">
            <div class="ivz-nt-header" style="text-align: center">
                <a-button-group>
                    <a-button @click="activityItem = 1">
                        <a-icon type="notification" />通知
                    </a-button>
                    <a-button @click="activityItem = 2">
                        <a-icon type="bell" />提醒
                    </a-button>
                    <a-button @click="activityItem = 3">日程</a-button>
                </a-button-group>
            </div>
            <div class="ivz-nt-body">
                <div class="ivz-nt-item" v-show="activityItem == 1">
                    1
                </div>
                <div class="ivz-nt-item" v-show="activityItem == 2">
                    2
                </div>
                <div class="ivz-nt-item" v-show="activityItem == 3">
                    3
                </div>
            </div>
        </div>
    </a-drawer>
</template>

<script>
    export default {
        name: "IvzNotifyDrawer",
        data() {
            return  {
                activityItem: 1,
                notifyVisible: false
            }
        },
        methods: {
            open() {
                this.notifyVisible = true;
            },
            close() {
                this.notifyVisible = false;
            },
            toggle() {
                this.notifyVisible = !this.notifyVisible;
            }
        }
    }
</script>

<style scoped>
    .ivz-nt-content {
        width: 100%;
    }
    .ivz-nt-body {
        width: 100%;
        height: 300px;
        margin-top: 16px;
        background-color: #ffffff;
        border: 1px solid #606266;
    }
</style>
