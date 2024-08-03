<script lang="ts" setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { API_URL, queryGetAllHeroes, stractzApi } from '@/utils'
import { type IHero } from '@/constants'
import { reactive } from 'vue';
import { computed } from 'vue';
import { useHeroeStore } from '@/stores/heroInfo';

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

const appHeroStore: any = useHeroeStore();

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
            appHeroStore.SET_ALL_HEROES(state.heroes)

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
                    <div v-on:click="toggleFilterAttr('str')" :class="toggleFilter === 'str' ? 'toggleFilter' : ''"
                        class="attr_image"
                        style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/herogrid/filter-str-active.png&quot;);">
                    </div>
                    <div v-on:click="toggleFilterAttr('agi')" :class="toggleFilter === 'agi' ? 'toggleFilter' : ''"
                        class="attr_image"
                        style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/herogrid/filter-agi-active.png&quot;);">
                    </div>
                    <div v-on:click="toggleFilterAttr('int')" :class="toggleFilter === 'int' ? 'toggleFilter' : ''"
                        class="attr_image"
                        style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/herogrid/filter-int-active.png&quot;);">
                    </div>
                    <div v-on:click="toggleFilterAttr('all')" :class="toggleFilter === 'all' ? 'toggleFilter' : ''"
                        class="attr_image"
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
            <TransitionGroup name="heroes" tag="div"
                :class="heroesFilter.length === 124 ? 'flex items-center justify-center' : 'flex items-start justify-start; min-h-[500px]'"
                class="py-4 md:py-5 flex-wrap mt-6 pb-10 main w-full h-full">
                <router-link :to="{ name: 'HeroDetails', params: { id: hero.id, name: hero.shortName, shortName: hero.shortName, displayName: hero.displayName, attr: hero.stats.primaryAttribute}}" class="group hero_content flex flex-col justify-center items-center shadow-gray-700 transform hover:-translate-y-1 hover:scale-125 hover:z-50 z-10"
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
                </router-link>
            </TransitionGroup>
        </div>
    </section>
</template>

<style scoped>
.heroes-enter-active, .heroes-leave-active {
  transition: all 0.5s;
}
.heroes-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
.heroes-enter-to {
  opacity: 1;
  transform: scale(1);
}
.heroes-leave-from {
  opacity: 1;
  transform: scale(1);
}
.heroes-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

</style>