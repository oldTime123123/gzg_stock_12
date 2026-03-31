<script lang="ts" setup>
import { getNewsList } from "~/api/home/home"

const pages = ref({
  page: 1,
  size: 20,
  pos: 1,
})

const showSkeleton = ref(true)
const recordList = ref([])
const loading = ref(true)
const finished = ref(false)
const totalSize = ref(0)

const getRecordList = () => {
  getNewsList(pages.value)
    .then((res) => {
      totalSize.value = res.total
      recordList.value = recordList.value.concat(res.list)
    })
    .finally(() => {
      loading.value = false
      if (recordList.value.length == totalSize.value) {
        finished.value = true
      } else {
        pages.value.page++
      }
      showSkeleton.value = false
    })
}

const router = useRouter()
const pub = usePublicStore()
const goNewsDetail = (item) => {
  if (item.type !== 2) {
    pub.selectNews = item
    router.push('/mine/newsDetail')
  } else {
    window.open(item.url)
  }
}

const getArticleTag = (item: any) => {
  if (item.article_type == 2) return t('news.n2')
  if (item.article_type == 1) return t('news.n3')
  return ''
}

const { t } = useI18n()

onBeforeMount(() => {
  getRecordList()
})
</script>

<template>
  <section>
    <div class="min-h-full">
      <TabbarTopNavBar />
      <div class="pageContainer mt-3 px-4 pb-2">
        <div class="min-h-[calc(100vh-130px)] rounded-2xl border border-[rgba(45,87,255,0.08)] bg-white px-4 py-4 shadow-[0_14px_32px_rgba(2,26,123,0.10)]">
          <div class="mb-4 text-[1.0625rem] font-extrabold leading-tight tracking-[-0.01em] text-[#243253]">{{ $t('x.a8') }}</div>

          <div v-if="showSkeleton" class="space-y-3">
            <div
              v-for="(item, index) in 8"
              :key="index"
              class="h-[92px] animate-pulse rounded-2xl bg-[#eaf0ff]"
            ></div>
          </div>

          <van-list
            v-else
            v-model:loading="loading"
            :finished="finished"
            :error-text="' '"
            :loading-text="' '"
            :finished-text="' '"
            @load="getRecordList"
          >
            <div class="space-y-3">
              <button
                v-for="(item, index) in recordList"
                :key="item.id || index"
                type="button"
                class="w-full rounded-2xl border border-[rgba(45,87,255,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#f7f9ff_100%)] p-4 text-left text-base shadow-[0_12px_28px_rgba(2,26,123,0.10)]"
                @click="goNewsDetail(item)"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="line-clamp-2 flex-1 font-semibold leading-[1.55] tracking-[-0.01em] text-[#243253]">
                    {{ item.name }}
                  </div>
                  <div
                    v-if="getArticleTag(item)"
                    class="shrink-0 rounded-full bg-[var(--mainColor)] px-2 py-1 text-[0.75rem] font-semibold tracking-[0.04em] colorfff"
                  >
                    {{ getArticleTag(item) }}
                  </div>
                </div>
                <div class="mt-3 text-[0.8125rem] font-medium color999">
                  {{ item.show_time_format }}
                </div>
              </button>
            </div>
          </van-list>
        </div>
      </div>
    </div>

    <Tabbar />
  </section>
</template>
