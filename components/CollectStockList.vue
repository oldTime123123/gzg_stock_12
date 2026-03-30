<script setup lang="ts">
import { getCollectList } from '~/api/home/home';

const params = reactive({
  page: 1,
  limit: 10,
});

const showSkeleton = ref(true)
const items = ref(new Array())
const error = ref(false);
const loading = ref(false);
const finished = ref(false);
const totalSize = ref(0)
const fetchItemsList = () => {
  loading.value = true;
  finished.value = true;

  getCollectList(params.page, params.limit).then((res: any) => {
    if (params.page == 1) {
      items.value = res.data
    } else {
      items.value = items.value.concat(res.data);
    }
    totalSize.value = res.total
    // const bool = params.page > res.last_page;
    // nextTick(() => {
    //     finished.value = bool;
    // });
  }).finally(() => {
    loading.value = false
    if (items.value.length == totalSize.value) {
      finished.value = true
    } else {
      params.page++;
    }
    showSkeleton.value = false
  })
}

const deleteStock = (data) => {
  const index = items.value.findIndex(item => item.pid === data.pid)
  if (index !== -1) {
    items.value.splice(index, 1)
  }
}
const emit = defineEmits()
const changeDataType = () => {
  emit('changeDataType', '0')
}
</script>

<template>
  <div>
    <div v-if="finished && items.length == 0 && !showSkeleton">
      <div class="nullData mt-10"></div>
      <div class="text-lg mt-2 color text-blue-300 text-center">
        {{ $t('comm.c4') }}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4" v-else-if="showSkeleton">
        <div class="h-[100px] bg-[#dce8f9] rounded-sm mb-2" v-for="(item, index) in 4" :key="index">
        </div>
    </div>
    <div >
      <van-list v-model:loading="loading" v-model:error="error" :finished="finished" @load="fetchItemsList">
        <div class="grid grid-cols-2 gap-4">
          <CollectStockItem v-for="(item, index) in items" :key="item.pid" :data="item" @deleteStock="deleteStock" />
        </div>
      </van-list>
    </div>

    <div class="contentBtn mt-3">
      <div class="flex items-center justify-center w-full" @click="changeDataType">
        <span> {{ $t('comm.c5') }}</span>
        <Icon name="material-symbols:add-circle-rounded" size="20" class="text-amber-300 ml-1" />
      </div>
    </div>
  </div>
</template>
