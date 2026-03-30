<script lang="ts" setup>
const isSticky = ref(false);
const topFixedChange = (val: boolean) => {
    isSticky.value = val
};

const router = useRouter()
const changePage = (url: any) => {
    router.push(url)
}
</script>

<template>
    <div>
        <van-sticky offset-top="0" @change="topFixedChange">
            <div class="px-3 py-3 tabbarPageTopNav " :class="isSticky ? 'topStickyEl' : ''">
                <div class="searchBox pr-3 rounded-3xl flex items-center cursor-zoom-in" @click="changePage('/search')">
                    <div class="leftBoxEl flex items-center justify-center">
                        <img src="~/assets/images/icon/m_search.png" class="w-5 h-6">
                    </div>
                    <div class="flex-1   text-sm colorfff  ">
                        {{ $t('comm.c82') }}
                    </div>
                </div>
            </div>
        </van-sticky>
    </div>
</template>


<style lang="less" scoped>
.searchBox {
    background: rgba(255, 255, 255, 0.5);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);

    input::placeholder {
        color: #f1f0f0;
    }

    .leftBoxEl {
        background: url('~/assets/images/icon/market_t.png') no-repeat;
        background-size: contain;
        height: 35px;
        width: 70px;
    }

}
</style>