<script lang="ts" setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { API_URL, queryGetAllHeroes, stractzApi } from '@/utils'
import { type IHero } from '@/constants'
import { reactive } from 'vue';
import { computed } from 'vue';

const toggleFilter = ref();
const primaryAttribute = [
    { name: 'agi', type: 'hero_agility' },
    { name: 'str', type: 'hero_strength' },
    { name: 'int', type: 'hero_intelligence' },
    { name: 'all', type: 'hero_universal' },
]

const state = reactive({
    search: null as any,
    heroes: [] as IHero[],
    filterAttribute: null as any,
});

onMounted(async () => {
    await stractzApi
        .post(
            API_URL,
            {
                query: queryGetAllHeroes,
            },
        )
        .then((reponse) => {
            const { heroes } = reponse?.data?.data?.constants;
            console.log("DATA", heroes);
            state.heroes = heroes.sort((a: IHero, b: IHero) => a.displayName.localeCompare(b.displayName));
        })
        .catch((err) => {
            console.error('Error:', err);
        })
})

const getPrimaryAttribute = (attr: string) => {
    return primaryAttribute.find((item) => item.name === attr)?.type ?? '';
}


const heroesFilter = computed(() => {
    let filteredHeroes = state.heroes;

     if (state.search) {
        filteredHeroes = filteredHeroes.filter((item) => {
            return state.search
                .toLowerCase()
                .split(" ")
                .every((v: any) => item.displayName.toLowerCase().includes(v));
        });
    }

    if (state.filterAttribute) {
        filteredHeroes = filteredHeroes.filter((item) => item.stats.primaryAttribute === state.filterAttribute);
    }

    return filteredHeroes;
});

const toggleFilterAttr = (attr: string) => {
    toggleFilter.value = attr.trim();
    if (state.filterAttribute === attr) {
        state.filterAttribute = ''; 
        toggleFilter.value = '';
    } else {
        state.filterAttribute = attr;
    }
}
</script>

<template>
    <section class="section_main"
        style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/backgrounds/greyfade.jpg&quot;);">
        <div class="flex flex-col justify-center items-center">
            <h1 class="section_title"> Escolha o seu herói</h1>
            <div class="section_desc">
                <p>Escolha seu herói favorito, conheça as habilidades, atributos e vantagens de cada um. veja
                    informações completa de cada heroi e seus counter heroes com base no meta atual!</p>
            </div>
            <!-- SEARCH -->
            <div class="search_container">
                <h1>Filtrar heróis</h1>
                <div class="attr_container">
                    <h1>Atributo</h1>
                    <div v-on:click="toggleFilterAttr('str')" :class="toggleFilter === 'str' ? 'toggleFilter': '' " class="attr_image"
                        style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/herogrid/filter-str-active.png&quot;);">
                    </div>
                    <div v-on:click="toggleFilterAttr('agi')" :class="toggleFilter === 'agi' ? 'toggleFilter': '' " class="attr_image"
                        style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/herogrid/filter-agi-active.png&quot;);">
                    </div>
                    <div v-on:click="toggleFilterAttr('int')" :class="toggleFilter === 'int' ? 'toggleFilter': '' " class="attr_image"
                        style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/herogrid/filter-int-active.png&quot;);">
                    </div>
                    <div v-on:click="toggleFilterAttr('all')" :class="toggleFilter === 'all' ? 'toggleFilter': '' " class="attr_image"
                        style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/herogrid/filter-uni-active.png&quot;);">
                    </div>
                </div>

                <div class="filter">
                    <div class="filter_content">
                        <div class="filter_img"
                            style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/search.svg&quot;);">
                        </div>
                        <form><input v-model="state.search" type="search"></form>
                    </div>
                </div>
            </div>

            <!-- HEROES -->
            <div :class="heroesFilter.length === 124 ? 'flex items-center justify-center' : 'flex items-start justify-start'"
                class="py-4 md:py-5 flex-wrap mt-6 pb-10 main w-full h-full">
                <div class="group hero_content flex flex-col justify-center items-center shadow-gray-700 transform hover:-translate-y-1 hover:scale-125 hover:z-50 z-10"
                    v-for="hero in heroesFilter" :key="hero.id"
                    :style="`background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.shortName}.png&quot;);left: calc(0% + 122px);top: calc(994px);`">
                    <img v-show="hero.id !== 6"
                        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.shortName}.png`"
                        alt="Hero image" class="w-full">
                    <div class="hidden hero_hover_text group-hover:flex w-full h-8 z-30">
                        <img class="w-7 h-7"
                            :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/${getPrimaryAttribute(hero.stats.primaryAttribute)}.png`" />
                        <span class="hero_text">{{
                            hero.displayName }}</span>
                    </div>
                    <div class="hidden group-hover:flex hero_shadow z-10">
                        <div class="hero_shadow_main hero_shadow_main_content">
                            <div class="hero_shadow_hover"
                                style="background: linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.733) 75%, rgb(0, 0, 0) 100%);">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<style scoped>
* {
    box-sizing: border-box;
    font-family: "Radiance", "Noto Sans", sans-serif;
}

.main {
    /* width: 1200px; */
    min-height: 1500px;
    margin-top: 15px;
    transition-property: height;
    transition-timing-function: ease-out;
    transition-duration: .2s;
    animation-duration: 1s;
    animation-timing-function: ease-out;
    animation-delay: .1s;
    animation-iteration-count: 1;
    animation-name: NeQOPQgh06ixPcmoyJM01;
    position: relative;
}

.section_main {
    width: 100%;
    padding: 0px 100px 0px 100px;
    min-height: 1500px;
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position: center top;
    background-attachment: fixed;
    position: relative;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.section_title {
    color: #fff;
    font-size: 60px;
    font-family: Reaver, serif;
    font-weight: bold;
    text-align: center;
    margin-top: 100px;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 3px;
    line-height: 112%;
}

.section_desc {
    width: 100%;
    max-width: 1000px;
    margin: 0px auto;
    color: #ddd;
    font-size: 26px;
    text-align: center;
    font-weight: 100;
    margin-bottom: 30px;
}

.search_container {
    width: 100%;
    max-width: 1200px;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #11111190;
    box-shadow: 0px 0px 30px #00000050;
    margin-top: 20px;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));

    h1 {
        color: #fff;
        width: 180px;
        font-size: 18px;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-right: 10px;
        margin-left: 10px;
    }
}

.attr_container {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 20px;

    h1 {
        color: #808fa6;
        font-size: 17px;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-right: 20px;
    }
}

.attr_image {
    width: 44px;
    height: 34px;
    margin-left: -4px;
    background-size: cover;
    background-repeat: no-repeat;
    transition-property: filter;
    transition-timing-function: ease-in-out;
    transition-duration: .1s;
    cursor: pointer;
    color: #fff;
    filter: brightness(0.5) saturate(0);
}

.filter {
    width: 250px;
    display: flex;
    flex-direction: row;
    justify-content: right;
}

.filter_content {
    width: 250px;
    height: 50px;
    margin-left: 10px;
    background-color: #25282a;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.filter_img {
    width: 26px;
    height: 26px;
    min-width: 26px;
    min-height: 26px;
    margin-right: 10px;
    margin-left: 10px;
    background-size: cover;
    background-repeat: no-repeat;
}

form {
    flex-grow: 1;
    margin-right: 10px;
}

input {
    height: 30px;
    width: 100%;
    border: 0px solid transparent;
    background-color: #25282a;
    outline: none;
    color: #fff;
    font-size: 18px;
    padding: 4px;
}

.hero_content {
    margin: 5px;
    box-shadow: 1px 1px 4px #000;
    filter: saturate(0.8);
    transition-property: transform, box-shadow, background-size, opacity, top, left;
    transition-timing-function: ease-out;
    transition-duration: .3s;
    background-position: center;
    background-size: 110%;
    background-repeat: no-repeat;
    overflow: hidden;
    cursor: pointer;
}

.hero_text {
    font-size: 18px;
    line-height: 20px;
    font-family: "Reaver", serif;
    font-weight: 600;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 8px;
    padding-left: 0px;
    text-shadow: 0px 0px 4px #000;
}

.hero_hover_text {
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0px;
    left: 5px;
    flex-direction: row;
    align-items: center;
    transition-property: opacity, bottom;
    transition-timing-function: ease-out;
    transition-duration: .2s;
}

.hero_shadow_content {
    width: 100%;
    height: 100%;
    position: absolute;
    transition-property: opacity, bottom;
    transition-timing-function: ease-out;
    transition-duration: .2s;
    opacity: 0;
}

.hero_shadow_main {
    left: 0px;
    bottom: 0px;
    right: 0px;
}

.hero_shadow_main_content {
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
}

.hero_shadow_hover {
    position: absolute;
    width: 100%;
    height: 100%;
}

.toggleFilter {
    filter: brightness(1) saturate(1);
}

@keyframes NeQOPQgh06ixPcmoyJM01 {
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