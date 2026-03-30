<script setup lang="ts">
import { getUserPaymentRecord } from '~/api/home/home';
const pub = usePublicStore();
const currency = pub.currency;

const { t } = useI18n()
const statusText: any = {
  0: t('fund.a2'),
  1: t('fund.a3'),
  2: t('fund.a4'),
  3: t('fund.a5'),
  4: t('xx.a1'),

}

const params = reactive({
  page: 1,
  limit: 10,
});

const items = ref(new Array())
const error = ref(false);
const loading = ref(false);
const finished = ref(false);

const fetchItemsList = () => {
  loading.value = true;
  finished.value = true;
  getUserPaymentRecord(params.page++, params.limit).then((res: any) => {
    items.value = items.value.concat(res.data);
    const bool = params.page > res.last_page;
    nextTick(() => {
      finished.value = bool;
    });
  }).catch(() => {
    error.value = true;
  }).finally(() => {
    loading.value = false;
  })
}
</script>

<template>
  <div v-if="finished && items.length == 0">
    <div class="nullData mt-10"></div>
    <div class="text-lg mt-2 color text-blue-300 text-center">
      {{ $t('comm.c65') }}
    </div>
  </div>
  <div v-else class="px-3 mt-4">
    <van-list v-model:loading="loading" v-model:error="error" :finished="finished" @load="fetchItemsList">
      <div class="bg-[#ECF4FE] mb-3 px-3 py-2 rounded-sm" v-for="(item, index) in items" :key="index">

        <div class="rounded-xl space-y-1 text-sm">
          <div class="flex justify-between items-center">
            <div>{{ $t('comm.c71') }}</div>
            <div>{{ item.order_no }}</div>
          </div>
          <!-- <div class="flex justify-between items-center">
                        <div>{{$t('comm.c72')}}</div>
                        <div>{{ item.channel.alias }}</div>
                    </div> -->
          <div class="flex justify-between items-center">
            <div>{{ $t('comm.c73') }}</div>
            <div>{{ UseExchangeNumber(item.amount) }}{{ item.currency }}</div>
          </div>
          <div class="flex justify-between items-center">
            <div>{{ $t('comm.c74') }}</div>
            <div>{{ UseExchangeNumber(item.arrive_amount) }}</div>
          </div>
          <div class="flex justify-between items-center" v-if="item.arrive_time && item.arrive_time !== '--'">
            <div>{{ $t('comm.c75') }}</div>
            <div>{{ item.arrive_time }}</div>
          </div>
          <div class="flex justify-between items-center">
            <div>{{ $t('comm.c76') }}</div>
            <div :class="{
              'text-green-400': item.status == 1,
              'text-orange-400': item.status == 0,
              'text-red-400': item.status > 1,
            }">
              {{ statusText[item.status] }}
            </div>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>
