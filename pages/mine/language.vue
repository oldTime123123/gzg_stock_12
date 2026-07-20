<script setup lang="ts">
const pub = usePublicStore()
import { getLang } from '~/api/home/home'

const selectNews = ref({})

const { locales, setLocale, locale } = useI18n()


const langList = ref([])
const getData = () => {
    getLang().then(res => {
        langList.value = res
    })
}
const changeLang = (lang) => {
    localStorage.setItem('lang', lang)
    setLocale(lang)
}
onMounted(() => {
    pub.showLoading = false
    selectNews.value = pub.selectNews
    getData()
}) 
</script>

<template>
    <div class="newsPage">

        <second-page-nav-bar :title="$t('mine.m21')"></second-page-nav-bar>
        <div class="mt-3 px-3">
            <div v-for="item in langList" :key="item.name"
                class="h-[50px] colorfff leading-[50px] text-center rounded-sm mb-3"
                :class="item.lang == locale ? 'bg-[var(--mainColor)] ' : 'bg-[#E5F0FE] color000'"
                @click="changeLang(item.lang)">
                {{ item.name }}
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// .selectItem{
//     background: ;
// }</style>