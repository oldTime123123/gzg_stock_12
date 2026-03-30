<script setup lang="ts">
import { getLoanLogs } from '~/api/pay/realse';
const { t, locale } = useI18n();
const actRecordType = ref(0);
const recordTypeList = ref([
    t('record.r10'),
    t('record.r11'),
    t('record.r12'),
])
const pub = usePublicStore()
const pages = ref({
    page: 1,
    type: 1,
    size: 10,
})

// 1.借款 2.还款 3.利息
const showVanSkeletonLoading = ref(true)
const recordList = ref([])
const loading = ref(true)
const finished = ref(false)
const totalSize = ref(0)
const getRecordList = () => {

    getLoanLogs(pages.value).then(res => {
        totalSize.value = res.total
        recordList.value = recordList.value.concat(res.data)
    }).finally(() => {
        loading.value = false
        if (recordList.value.length == totalSize.value) {
            finished.value = true
        } else {
            pages.value.page++;
        }
        showVanSkeletonLoading.value = false
    })

}



onMounted(() => {
    getRecordList()
})

// 申请时是否需要输入密钥：1.需要 0.不需要
const showPop = ref(false)
const changeActType = index => {

    if (actRecordType.value == index) return
    if (index == 0) {
        pages.value.type = 1
    } else if(index == 1){
        pages.value.type = 2
    } else if (index == 2) {
        pages.value.type = 3
    }
    pub.showLoading = true
    actRecordType.value = index
    pages.value.page = 1
    totalSize.value = 0
    recordList.value = []
    finished.value = false
    loading.value = true
    getRecordList()
}

</script>

<template>
    <div>
        <second-page-nav-bar :title="$t('record.r13')"></second-page-nav-bar>

        <div class="mt-3 px-3">
            <div class="recordBoxEl mt-3 pb-2">
                <div class="grid grid-cols-3 text-center  recordTypeBoxEl">

                    <div class="cursor-pointer" v-for="(item, index) in recordTypeList"
                        :class="index == actRecordType ? 'actRecordEl' : ''" :key="index" @click="changeActType(index)">
                        {{ item }}
                    </div>

                </div>

                <div class="mt-3 px-3">
                    <div class="" v-if="recordList.length == 0">
                        <div class="nullData mt-10"></div>
                        <div class="text-lg mt-2 color text-blue-300 text-center">
                            {{$t('record.r14')}}
                        </div>
                    </div>
                    <div v-else>
                        <van-list v-model:loading="loading" :finished="finished" :error-text="' '" :loading-text="' '"
                            :finished-text="' '" @load="getRecordList">

                            <div class="p-3 text-center bg-[#ECF4FE] rounded-sm cursor-pointer mb-2"
                                v-for="(item, index) in recordList" :key="index" @click="actApplyInd = index">
                                <div class="flex mb-2 items-center  justify-between text-sm">
                                    <div>
                                        {{$t('record.r15')}}
                                    </div>
                                    <div
                                        :class="item.type == 1 ? 'text-[var(--colorUp)]' : item.type == 2 ? 'text-[var(--colorDown)]' : 'text-[var(--mainColor)]'">
                                        {{ item.type == 1?$t('record.r10'):item.type==2?$t('record.r11'):$t('record.r12')}}
                                    </div>
                                </div>
                                <!-- status:1.待审核 2.已通过 3.已驳回 -->

                                <div class="flex mb-2 items-center   justify-between text-sm" v-if="actRecordType<1">
                                    <div>
                                        {{ $t('record.r9') }}
                                    </div>
                                    <div
                                        :class="item.status == 1 ? 'text-[var(--colorUp)]' : item.status == 2 ? 'text-[var(--colorDown)]' : 'text-[var(--mainColor)]'">
                                        {{ item.status ==
                                            1 ? $t('setting.s32') : item.status==2?$t('setting.s33'):$t('comm.c85')}}
                                    </div>
                                </div>
                                <div class="flex mb-2 items-center   justify-between text-sm">
                                    <div>
                                        {{$t('record.r16')}}
                                    </div>
                                    <div>
                                        {{ item.amount }}
                                    </div>
                                </div>
                                <div class="flex items-center  justify-between text-sm">
                                    <div>
                                        {{$t('record.r17')}}
                                    </div>
                                    <div>
                                        {{ item.createTime }}
                                    </div>
                                </div>

                            </div>
                        </van-list>


                    </div>
                </div>
            </div>

        </div>

    </div>
</template>


<style lang="less" scoped>
.recordBoxEl {
    background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 11%);
    box-shadow: 0px 0px 6px 0px rgba(2, 26, 123, 0.14);
    border-radius: 10px;

    .recordTypeBoxEl {
        background: var(--mainColor);
        height: 34px;
        line-height: 34px;
        border-radius: 10px;
        position: relative;
        overflow: hidden;
        border: 1px solid var(--mainColor);
        color: #fff;

        .actRecordEl {
            color: var(--mainColor);
            background: #fff;
            border-radius: 10px;

        }
    }
}
</style>