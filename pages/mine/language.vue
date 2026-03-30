<script setup lang="ts">
const pub = usePublicStore()
const selectNews = ref({})

const { locales, setLocale ,locale}  = useI18n()
onMounted(() => {
    pub.showLoading = false
    selectNews.value = pub.selectNews
}) 
</script>

<template>
    <div class="newsPage">

        <second-page-nav-bar :title="$t('mine.m21')"></second-page-nav-bar>
        <div class="mt-3 px-3">
            <div v-for="lang in locales" :key="lang.name"
                class="h-[50px] colorfff leading-[50px] text-center rounded-sm mb-3"
                :class="lang.code == locale ? 'bg-[var(--mainColor)] ' :'bg-[#E5F0FE] color000'" @click="setLocale(lang.code)">
                {{ lang.name }}
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// .selectItem{
//     background: ;
// }
</style>