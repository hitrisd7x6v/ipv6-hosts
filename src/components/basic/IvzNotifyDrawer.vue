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
                <div class="ivz-nt-pane" v-show="activityItem == 1">
                    <div class="ivz-ntp-item">
                        <ul class="ivz-ntp-header">
                            <li style="font-size: 15px; color: #000000">
                                <a-badge color="#f50"/>公司全体加班
                            </li>
                            <li>发送时间:2020-07-08</li>
                        </ul>
                        <div class="ivz-ntp-content">
                            <label>sdkfjjkdskfjdkjfksdjfkdkjfklsdkfjksdfjsjkdfhjksdfjksdfkjsdkfksdjfkdsjkdjk</label>
                        </div>
                        <ul class="ivz-ntp-footer">
                            <li>发送人: iteaj</li>
                            <li>类型:公告</li>
                            <li>等级:普通</li>
                        </ul>
                    </div>
                </div>
                <div class="ivz-nt-pane" v-show="activityItem == 2">
                    2
                </div>
                <div class="ivz-nt-pane" v-show="activityItem == 3">
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
    }
    .ivz-ntp-item {
        width: 100%;
        height: 128px;
        margin: 0px auto;
        position: relative;
        border-radius: 5px;
        background-color: #ffffff;
        box-shadow: 0px 0px 6px 0px #e8e8e8;
    }
    .ivz-ntp-header {
        margin: 0px;
        height: 36px;
        list-style: none;
        line-height: 36px;
        padding: 0px 16px;
    }
    .ivz-ntp-content {
        color: #afafaf;
        padding: 0px 8px;
        font-size: 14px;
        text-indent: 2em;
    }
    .ivz-ntp-header li:nth-child(1) {
        float: left;
    }
    .ivz-ntp-header li:nth-child(2) {
        float: right;
    }
    .ivz-ntp-footer {
        bottom: 0px;
        margin: 0px;
        width: 100%;
        height: 32px;
        padding: 0px 8px;
        display: flex;
        font-size: 13px;
        list-style: none;
        line-height: 32px;
        position: absolute;
        display: -webkit-flex;
        justify-content: space-between;
    }
    .ivz-ntp-footer li {

    }
</style>
