<template>
    <div class="ivz-perm-form">
        <div>
            <ivz-icon type="iz-icon-jia" />
        </div>
        <a-input-group compact>
            <a-select default-value="1" style="width: 66px;">
                <a-select-option value="M">M</a-select-option>
                <a-select-option value="T">T</a-select-option>
                <a-select-option value="MM">MM</a-select-option>
                <a-select-option value="TM">TM</a-select-option>
                <a-select-option value="AM">AM</a-select-option>
            </a-select>
            <a-input style=" width: 74px; text-align: center" placeholder="权限名称" />
            <a-input style=" width: 16px; border-left: 0; pointer-events: none; backgroundColor: #fff"
                    placeholder="~" disabled />
            <a-input style="width: 74px; text-align: center; border-left: 0" placeholder="权限标识" />
        </a-input-group>
    </div>
</template>

<script>
    /*自定义权限功能点组件*/
    export default {
        name: "IvzPermForm"
    }
</script>

<style scoped>
 .ivz-perm-form .ant-input {
     padding: 4px 0px!important;
 }
</style>
