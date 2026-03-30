<script setup lang="ts">
import { getTradeProduct } from '~/api/home/home';

const params = reactive({
  vol: 1,
  size: 10,
});

const items = ref(new Array())
const error = ref(false);
const loading = ref(false);
const finished = ref(false);
const showSkeleton = ref(true)
const fetchItemsList = () => {
  loading.value = true;
  finished.value = true;
  getTradeProduct(params).then((rows: any) => {
    items.value = rows;
  }).catch(() => {
    error.value = true;
  }).finally(() => {
    showSkeleton.value = false
    loading.value = false;
  })
}

onMounted(() => {
  fetchItemsList();
});
</script>

<template>
  <div>
    <div v-if="finished && items.length == 0 && !showSkeleton">
      <div class="nullData mt-10"></div>
      <div class="text-lg mt-2 color text-blue-300 text-center">
        {{ $t('comm.c65') }}
      </div>
    </div>
    <div v-if="showSkeleton">
        <div class="h-[130px] bg-[#dce8f9] rounded-sm mb-2" v-for="(item, index) in 4" :key="index">
        </div>
    </div>
    <van-list  v-model:loading="loading" v-model:error="error" :finished="finished" @load="fetchItemsList">
      <MarketRecordItem v-for="(item, index) in items" :key="index" :data="item" />

    </van-list>
  </div>
</template>
