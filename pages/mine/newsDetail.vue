<script setup lang="ts">
import { getNewsDetail } from '~/api/home/home'

const pub = usePublicStore()
const selectNews = ref({})

const getData = () => {

    getNewsDetail({
        id: pub.selectNews.id
    }).then(res => {
        selectNews.value = res
    })
}
onMounted(() => {
    pub.showLoading = false
    getData()
}) 
</script>

<template>
    <div class="newsPage">

        <second-page-nav-bar :title="$t('mine.m1')"></second-page-nav-bar>
        <div class="mt-3 px-3">
            <div class="text-sm">
                {{ selectNews.name }}
            </div>
            <div class="mt-2 flex justify-between items-center borderB pb-2">
                <div class="bg-[#E5F0FE] text-[#2D57FF] rounded-sm text-xs py-1 px-2">
                    {{ $t('mine.m2') }}
                </div>
                <div class="color999">
                    {{ selectNews.show_time_format }}
                </div>
            </div>
            <div class="mt-2 text-[#8E8E8E] contentIntro">
                <ClientOnly>
                    <div class="text-sm" v-html="selectNews.contents">
                    </div>
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.borderB {
    border-bottom: 1px solid #ccc;
}

.contentIntro {
    text-indent: 2em;
}
</style>