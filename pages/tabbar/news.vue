<script lang="ts" setup>
import { getNewsList } from "~/api/home/home";

const pages = ref({
  page: 1,
  size: 20,
  pos: 1,
});

const showSkeleton = ref(true)
const recordList = ref([]);
const loading = ref(true);
const finished = ref(false);
const totalSize = ref(0);
const getRecordList = () => {
  getNewsList(pages.value)
    .then((res) => {
      totalSize.value = res.total;
      recordList.value = recordList.value.concat(res.list);
    })
    .finally(() => {
      loading.value = false;
      if (recordList.value.length == totalSize.value) {
        finished.value = true;
      } else {
        pages.value.page++;
      }
      showSkeleton.value = false;
    });
};
const router = useRouter();
const pub = usePublicStore();
const goNewsDetail = (item) => {
  if (item.type !== 2) {
    pub.selectNews = item
    router.push('/mine/newsDetail')
  } else {
    window.open(item.url)
  }
};
onBeforeMount(() => {
  getRecordList();
});
</script>
<template>
  <section>
    <div class="hasNormalBg">
      <TabbarTopNavBar />
      <div class="pageContainer px-3 mt-3 bg-white rounded-3xl">
        <div class="pt-3">
          <div v-if="showSkeleton">
            <div class="mb-2 p-2 h-[80px] bg-[#dce8f9] rounded-sm"
              v-for="(item, index) in 8" :key="index">
            </div>
          </div>
          <van-list v-model:loading="loading" :finished="finished" :error-text="' '" :loading-text="' '"
            :finished-text="' '" @load="getRecordList">
            <div class="mb-3 newsItemEl relative bg-[#ECF4FE] rounded-md p-2 text-sm" v-for="item in recordList"
              :key="item" @click="goNewsDetail(item)">
              <div class="newsContent">
                {{ item.name }}
              </div>
              <div class="color999 mt-2 text-sm">
                {{ item.show_time_format }}
              </div>
              <div class="rightBot pt-0.5 colorfff text-xs" v-if="item.article_type == 2">
                {{$t('news.n2')}}
              </div>
              <div class="rightBot pt-0.5 colorfff text-xs" v-else-if="item.article_type == 1">
                {{$t('news.n3')}}
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </div>

    <Tabbar />
  </section>
</template>

<style lang="less" scoped>
.pageContainer {
  min-height: calc(100vh - 130px);
  .newsItemEl {
    border: 2px solid #2d57ff;
    overflow: hidden;
    .rightBot {
      position: absolute;
      right: -25px;
      bottom: -15px;
      width: 60px;
      height: 40px;
      background: var(--mainColor);
      text-align: center;
      transform: rotate(-45deg);
    }
  }
}
</style>
