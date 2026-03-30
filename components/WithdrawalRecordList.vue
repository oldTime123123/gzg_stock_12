<script setup lang="ts">
import { getUserWithdrawalRecord } from '~/api/home/home';
const { t } = useI18n();
const pub = usePublicStore();
const currency = pub.currency;

const statusText:any = {
    1: t('comm.c83'),
    2: t('comm.c84'),
    3: t('comm.c85'),
    4: t('comm.c86'),
};

const payStatusText:any = {
    1: t('comm.c87'),
    2: t('comm.c88'),
    3: t('comm.c89'),
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
    getUserWithdrawalRecord(params.page++, params.limit).then((res: any) => {
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
            {{$t('comm.c90')}}
        </div>
    </div>
    <div v-else class="px-3 mt-4">
        <van-list v-model:loading="loading" v-model:error="error" :finished="finished" @load="fetchItemsList">
            <div class="bg-[#ECF4FE] mb-3 px-3 py-2 rounded-sm" v-for="(item, index) in items" :key="index">
                <div class="rounded-xl space-y-1 text-sm">
                    <div class="flex justify-between items-center">
                        <div>{{$t('comm.c91')}}</div>
                        <div>{{ item.order_no }}</div>
                    </div>
                    <!-- <div class="flex justify-between items-center">
                        <div>{{$t('comm.c92')}}</div>
                        <div>{{ item.channel.alias }}</div>
                    </div> -->
                    <div class="flex justify-between items-center">
                        <div>{{$t('comm.c93')}}</div>
                        <div>{{ UseExchangeNumber(item.amount) }}</div>
                    </div>
                    <div class="flex justify-between items-center">
                        <div>{{$t('comm.c94')}}</div>
                        <div>{{ UseExchangeNumber(item.actual_amount) }}</div>
                    </div>
                    <div class="flex justify-between items-center" v-if="item.arrive_time !== '--' &&  !item.arrive_time">
                        <div>{{$t('comm.c95')}}</div>
                        <div>{{ item.arrive_time }}</div>
                    </div>
                    <div class="flex justify-between items-center">
                        <div>{{ $t('trade.t69') }}</div>
                        <div>{{ item.fee }}</div>
                    </div>
                     <div class="flex justify-between items-center" v-if="item.remark">
            <div>{{ $t('x.a23') }}</div>
            <div>{{ item.remark }}</div>
          </div>
                    <div class="flex justify-between items-center">
                        <div>{{$t('comm.c96')}}</div>
                        <div :class="{
                            'text-green-400': item.status == 1,
                            'text-orange-400': item.status == 2,
                            'text-red-400': item.status > 2,
                            }">
                            {{ statusText[item.status] }}
                        </div>
                    </div>
                    <div class="flex justify-between items-center">
                        <div>{{$t('comm.c97')}}</div>
                        <div :class="{
                            'text-green-400': item.pay_status == 1,
                            'text-orange-400': item.pay_status == 2,
                            'text-red-400': item.pay_status > 2,
                            }">
                            {{ payStatusText[item.pay_status] }}
                        </div>
                    </div>
                </div>
            </div>
        </van-list>
    </div>
</template>
