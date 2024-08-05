<script lang="ts" setup>
import { API_URL, stractzApi, queryGetHeroInfo, getAllHeroes } from '@/utils';
import { reactive, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHeroeStore } from '@/stores/heroInfo';
import { primaryAttributes, type IHero, type IHeroesVs } from '@/constants';
import BadvsHeroes from '@/components/BadVsHeroes.vue';
import GoodVsHeroes from '@/components/GoodVsHeroes.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter();
const route = useRoute();
const appHeroStore = useHeroeStore();

const state = reactive({
    heroInfo: null as any,
    heroRouteInfo: null as unknown as IHero,
    badVsHeroes: null as unknown as IHeroesVs[],
    goodVsHeroes: null as unknown as IHeroesVs[],
});


const getPrimaryAttribute = (attr: string | undefined, sortName: boolean = false) => {
    if (!attr) return '';
    if(sortName){
        return primaryAttributes.find((item) => item.name === attr)?.sortName ?? '';
    }
    return primaryAttributes.find((item) => item.name === attr)?.type ?? '';
};

const previousHero = ref<IHero | null>(null);
const nextHero = ref<IHero | null>(null);
const allHeroes = appHeroStore.GET_ALL_HEROES();

const getAdjacentHeroes = (target: string) => {
    const index = allHeroes.findIndex((item) => item.shortName === target);

    if (index !== -1) {
        previousHero.value = index > 0 ? allHeroes[index - 1] : allHeroes[0];
        nextHero.value = index < allHeroes.length - 1 ? allHeroes[index + 1] : allHeroes[allHeroes.length - 1];
    }
};

const navigateToHero = async (heroName: string | undefined) => {
    if (!heroName) return;
    const targetHero = allHeroes.find((item) => item.shortName === heroName);
    if (targetHero) {
        const { id, shortName, displayName, stats } = targetHero;
        await router.push({
            name: 'HeroDetails',
            params: {
                id,
                name: shortName,
                displayName,
                attr: stats?.primaryAttribute,
                shortName: shortName,
            },
        });
    }
};

const calculateWinrate = (win: number, total: number) => {
    if (isNaN(win) || isNaN(total)) {
        throw new Error("One entry in the winrate calculation is not a number");
    }
    return Number((win / total).toPrecision(5));
};

const calculateSynergy = (observedWinrate: number, winrate1: number, winrate2: number) => {
    return Number(
        (
            (observedWinrate - (-0.48 + 0.98 * winrate1 + 0.98 * winrate2)) *
            100
        ).toPrecision(4)
    );
};

const calculateCounter = (observedWinrate: number, winrate1: number, winrate2: number) => {
    return Number(
        ((observedWinrate - (0.5 + winrate1 - winrate2)) * 100).toPrecision(4)
    );
};

onMounted(async () => {
    if (allHeroes.length <= 0) {
        await getAllHeroes();
    }
    state.heroRouteInfo = route.params as unknown as IHero;

    if (!state.heroRouteInfo?.id) {
        const heroRouteInfo = allHeroes.find(hero => hero.shortName == state.heroRouteInfo.name);
        if (heroRouteInfo) {
            state.heroRouteInfo = heroRouteInfo ?? undefined;
        }
    }
    console.log("CURRENT HERO", state.heroRouteInfo);

    appHeroStore.SET_CURRENT_HERO(state.heroRouteInfo);

    try {
        const response = await stractzApi.post(API_URL, {
            query: queryGetHeroInfo(state.heroRouteInfo?.id),
        });
        state.heroInfo = response.data?.data?.heroStats?.matchUp[0];
    } catch (error) {
        console.error('Error:', error);
    }
    const heroName = appHeroStore.info?.name || appHeroStore.info?.shortName;

    getAdjacentHeroes(heroName);

    console.log("HERO INFO", state.heroInfo);

    state.goodVsHeroes = state.heroInfo?.vs.map((hero: IHeroesVs) => {
        return hero = restructureMatchupObject(hero, true)
    })

    state.goodVsHeroes?.find((hero: any) => {
        const goodHero = allHeroes.find((item: any) => item.id === hero.heroId2);
        hero.displayName = goodHero?.displayName;
        hero.shortName = goodHero?.shortName;
        delete hero.winRateHeroId1;
        delete hero.winRateHeroId2;
    });

    state.goodVsHeroes = state.goodVsHeroes?.slice(0, 10);

    console.log("GOOD VS HEROES", state.goodVsHeroes);

    state.badVsHeroes = state.heroInfo?.vs.sort((a: any, b: any) => {
        const anticipatedWinRateA = a.synergy; // synergy bad hero
        const anticipatedWinRateB = b.synergy;

        const winRateA = calculateWinrate(a.winCount, a.matchCount); // match count vs bad hero
        const winRateB = calculateWinrate(b.winCount, b.matchCount);

        const diffA = anticipatedWinRateA - winRateA;
        const diffB = anticipatedWinRateB - winRateB;

        return diffA - diffB;
    });

    state.badVsHeroes.find((hero: any) => {
        const bestHero = allHeroes.find((item: any) => item.id === hero.heroId2);
        hero.displayName = bestHero?.displayName;
        hero.shortName = bestHero?.shortName;
        hero.winrate = Number((hero.winCount / hero.matchCount).toPrecision(4));
        delete hero.winCount;
    });

    state.badVsHeroes = state.badVsHeroes.sort((a, b) => a.synergy - b.synergy).slice(0, 10)

    console.log("BAD VS HEROES", state.badVsHeroes);
});


const restructureMatchupObject = (matchup: IHeroesVs, isCounter: boolean) => {

    matchup.winrate = Number((matchup.winCount / matchup.matchCount).toPrecision(4));
    if (isCounter) {
        matchup.difference = calculateCounter(
            matchup.winrate,
            matchup.winRateHeroId1,
            matchup.winRateHeroId2
        );
    } else {
        matchup.winrate = Number((matchup.winCount / matchup.matchCount).toPrecision(4));
        matchup.difference = calculateSynergy(matchup.winrate, matchup.winRateHeroId1, matchup.winRateHeroId2);
    }
    return matchup;
}
</script>

<template>
    <div class="w-full text-white flex flex-col overflow-hidden relative">
        <div
            class="w-full min-h-[700px] p-[40px_100px_0px_140px] bg-black bg-[url('https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react//backgrounds/greyfade.jpg')] bg-cover bg-center bg-no-repeat overflow-hidden relative">
            <div
                class="w-[250%] h-[650px] bg-[#00000060] absolute transform -skew-y-[45deg] -translate-x-[50vw] overflow-hidden animation_opacity">
            </div>

            <div
                :class="`top-0 absolute w-[80%] h-full right-[-5%] flex justify-center items-center pointer-events-none animation_opacity ${appHeroStore.info?.shortName?.toLocaleLowerCase()}`">
                <video
                    class="_hero_video w-full min-h-full max-w-[1500px] mask-[linear-gradient(to_top,_transparent_10%,_black_50%)]"
                    :poster="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${appHeroStore.info?.name || appHeroStore.info?.stats}.png`"
                    autoplay preload="auto" loop playsinline>
                    <source type="video/mp4; codecs=&quot;hvc1&quot;"
                        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${appHeroStore.info?.name || appHeroStore.info?.stats}.mov`">
                    <source type="video/webm"
                        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${appHeroStore.info?.name || appHeroStore.info?.stats}.webm`">
                    <img
                        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${appHeroStore.info?.name || appHeroStore.info?.stats}.png`">
                </video>
            </div>

            <div class="absolute left-0 bottom-0 right-0 w-full h-full pointer-events-none">
                <div class="absolute w-full h-full"
                    style="background: linear-gradient(rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.733) 100%, rgb(0, 0, 0) 100%);">
                </div>
            </div>

            <div
                class="mt-[100px] ml-[30px] w-[35%] h-[calc(90%-100px)] min-h-0 flex flex-col relative z-[2] _heroinfo_sumary_animation_opacity">
                <div class="flex items-center">
                    <img :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/${getPrimaryAttribute(appHeroStore.info?.attr)}.png`"
                        class="w-8 h-8">
                    <div class="ml-[6px] text-white uppercase tracking-[2px] font-thin text-[24px]">{{getPrimaryAttribute(appHeroStore.info?.attr, true)}}</div>
                </div>
                <div
                    class="mt-[12px] font-reaver text-[80px] font-bold uppercase tracking-[2px] text-white leading-[110%]">
                    {{ appHeroStore.info.displayName }}</div>
            </div>

            <div
                class="w-[800px] h-[50px] absolute left-[100px] bottom-[80px] mr-[50px] flex flex-row items-center rotate-[270deg] origin-bottom-left __heroinfo_left_animation">
                <img :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/${getPrimaryAttribute(appHeroStore.info?.attr)}.png`"
                    class="w-6 h-6">
                <div class="uppercase tracking-[3px] font-reaver text-[17px] font-semibold ml-[12px]">{{
                    appHeroStore.info.displayName }}</div>
                <div class="text-[#888] uppercase tracking-[3px] text-[18px] ml-[10px] translate-y-[-2px]">{{
                    appHeroStore.info.id }}</div>
                <div class="flex-grow h-[2px] bg-[#555] mx-[8px] mb-[3px]"></div>
            </div>
        </div>

        <div
            class="w-full min-h-[221px] bg-gradient-to-br from-[#151616] to-[#040505] border-t-[2px] border-b-[2px] border-[#282828] shadow-[0_0_8px_#000] flex justify-center z-[2]">
            <div class="w-full flex flex-col pb-[60px]">
                <div
                    class="w-full text-center font-reaver text-[20px] text-[#fff] font-medium uppercase tracking-[3px] mt-[40px] mb-[30px]">
                    Heroes Counters:</div>

                <div class="flex flex-row space-x-4">
                    <div class="flex-1 flex flex-col space-y-4">
                        <h1
                            class="w-full text-center font-reaver text-[20px] text-[#fff] font-medium uppercase tracking-[3px] mt-[40px] mb-[30px]">
                            COUNTER HEROES:</h1>
                        <BadvsHeroes v-show="state.badVsHeroes" :bad-vs-heroes="state.badVsHeroes" />
                    </div>

                    <div class="border-l-2 border-gray-600"></div>

                    <div class="flex-1 flex flex-col space-y-4">
                        <h1
                            class="w-full text-center font-reaver text-[20px] text-[#fff] font-medium uppercase tracking-[3px] mt-[40px] mb-[30px]">
                            MELHOR CONTRA:</h1>
                        <GoodVsHeroes v-show="state.goodVsHeroes" :good-vs-heroes="state.goodVsHeroes" />
                    </div>
                </div>


            </div>
        </div>

        <div v-show="nextHero" class="w-full min-h-0 flex flex-col items-center bg-cover bg-no-repeat pt-20"
            style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/backgrounds/grey_painterly.png&quot;);">
            <div class="w-full h-[150px] bg-[#111] z-[1] mx-auto mt-[40px] flex flex-row justify-between items-center">

                <div @click.prevent="navigateToHero(previousHero?.shortName)"
                    class="w-[45%] h-[150px] relative px-[30px] flex flex-row justify-end items-center bg-cover bg-no-repeat shadow-[2px_2px_6px_#000] transition-[filter,transform] duration-[0.2s] ease-in-out hover:brightness-[1.2] hover:bottom-0 cursor-pointer"
                    style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/backgrounds/grey_painterly_wide.png&quot;);">
                    <img class="absolute bottom-[-20px] w-[400px] right-0 left-0 hover:-translate-y-5 transition-all duration-500"
                        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/crops/${previousHero?.shortName}.png`">
                    <div class="w-[250px] min-h-0 flex flex-col z-[6]">
                        <div class="text-[15px] text-[#9f9f9f] uppercase tracking-[2px] mb-[5px]">Herói anterior</div>
                        <div
                            class="text-[28px] text-[#fff] uppercase tracking-[1px] font-reaver font-bold leading-[112%]">
                            {{ previousHero?.displayName ?? 'nada' }}
                        </div>
                        <div class="flex w-full items-center"><img
                                src="https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/hero_universal.png"
                                class="w-[20px] h-[20px] mr-[10px] drop-shadow-[1px_1px_4px_black]">
                            <div class="text-[#ddd] text-[15px] uppercase tracking-[2px]">Corpo a corpo</div>
                        </div>
                    </div>
                </div>

                <router-link to="/"
                    class="w-[10%] h-[150px] pt-[30px] min-h-0 flex flex-col items-center shadow-[2px_2px_6px_#000] transition-[filter,_transform] duration-[0.2s] ease-in-out">
                    <div class="w-[100px] h-[69px] flex flex-row flex-wrap justify-between items-center">
                        <div class="w-[30px] h-[30px] bg-[#9e9fa0]"></div>
                        <div class="w-[30px] h-[30px] bg-[#9e9fa0]"></div>
                        <div class="w-[30px] h-[30px] bg-[#9e9fa0]"></div>
                        <div class="w-[30px] h-[30px] bg-[#9e9fa0]"></div>
                        <div class="w-[30px] h-[30px] bg-[#9e9fa0]"></div>
                        <div class="w-[30px] h-[30px] bg-[#9e9fa0]"></div>
                    </div>
                    <div class="text-white text-[14px] uppercase tracking-[2px] mt-[8px] text-center">Todos os heróis
                    </div>
                </router-link>

                <div @click.prevent="navigateToHero(nextHero?.shortName)"
                    class="relative w-[45%] h-[150px] p-[0px_30px] flex flex-row justify-start items-center bg-cover bg-no-repeat shadow-[2px_2px_6px_#000] transition-[filter,transform] duration-[0.2s] ease-in-out hover:brightness-[1.2] hover:bottom-0  cursor-pointer "
                    style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/backgrounds/grey_painterly_wide.png&quot;);">

                    <img class="absolute bottom-[-20px] w-[400px] right-0 transition-duration-[0.3s] hover:-translate-y-5 transition-all duration-500"
                        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/crops/${nextHero?.shortName}.png`">

                    <div class="w-[250px] min-h-0 flex flex-col z-[6]">
                        <div class="text-[15px] text-[#9f9f9f] uppercase tracking-[2px] mb-[5px]">Próximo herói</div>
                        <div
                            class="text-[28px] text-[#fff] uppercase tracking-[1px] font-reaver font-bold leading-[112%]">
                            {{ nextHero?.displayName }}</div>
                        <div class="flex w-full items-center">
                            <img src="https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/hero_intelligence.png"
                                class="w-[20px] h-[20px] mr-[10px] drop-shadow-[1px_1px_4px_black]">
                            <div class="text-[#ddd] text-[15px] uppercase tracking-[2px]">Longo alcance</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

      <Footer />
    </div>
</template>

<style scoped></style>