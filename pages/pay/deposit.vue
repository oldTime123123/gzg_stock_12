<script setup lang="ts">
import BEP20Icon from '~/assets/images/pay/BEP20.png';
import TRC20Icon from '~/assets/images/pay/TRC20.png';

const selectPayInd = ref(0)
const payList = [
    {
        name: 'USDT-BEP20',
        icon: BEP20Icon
    },
    {
        name: 'USDT-TRC20',
        icon: TRC20Icon
    }
]
const pub = usePublicStore()
onMounted(() => {
    pub.showLoading = false

    })
</script>
<template>
    <div class="depositPage">
        <second-page-nav-bar :title="$t('pay.p1')" :hasNoBg="true"></second-page-nav-bar>
        <div class="mt-10 px-3 ">

            <!-- 悬浮的图标 -->
            <div class="flex items-center justify-center">
                <div class="icon-circle w-[90px] h-[90px] ">
                    <img src="~/assets/images/icon/czIcon.png" class="w-full">
                </div>
            </div>
            <div class="pentagon-box bg-white rounded-2xl">
                <div class="h-[200px] p-3 mt-10">
                    <div class="flex justify-between items-center py-3 px-5 mb-3 rounded-xl"
                        :class="selectPayInd == index ? 'bg-[var(--mainColor)] colorfff' :'color000 bg-[#ECF4FE]'"
                        v-for="(item,index) in payList" :key="index" @click="selectPayInd = index">
                        <div class="flex items-center">
                            <img :src="item.icon" :alt="item.name" class="w-[25px] h-[25px]">
                            <div class="ml-2">
                                {{ item.name }}
                            </div>
                        </div>
                        <Icon v-if="selectPayInd ==index" name="tabler:circle-check-filled" class="w-[30px] h-[30px]">
                        </Icon>
                    </div>
                </div>
                <div class="px-3 mt-5">
                    <div class=" contentBtn">
                        {{$t('pay.p2')}}
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>


<style lang="less" scoped>
    .depositPage{
        background-image: url('~/assets/images/img/czBg.png');
        background-color:var(--mainColor);
        background-repeat: no-repeat;
        min-height: 100vh;
        background-size: 100%;
        .czContentBox{
        // background-image: url('~/assets/images/img/czBoxBg.png');
            // background-repeat: no-repeat;
                overflow: scroll;
                height: 60vh;
        }
    }
         .pentagon-box {
            margin-top: -50px;
           min-height: 50vh;
             clip-path: polygon(0% 30px,
                     50% 0%,
                     100% 30px,
                     100% 100%,
                     0% 100%);
    
          
             padding-top: 30px;
             color: #333;
         }
    
         .icon-circle {
             z-index: 10;
         }
</style>
