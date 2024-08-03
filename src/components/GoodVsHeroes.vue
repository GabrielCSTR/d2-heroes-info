<script lang="ts" setup>
import type { IHeroesVs } from '@/constants';

const stateProps = defineProps({
    goodVsHeroes: {
        type: Array as () => IHeroesVs[],
        required: true,
        default: () => []
    }
})

</script>
<template>
    <div class="w-full min-h-0 p-3">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="relative h-full p-2" v-for="(goodVs, index) in stateProps.goodVsHeroes?.slice(0, 6)"
                :key="goodVs.heroId2">
                <!-- Número do item -->
                <div class="absolute top-0 left-0 bg-red-500 text-white font-bold px-2 py-1">
                    {{ index + 1 }}º
                </div>

                <div class="flex bg-[#121212] p-2 w-full shadow-[0px_0px_8px_#000]">
                    <img class="w-40 h-24 m-[10px] mr-[15px] shadow-[0px_0px_8px_#000]"
                        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/${goodVs.shortName}.png`">
                    <div class="flex flex-col flex-grow min-h-0 mt-[5px] ml-[8px] mr-[12px] items-start">
                        <div class="text-white font-bold text-[22px] uppercase tracking-[1px]"
                            style="font-family: Reaver, serif;">
                            {{ goodVs.displayName }}
                        </div>
                    </div>
                </div>
                <div
                    class="w-full bg-black min-h-0 flex flex-col p-[20px] px-[30px] pb-[15px] shadow-[0px_0px_8px_#000]">
                    <div class="w-full min-h-0 flex flex-col space-y-4">
                        <!-- Matches Progress -->
                        <div class="flex flex-col w-full">
                            <div class="h-6 text-sm text-[#737373] uppercase tracking-[1px] flex flex-row w-full">
                                Matches:
                                <div class="ml-1 text-white font-semibold tracking-normal normal-case">{{
                                    goodVs.matchCount }}</div>
                            </div>
                        </div>

                        <!-- Win Average Progress -->
                        <div class="flex flex-col w-full">
                            <div class="h-6 text-sm text-[#737373] uppercase tracking-[1px] flex flex-row w-full mb-1">
                                WinRate Vs:
                                <div class="ml-1 text-white font-semibold tracking-normal normal-case">{{
                                    (goodVs.winrate * 100).toFixed(1) }}%</div>
                            </div>
                            <div class="relative bg-gray-700 h-2 w-full rounded">
                                <div class="absolute top-0 left-0 h-2 rounded" :class="{
                                    'bg-red-500': goodVs.winrate * 100 < 50,
                                    'bg-green-500': goodVs.winrate * 100 >= 50
                                }"
                                    :style="{ width: Math.min(goodVs.winrate * 100, 100) + '%' }">
                                </div>
                            </div>
                        </div>

                        <!-- Synergy Progress -->
                        <div class="flex flex-col w-full">
                            <div class="h-6 text-sm text-[#737373] uppercase tracking-[1px] flex flex-row w-full mb-1">
                                Synergy:
                                <div class="ml-1 text-white font-semibold tracking-normal normal-case">{{
                                    goodVs?.difference?.toFixed(1) }}%</div>
                            </div>
                            <div class="relative bg-gray-700 h-2 w-full rounded">
                                <div class="absolute top-0 left-0 bg-yellow-500 h-2 rounded" style="width: 60%;"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>