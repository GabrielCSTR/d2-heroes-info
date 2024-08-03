<script lang="ts" setup>
import { API_URL, stractzApi, queryGetHeroInfo, getAllHeroes } from '@/utils';
import { reactive, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHeroeStore } from '@/stores/heroInfo';
import { primaryAttributes, type IHero, type IHeroesVs } from '@/constants';
import BadvsHeroes from '@/components/BadVsHeroes.vue';
import GoodVsHeroes from '@/components/GoodVsHeroes.vue'

const router = useRouter();
const route = useRoute();
const appHeroStore = useHeroeStore();

const state = reactive({
    heroInfo: null as any,
    heroRouteInfo: null as unknown as IHero,
    badVsHeroes: null as unknown as IHeroesVs[],
    goodVsHeroes: null as unknown as IHeroesVs[],
});


const getPrimaryAttribute = (attr: string | undefined) => {
    if (!attr) return '';
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
    if(allHeroes.length <= 0){
       await getAllHeroes();
    }
    state.heroRouteInfo = route.params as unknown as IHero;

    if(!state.heroRouteInfo?.id){
        const heroRouteInfo = allHeroes.find(hero => hero.shortName == state.heroRouteInfo.name);
        if(heroRouteInfo){
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

    state.goodVsHeroes = state.goodVsHeroes?.slice(0,10);

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
    if(isCounter){
        matchup.difference = calculateCounter(
            matchup.winrate,
            matchup.winRateHeroId1,
            matchup.winRateHeroId2
        );
    } else {
        matchup.winrate = Number((matchup.winCount / matchup.matchCount).toPrecision(4));
        matchup.difference = calculateSynergy(matchup.winrate,matchup.winRateHeroId1,matchup.winRateHeroId2);
    }
    return matchup;
}
</script>

<template>
    <div class="__heroinfo_wrapper">
        <div class="__heroinfo_container">
            <div class="__heroinfo_line_effect"></div>

            <div :class="`__heroinfo_hero_container ${appHeroStore.info?.shortName?.toLocaleLowerCase()}`">
                <video class="_hero_video"
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

            <div class="__heroinfo_shadown">
                <div class="__shadown"
                    style="background: linear-gradient(rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.733) 100%, rgb(0, 0, 0) 100%);">
                </div>
            </div>

            <div class="_heroinfo_sumary">
                <div class="__heroinfo_attr_content">
                    <img :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/${getPrimaryAttribute(appHeroStore.info?.attr)}.png`"
                        class="w-8 h-8">
                    <div class="_heroinfo_sumary_attr">Força</div>
                </div>
                <div class="_heroinfo_sumary_heroname">{{ appHeroStore.info.displayName }}</div>
            </div>

            <div class="__heroinfo_left_info">
                <img :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/${getPrimaryAttribute(appHeroStore.info?.attr)}.png`"
                    class="w-6 h-6">
                <div class="__hero_left_text">{{ appHeroStore.info.displayName }}</div>
                <div class="__hero_left_heroid">{{ appHeroStore.info.id }}</div>
                <div class="__hero_left_line"></div>
            </div>
        </div>

        <div  class="__heroinfo_counters">
            <div class="__heroinfo_counters_title">
                <div class="__heroinfo_counters_title_text">Heroes Counters:</div>
                
                <div class="flex flex-row space-x-4">
                    <div class="flex-1 flex flex-col space-y-4">
                        <h1 class="__heroinfo_counters_title_text">COUNTER HEROES:</h1>
                        <BadvsHeroes v-show="state.badVsHeroes" :bad-vs-heroes="state.badVsHeroes" />
                    </div>

                    <div class="border-l-2 border-gray-600"></div>

                    <div class="flex-1 flex flex-col space-y-4">
                        <h1 class="__heroinfo_counters_title_text">MELHOR CONTRA:</h1>
                       <GoodVsHeroes v-show="state.goodVsHeroes" :good-vs-heroes="state.goodVsHeroes" />
                    </div>
                </div>
               

            </div>
        </div>

        <div v-show="nextHero" class="__heroinfo_next_container pt-20"
            style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/backgrounds/grey_painterly.png&quot;);">
            <div class="__heroinfo_next">

                <div @click.prevent="navigateToHero(previousHero?.shortName)"
                    class="__heroInfo_next_hero_start cursor-pointer"
                    style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/backgrounds/grey_painterly_wide.png&quot;);">
                    <img class="__heroinfo_next_hero_img_start hover:-translate-y-5 transition-all duration-500"
                        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/crops/${previousHero?.shortName}.png`">
                    <div class="__heroinfo_next_hero_details">
                        <div class="__heroinfo_next_hero_details_title">Herói anterior</div>
                        <div class="__heroinfo_next_hero_details_heroname">{{ previousHero?.displayName ?? 'nada' }}
                        </div>
                        <div class="__heroinfo_next_hero_details_stats"><img
                                src="https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/hero_universal.png"
                                class="__heroinfo_next_hero_details_stats_img">
                            <div class="__heroinfo_next_hero_details_stats_title">Corpo a corpo</div>
                        </div>
                    </div>
                </div>

                <router-link to="/" class="__heroinfo_next_home">
                    <div class="__heroinfo_next_home_icon">
                        <div class="__heroinfo_next_home_icon_det"></div>
                        <div class="__heroinfo_next_home_icon_det"></div>
                        <div class="__heroinfo_next_home_icon_det"></div>
                        <div class="__heroinfo_next_home_icon_det"></div>
                        <div class="__heroinfo_next_home_icon_det"></div>
                        <div class="__heroinfo_next_home_icon_det"></div>
                    </div>
                    <div class="__heroinfo_next_home_title">Todos os heróis </div>
                </router-link>

                <div @click.prevent="navigateToHero(nextHero?.shortName)"
                    class="__heroInfo_next_hero_end cursor-pointer "
                    style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/backgrounds/grey_painterly_wide.png&quot;);">
                    <img class="__heroinfo_next_hero_img hover:-translate-y-5 transition-all duration-500"
                        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/crops/${nextHero?.shortName}.png`">
                    <div class="__heroinfo_next_hero_details">
                        <div class="__heroinfo_next_hero_details_title">Próximo herói</div>
                        <div class="__heroinfo_next_hero_details_heroname">{{ nextHero?.displayName }}</div>
                        <div class="__heroinfo_next_hero_details_stats"><img
                                src="https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/hero_intelligence.png"
                                class="__heroinfo_next_hero_details_stats_img">
                            <div class="__heroinfo_next_hero_details_stats_title">Longo alcance</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <footer class="__heroinfo_footer">
            <div class="flex flex-row justify-center items-center m-0 mb-2">
                <a href="/home"><img class="max-h-[30px]"
                        src="https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/dota_footer_logo.png"></a>
            </div>
            <div class="__heroinfo_footer_text">Dota2 Counters Picks</div>
        </footer>
    </div>
</template>

<style scoped>

</style>