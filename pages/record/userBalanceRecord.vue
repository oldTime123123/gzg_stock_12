<script setup lang="ts">
import { getUserBalanceRecord } from '~/api/home/home';

const { t, locale } = useI18n()
const actRecordType = ref(1);
const recordTypeTabs = ref([
    {
        text: $t('record.r33'),
        type: 1,
    },
    {
        text: $t('record.r34'),
        type: 2,
    },
    {
        text: $t('record.r35'),
        type: 3,
    },
])
const handleTabChange = (type: number) => {
    if (actRecordType.value == type) {
        return;
    }
    actRecordType.value = type;
}
</script>

<template>
    <div>
        <second-page-nav-bar :title="$t('record.r36')"></second-page-nav-bar>

        <div class="mt-3 px-3 bg-white">

            <div class="recordBoxEl mt-3 pb-2">
                <div class="grid grid-cols-3 text-center recordTypeBoxEl">
                    <div v-for="(tab, index) in recordTypeTabs" :class="tab.type == actRecordType ? 'actRecordEl' : ''"
                        :key="index" @click="handleTabChange(tab.type)">
                        {{ tab.text }}
                    </div>
                </div>
                <BalanceRecordList v-if="1 == actRecordType" />
                <PaymentRecordList v-if="2 == actRecordType" />
                <WithdrawalRecordList v-if="3 == actRecordType" />
            </div>
        </div>
    </div>
</template>


<style lang="less" scoped>
.recordBoxEl {
    background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 11%);
    box-shadow: 0px 0px 6px 0px rgba(2, 26, 123, 0.14);
    border-radius: 10px;

    .recordTypeBoxEl {
        background: var(--mainColor);
        height: 37px;
        line-height: 37px;
        font-size: 14px;
        border-radius: 10px 10px 0 0;
        position: relative;
        overflow: hidden;
        border: 1px solid var(--mainColor);

        >div {
            position: relative;
            z-index: 1;
            cursor: pointer;
            color: #fff;
            transition: color 0.3s;

            &.actRecordEl {
                color: var(--mainColor);

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    background: #fff;
                    z-index: -1;
                    transform: skewX(-20deg);
                }
            }

            &:first-child.actRecordEl::before {
                left: -20px;
                right: -15px;
                border-radius: 10px 0 0 0;
            }

            &:last-child.actRecordEl::before {
                left: -15px;
                right: -20px;
                border-radius: 0 10px 0 0;
            }

            &:not(:first-child):not(:last-child).actRecordEl::before {
                left: -15px;
                    right: -15px;
                    // border-radius: 10px;
                    background: #FFF;
            }
        }
    }
}
</style>