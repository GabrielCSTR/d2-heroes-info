<script lang="ts" setup>
import type { IHero } from '@/constants';
import { API_URL, stractzApi, queryGetHeroInfo } from '@/utils';
import { reactive } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router'
import { useHeroeStore } from '@/stores/heroInfo'

const route = useRoute()
const state = reactive({
    heroInfo: null as any,
    heroRouteInfo: null as unknown as IHero,
});

const primaryAttribute = [
    { name: 'agi', type: 'hero_agility' },
    { name: 'str', type: 'hero_strength' },
    { name: 'int', type: 'hero_intelligence' },
    { name: 'all', type: 'hero_universal' },
]

const getPrimaryAttribute = (attr: string) => {
    return primaryAttribute.find((item) => item.name === attr)?.type ?? '';
}

const appHeroStore: any = useHeroeStore();

onMounted(async () => {

    state.heroRouteInfo = route.params as unknown as IHero;
    appHeroStore.SET_CURRENT_HERO(state.heroRouteInfo);

    await stractzApi
        .post(
            API_URL,
            {
                query: queryGetHeroInfo,
                variables: { heroId: parseInt(state.heroRouteInfo?.id.toString()), matchLimit: 0 }
            },
        )
        .then((reponse) => {
            const { heroStats } = reponse?.data?.data;
            state.heroInfo = heroStats;
            console.log("DATA", state.heroInfo);
        })
        .catch((err) => {
            console.error('Error:', err);
        })
})

</script>

<template>
    <div class="__heroinfo_wrapper">
        <div class="__heroinfo_container">
            <div class="__heroinfo_line_effect"></div>

            <div :class="`__heroinfo_hero_container ${appHeroStore.info?.displayName}`">
                <video class="_hero_video"
                    :poster="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${appHeroStore.info?.name}.png`"
                    autoplay preload="auto" loop playsinline>
                    <source type="video/mp4; codecs=&quot;hvc1&quot;"
                        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${appHeroStore.info?.name}.mov`">
                    <source type="video/webm"
                        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${appHeroStore.info?.name}.webm`">
                    <img
                        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${appHeroStore.info?.name}.png`">
                </video>
            </div>

            <div class="__heroinfo_shadown">
                <div class="__shadown"
                    style="background: linear-gradient(rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.733) 100%, rgb(0, 0, 0) 100%);">
                </div>
            </div>

            <div class="_heroinfo_sumary">
                <div class="__heroinfo_attr_content">
                    <img :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/${getPrimaryAttribute(appHeroStore.info.attr)}.png`"
                        class="w-8 h-8">
                    <div class="_heroinfo_sumary_attr">Força</div>
                </div>
                <div class="_heroinfo_sumary_heroname">{{ appHeroStore.info.displayName }}</div>
            </div>

            <div class="__heroinfo_left_info">
                <img :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/${getPrimaryAttribute(appHeroStore.info.attr)}.png`"
                    class="w-6 h-6">
                <div class="__hero_left_text">{{ appHeroStore.info.displayName }}</div>
                <div class="__hero_left_heroid">{{ appHeroStore.info.id }}</div>
                <div class="__hero_left_line"></div>
            </div>
        </div>

        <div class="__heroinfo_counters">
            <div class="__heroinfo_counters_title">
                <div class="__heroinfo_counters_title_text">Counters:</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.__heroinfo_wrapper {
    width: 100%;
    color: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
}

.__heroinfo_container {
    width: 100%;
    min-height: 700px;
    padding: 40px 100px 0px 140px;
    background-color: #000;
    background-image: url(https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react//backgrounds/greyfade.jpg);
    background-size: 100% auto;
    background-position: center top;
    background-repeat: no-repeat;
    overflow: hidden;
    position: relative;
}

.__heroinfo_line_effect {
    width: 150%;
    height: 650px;
    background-color: #00000060;
    position: absolute;
    transform: skewY(-45deg) translateX(-50vw);
    overflow: hidden;
    animation-duration: 1.5s;
    animation-timing-function: ease-out;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-name: animation_opacity;
}

.__heroinfo_hero_container {
    align-items: flex-start;
    top: 50%;
    position: absolute;
    width: 80%;
    height: 100%;
    right: -5%;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    animation-duration: 1.3s;
    animation-timing-function: ease-out;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-name: animation_opacity;
}

._hero_video {
    width: 100%;
    min-height: 100%;
    max-width: 1500px;
    -webkit-mask-image: linear-gradient(to top, transparent 10%, black 50%);
    mask-image: linear-gradient(to top, transparent 10%, black 50%);
}

.__heroinfo_shadown {
    left: 0px;
    bottom: 0px;
    right: 0px;
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
}

.__shadown {
    position: absolute;
    width: 100%;
    height: 100%;
}

.__heroinfo_left_info {
    width: 800px;
    height: 50px;
    position: absolute;
    left: 100px;
    bottom: 80px;
    margin-right: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    animation-duration: 1s;
    animation-timing-function: ease-out;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-name: animation_left_stats;
    transform: rotate(270deg);
    transform-origin: bottom left;
}

.__hero_left_text {
    text-transform: uppercase;
    letter-spacing: 3px;
    font-family: Reaver, serif;
    font-size: 17px;
    font-weight: 600;
    margin-left: 12px;
}

.__hero_left_heroid {
    color: #888;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 18px;
    margin-left: 10px;
    transform: translateY(-2px);
}


.__hero_left_line {
    flex-grow: 1;
    height: 2px;
    background-color: #555;
    margin: 0px 8px 3px 8px;
}

._heroinfo_sumary {
    margin-top: 100px;
    margin-left: 30px;
    width: 35%;
    height: calc(90% - 100px);
    min-height: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 2;
    animation-duration: 1s;
    animation-timing-function: ease-out;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-name: animation_opacity;
}

.__heroinfo_attr_content {
    display: flex;
    flex-direction: row;
    align-items: center;
}

._heroinfo_sumary_attr {
    margin-left: 6px;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 100;
    font-size: 24px;
}

._heroinfo_sumary_heroname {
    margin-top: 12px;
    font-family: Reaver, serif;
    line-height: 110%;
    font-size: 80px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #fff;
}

.__heroinfo_counters {
    width: 100%;
    height: fit-content;
    min-height: 221px;
    background: linear-gradient(80deg, #151616 0%, #040505 100%);
    border-top: 2px solid #282828;
    border-bottom: 2px solid #2c2e2e;
    box-shadow: 0px 0px 8px #000;
    display: flex;
    justify-content: center;
    z-index: 2;
}

.__heroinfo_counters_title {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 60px;
}

.__heroinfo_counters_title_text {
    width: 100%;
    text-align: center;
    font-family: Reaver, serif;
    font-size: 20px;
    color: #fff;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-top: 40px;
    margin-bottom: 30px;
}

@keyframes animation_opacity {
    0% {
        opacity: 0
    }

    100% {
        opacity: 1
    }
}

@keyframes animation_opacity {
    0% {
        transform: translateX(-100px);
        opacity: 0
    }

    100% {
        transform: translateX(0px);
        opacity: 1
    }
}

@keyframes animation_left_stats {
    0% {
        transform: translateY(-90px) rotate(270deg);
        opacity: 0
    }

    100% {
        transform: translateY(0px) rotate(270deg);
        opacity: 1
    }
}

@keyframes animation_opacity_move {
    0% {
        transform: translateY(90px);
        opacity: 0
    }

    100% {
        transform: translateY(0px);
        opacity: 1
    }
}
</style>