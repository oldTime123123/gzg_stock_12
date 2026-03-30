<script setup lang="ts">
import { getLixibaoLog, interruptLixibaoHandle } from '../../api/trade';
import { showConfirmDialog, showToast } from 'vant';
const { t, locale } = useI18n();
const pub = usePublicStore();

const actRecordType = ref(1);
const recordTypeTabs = ref([{
  text: t('fund.f19'),
  type: 1,
}, {
  text: t('fund.f20'),

  type: 2,
}
])
const pages = ref({
  page: 1,
  size: 10,
})
const showPwd = ref(false)
const showVanSkeletonLoading = ref(true)
const recordList = ref(new Array())
const loading = ref(true)
const finished = ref(false)
const totalSize = ref(0)
const getRecordList = () => {
  pages.value.status = actRecordType.value
    getLixibaoLog(pages.value).then(res => {
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


const changeActType = type => {
  actRecordType.value = type
  pub.showLoading = true
  recordList.value = []
  pages.value.page = 1
  getRecordList()
}

const statusEnum = {
  1: t('fund.f21'),
  2: t('fund.f22'),
  3: t('fund.f23'),
}

const showCancelConfirm = (id) => {

      pub.showLoading = true;
      interruptLixibaoHandle({ id:delId.value}).then(() => {
        changeActType(actRecordType.value)
        showToast(t('fund.f25'))
      })
}

const delId= ref(0)
const showPop = ref(false)
const openPop = id => {
  delId.value = id
  showPop.value = true
}
</script>

<template>
  <div>
    <second-page-nav-bar :title="t('fund.f26')"></second-page-nav-bar>

    <div class="mt-3 px-3">
      <div class="recordBoxEl mt-3 pb-2">
        <div class="grid grid-cols-2 text-center  recordTypeBoxEl">

          <div class="cursor-pointer" v-for="(tab, index) in recordTypeTabs"
            :class="tab.type == actRecordType ? 'actRecordEl' : ''" :key="index" @click="changeActType(tab.type)">
            {{ tab.text }}
          </div>

        </div>

        <div class="mt-3 px-3">
          <div class="" v-if="recordList.length == 0">
            <div class="nullData mt-10"></div>
            <div class="text-lg mt-2 color text-blue-300 text-center">
              {{ $t('trade.t8') }}
            </div>
          </div>
          <div v-else>
            <van-list v-model:loading="loading" :finished="finished" :error-text="' '" :loading-text="' '"
              :finished-text="' '" @load="getRecordList">
              <div class="bg-[#ECF4FE] mb-3 px-3 py-2 rounded-xl"
                v-for="(item, index) in recordList" :key="index">

                <div class=" rounded-xl space-y-1">
                  <div class="flex justify-between items-center ">
                    <div class="flex items-center ">
                      <span class="mainTextColor font-bold">{{item.order_no}}</span>

                    </div>
                    <div class=" px-2 py-1  rounded-lg  text-sm bg-[#FFDA1C]  "
                     >
                      {{ statusEnum[item.status] }}
                    </div>
                  </div>
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                     {{ t('fund.f27')}}
                    </div>
                    <div class="">
                      {{ UseExchangeNumber(item.num) + getCurrency() }}
                    </div>
                  </div>

                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                    {{ t('fund.f28')}}
                    </div>
                    <div class="">
                      {{ UseExchangeNumber(item.yuji_num) + getCurrency() }}

                    </div>
                  </div>
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                     {{ t('fund.f29')}}
                    </div>
                    <div class="">
                      {{ UseExchangeNumber(item.actual_num) + getCurrency() }}

                    </div>
                  </div>
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ t('fund.f30')}}
                    </div>
                    <div class="">
                      {{ item.createTime }}
                    </div>
                  </div>
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ t('fund.f31')}}
                    </div>
                    <div class="">
                      {{ item.expire_time }}
                    </div>
                  </div>

                  <div class="mt-2 contentBtn" v-if="pub.cancelLixibaoFlag && actRecordType<2" @click="openPop(item.id)">
                    {{ t('fund.f23')}}
                  </div>
                </div>
              </div>
            </van-list>

          </div>

        </div>
      </div>
    </div>

    <van-overlay :show="showPop" @click="showPop = false" z-index="999">
      <div class="flex justify-center items-center h-full">
        <div class="bg-white  w-[350px] rounded-2xl   overflow-hidden">
          <div class="px-3 pt-3 bg-[var(--mainColor)] ">
            <div class="text-center font-bold borderB pb-1 colorfff ">
              {{ $t('mine.m9') }}
            </div>
          </div>
          <div class="px-3 pb-3">

            <div class="mt-6 borderB pb-1">
              <div class="flex items-center justify-center">
                <span class="font-bold">{{ t('fund.f24') }}</span>
              </div>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-2">
              <div class="borderContentBtn" @click="showPop = false">{{ $t('comm.c56') }}</div>
              <div class="contentBtn" @click="showCancelConfirm">
                {{ $t('comm.c57') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-overlay>

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
