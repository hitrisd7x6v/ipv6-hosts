<template>
    <UView rowKey="jobName">
        <UViewSearch>
          <URow col="search">
            <UInput label="作业名" field="jobName" />
            <UFuncBtn func="query" url="/quartz/triggers/view">查询</UFuncBtn>
            <UFuncBtn func="add" url="/quartz/triggers/add">新增</UFuncBtn>
          </URow>
        </UViewSearch>
        <UViewTable :columns="columns" :scroll="{ x: '100%'}">
            <template #c_triggerState="{record}">
                <ABadge v-if="record.triggerState=='PAUSED'" color="purple" text="暂停" />
                <ABadge v-else-if="record.triggerState=='COMPLETE'" status="success" text="完成" />
                <ABadge v-else-if="record.triggerState=='ACQUIRED'" status="processing" text="执行中" />
                <ABadge v-else-if="record.triggerState=='ERROR'" status="error" text="错误" />
                <ATooltip v-else-if="record.triggerState=='WAITING'" placement="topLeft" title="等待下一次被调度">
                    <ABadge status="warning" text="等待" />
                </ATooltip>
                <ATooltip v-else placement="topLeft" title="等待上一次任务执行完成">
                    <ABadge status="default" text="阻塞" />
                </ATooltip>
            </template>
            <template #action="{record}">
                <UFuncTag func="edit" url="/quartz/triggers/edit" :data="record">修改</UFuncTag>
                <UFuncTag func="del" url="/quartz/triggers/del" :data="record">删除</UFuncTag>
                <UFuncTag func="exec" :url="`/quartz/triggers/${record.triggerState=='PAUSED' ? 'resume' : 'paused'}`" :data="record">
                    {{ record.triggerState=='PAUSED' ? '恢复' : '暂停' }}
                </UFuncTag>
                <UFuncTag func="exec" url="/quartz/triggers/run" :data="record">执行一次</UFuncTag>
            </template>
        </UViewTable>
        <UViewModal :span="[6, 16]" :rules="rules" width="500px">
            <template #default="{model}">
                <UInput field="jobName" label="作业名" :disabled="model.schedName ? true : false" />
                <UInput field="cron" label="cron" />
                <URadio field="concurrent" label="是否并发" :defaultValue="true" :options="BooleanStatus" help="指同一任务是否允许同时执行" />
                <UInput field="params.expression" label="执行方法" :disabled="model.schedName ? true : false" />
                <UTextarea field="description" label="说明" span="24" />
            </template>
            <template #title="{model}">
                <span>新增作业</span>
            </template>
            <template #footer="{model}">
                <UFuncBtn func="cancel">取消</UFuncBtn>
                <UFuncBtn func="submit" :url="model.schedName?'/quartz/triggers/edit':'/quartz/triggers/add'">提交</UFuncBtn>
                <UFuncBtn func="reset">重置</UFuncBtn>
            </template>
        </UViewModal>
    </UView>
</template>

<script>
import { reactive, ref } from "vue";
import { BooleanStatus } from '@/utils/StatusConsts'
export default {
    name: "Triggers",
    setup () {
        let rules = reactive({
            jobName: { required: true, message: '作业名必填' },
            cron: { required: true, message: 'cron必填' }
        })
        let state = [
            { label: '暂停', value: 'PAUSED' },
            { label: '完成', value: 'COMPLETE' },
            { label: '错误', value: 'ERROR' },
            { label: '等待', value: 'WAITING' },
            { label: '正常', value: 'ACQUIRED' },
            { label: '阻塞', value: 'BLOCKED' },
        ]
        let columns = ref([
            { field: 'jobName', title: '作业名', width: 200 },
            { field: 'cron', title: 'cron', width: 200 },
            { field: 'params.expression', title: '执行方法', width: 280 },
            { field: 'startTime', title: '开始时间', width: 150, type: 'date', ellipsis: true },
            { field: 'nextFireTime', title: '下次时间', width: 150, type: 'date', },
            { field: 'desc', title: '说明', width: 280, ellipsis: true },
            { field: 'triggerState', title: '状态', width: 100, fixed: 'right' },
            { field: 'action', type: 'action', title: '操作', width: 280, fixed: 'right' }
        ])
        return { columns, rules, BooleanStatus }
    },
    methods: {

    }
}
</script>

<style scoped>
</style>