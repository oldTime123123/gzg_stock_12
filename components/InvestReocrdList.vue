<script setup lang="ts">
import { usePublicStore } from '../stores/publicData';
import InvestReocrdItem from './InvestReocrdItem.vue';
import InvestReocrdItem2 from './InvestReocrdItem2.vue';
import InvestReocrdItem3 from './InvestReocrdItem3.vue';

import { getTradeDealLog } from '~/api/trade';
const props = defineProps({
    type: {
        type: Number,
        required: true,
    },
})

const params = reactive({
    page: 1,
    limit: 10,
});

const items = ref(new Array())
const error = ref(false);
const loading = ref(false);
const finished = ref(false);
const showSkeleton = ref(true)
const fetchItemsList = () => {
    loading.value = true;
  finished.value = true;
    showSkeleton.value = true
    getTradeDealLog(params.page++, params.limit, typeDetail.value).then((res: any) => {
        items.value = items.value.concat(res.data);
        const bool = params.page > res.last_page;
        nextTick(() => {
            finished.value = bool;
        });
    }).catch(() => {
        error.value = true;
    }).finally(() => {
      loading.value = false;
        showSkeleton.value = false
    })
}

// 按照index 312
const ItemComponent = computed(() => props.type == 1 ? InvestReocrdItem : props.type == 2 ? InvestReocrdItem2 : InvestReocrdItem3);

const pub = usePublicStore()
const typeDetail = computed(() => {
  return pub.actRecordType
})
watch(typeDetail, (val) => {
  params.page = 1;
  items.value.length = 0;
  fetchItemsList();
})

const emit = defineEmits()
const updateRecordHandle = () => {
    params.page = 1;
    items.value.length = 0;
  fetchItemsList();
    emit('updateUserBalance')
}
onMounted(() => {
    fetchItemsList();
})
</script>
<template>
    <div>
        <div v-if="finished && items.length == 0 && !showSkeleton">
            <div class="nullData"></div>
            <div class="text-lg mt-2 color text-blue-300 text-center">
                {{$t('comm.c65')}}
            </div>
        </div>
        <div v-if="showSkeleton">
           <div class="h-[130px] bg-[#dce8f9] rounded-sm mb-2" v-for="(item, index) in 4" :key="index">
      </div>
        </div>
        <div >
            <van-list v-model:loading="loading" :finished="finished" @load="fetchItemsList">
                <ItemComponent v-for="(item, index) in items" :key="index" :data="item"
                    @updateRecordHandle="updateRecordHandle" />
            </van-list>
        </div>
    </div>
</template>


<style lang="less" scoped>
.recordItemEl {
    box-shadow: 0px 2px 6px 0px rgba(2, 26, 123, 0.2);
}
</style>
