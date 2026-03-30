<script setup lang="ts">
import upIcon from '~/assets/images/icon/upIcon.png';
import downIcon from '~/assets/images/icon/downIcon.png';
import { stockSearch } from '~/api/home/home';

const pub = usePublicStore()
const searchHistory = computed(() => {
  return pub.searchHistory
})
const list = ref([])
const searchVal = ref("")
const searchHandle = () => {
  pub.showLoading = true
  stockSearch({ keyword: searchVal.value }).then(res => {
    if (pub.searchHistory.length > 10) {
      pub.searchHistory.pop()
    }
    if (!pub.searchHistory.includes(searchVal.value)) {
      pub.searchHistory = [searchVal.value, ...pub.searchHistory]
    }
    list.value = res
  })
}

const clickItemHandle = item => {
  searchVal.value = item
  searchHandle()
}
const deletingItem = ref<string | null>(null)  // 用元素值而不是索引

const delSearchHandle = (item: string) => {
  deletingItem.value = item
  setTimeout(() => {
    const index = pub.searchHistory.indexOf(item)
    if (index > -1) {
      pub.searchHistory.splice(index, 1)
    }
    deletingItem.value = null
  }, 500)
}

const router = useRouter()
const useSocketStore = socketStore()

const selectHandle = item => {

  useSocketStore.currentCoin = item
  router.push('/trade')
}

onMounted(() => {
  pub.showLoading = false
})
</script>

<template>
  <div>
    <second-page-nav-bar :title="$t('search.s1')"></second-page-nav-bar>

    <clientOnly>
      <div class="px-3 py-3">
        <div class="searchBox pr-3 rounded-3xl flex items-center cursor-zoom-in">
          <div class="leftBoxEl flex items-center justify-center">
            <img src="~/assets/images/icon/m_search.png" class="w-5 h-6" @click="searchHandle">
          </div>
          <div class="flex-1   ml-2 text-sm color000">
            <input type="text" v-model="searchVal" :placeholder="$t('search.s2')" @keydown.enter="searchHandle">
          </div>
          <Icon name="pajamas:clear" class="cursor-clear" v-if="searchVal" width="20" height="20"
            @click="searchVal = ''"></Icon>

        </div>

        <div class="mt-4">
          <div class="mainTextColor text-sm">
            {{ $t('search.s3') }}
          </div>
          <div class="mt-2  flex items-center gap-y-1 gap-x-2 flex-wrap">
            <div class="shrink-0 gridItemEl bg-[var(--mainColor)] mb-2 pl-2 pr-1 rounded-sm colorfff"
              v-for="item in searchHistory" :key="item"
              :class="{ 'gridItemElDelete': deletingItem === item }"
              @click="clickItemHandle(item)"
              >
              <div class="flex items-center justify-center">
                <div class="mr-2">
                  {{ item }}
                </div>
                <Icon name="mingcute:close-fill" class="delIcon cursor-pointer" @click.stop="delSearchHandle(item)"

                  />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="searchResultEl bg-[var(--mainColor)] py-6 rounded-t-4xl">
        <div v-if="list.length == 0" class="px-3">
          <div class="nullData mt-10"></div>
          <div class="text-lg mt-2 colorfff text-center">
            {{ $t('search.s4') }}
          </div>
        </div>
        <div v-else class="px-3  overscroll-y-scroll">
          <div class="mb-2 pr-1  cursor-pointer bg-white rounded-2xl overflow-hidden flex items-center justify-between "
            v-for="(item, index) in list" :key="index" @click="selectHandle(item)">
            <div class="flex items-center">
              <div class="w-[50px] h-[60px] leading-[60px] text-center bg-[#FFDA1C]">
                {{ index + 1 }}
              </div>
              <div class="ml-2 text-sm">
                <div class="mainTextColor font-bold">{{ item.pro_name }}</div>
                <div class="mt-1">{{ item.pro_code }}</div>
              </div>
            </div>

            <div class=" text-sm text-right">
              <div class="font-black flex items-center flex-row-reverse ">
                <img :src="item.is_rise > 1 ? upIcon : downIcon" class="w-3 h-3 ml-1">
                {{ UseExchangeNumber(item.price) }}
              </div>
              <div class="py-px px-2 mt-1 rounded-md"
                :class="item.is_rise > 1 ? 'bg-[#FFF0EF] colorUp' : 'bg-[#E6FEE2] colorDown'">
                {{ item.is_rise > 1 ? '+' : '-' }}
                {{ item.rise_rate1 }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </clientOnly>
  </div>
</template>


<style lang="less" scoped>
.gridItemEl {
  transition: .5s allow-discrete;
  @starting-style {
    transform: scale(0);
    opacity: 0;
  }
}


.gridItemElDelete {
  opacity: 0;
  transform: scale(0);
  margin: 0;
  padding: 0;
  width: 0;
  overflow: hidden;
}
.searchResultEl {
  min-height: calc(100vh - 155px);
}

.searchBox {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);

  input::placeholder {
    color: #ccc;

  }


  .leftBoxEl {
    background: url('~/assets/images/icon/market_t.png') no-repeat;
    background-size: contain;
    height: 35px;
    width: 70px;
  }
}
</style>
