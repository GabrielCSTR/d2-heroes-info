<script lang="ts" setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { API_URL, queryGetAllHeroes, stractzApi } from '@/utils'
import { type IHero } from '@/constants'
import { reactive } from 'vue';
import { computed } from 'vue';
import { useHeroeStore } from '@/stores/heroInfo';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

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
const isLoading = ref(true);

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
            state.heroes = heroes.sort((a: IHero, b: IHero) => a.displayName.localeCompare(b.displayName));
            appHeroStore.SET_ALL_HEROES(state.heroes)

        })
        .catch((err) => {
            console.error('Error:', err);
        }).finally(() => {
            isLoading.value = false;
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
    <section class="w-full min-h-screen px-[100px] bg-cover bg-no-repeat bg-center-top bg-fixed relative flex flex-col items-center bg-[url('https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/backgrounds/greyfade.jpg')]" >
        <div class="flex flex-col justify-center items-center">
            <h1 class="text-white text-[60px] font-reaver font-bold text-center mt-[100px] mb-[10px] uppercase tracking-[3px] leading-[112%]"> Escolha o seu herói</h1>
            <div class="w-full max-w-[1000px] mx-auto text-gray-400 text-[26px] text-center font-thin mb-[30px]">
                <p>Escolha seu herói favorito, conheça as habilidades, atributos e vantagens de cada um. veja
                    informações completa de cada heroi e seus counter heroes com base no meta atual!</p>
            </div>
            <!-- SEARCH -->
            <div class="w-full max-w-[1200px] p-[10px] rounded-[5px] flex flex-row justify-between items-center border border-[#11111190] shadow-[0_0_30px_#00000050] mt-[20px] bg-gradient-to-r from-[rgba(0,0,0,0.5)] to-[rgba(0,0,0,0.3)]">
                <h1 class="text-white w-[180px] text-[18px] uppercase tracking-[2px] mr-[10px] ml-[10px]">Filtrar heróis</h1>
                <div class="flex items-center ml-5">
                    <h1 class="text-[#808fa6] text-[17px] uppercase tracking-[2px] mr-[20px]">Atributo</h1>
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

                <div class="w-[250px] flex flex-row justify-end">
                    <div class="w-[250px] h-[50px] ml-[10px] bg-[#25282a] flex flex-row items-center">
                        <div class="w-[26px] h-[26px] min-w-[26px] min-h-[26px] mr-[10px] ml-[10px] bg-cover bg-no-repeat"
                            style="background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/search.svg&quot;);">
                        </div>
                        <form><input v-model="state.search" type="search"></form>
                    </div>
                </div>
            </div>
            
            <LoadingSpinner v-if="isLoading" :isLoading="isLoading" />
            <!-- HEROES -->
            <TransitionGroup v-else name="heroes" tag="div"
                :class="heroesFilter.length === 124 ? 'flex items-center justify-center' : 'flex items-start justify-start; min-h-[500px]'"
                class="py-4 md:py-5 flex-wrap mt-6 pb-10 main w-full h-full">
                <router-link :to="{ name: 'HeroDetails', params: { id: hero.id, name: hero.shortName, shortName: hero.shortName, displayName: hero.displayName, attr: hero.stats.primaryAttribute}}" class="group hero_content flex flex-col justify-center items-center shadow-gray-700 transform hover:-translate-y-1 hover:scale-125 hover:z-50 z-10"
                    v-for="hero in heroesFilter" :key="hero.id"
                    :style="`background-image: url(&quot;https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.shortName}.png&quot;);left: calc(0% + 122px);top: calc(994px);`">
                    <img v-show="hero.id !== 6"
                        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.shortName}.png`"
                        alt="Hero image" class="w-full">
                    <div class="hidden w-full h-[50px] absolute bottom-0 left-[5px] flex-row items-center transition-opacity transition-bottom ease-out duration-[0.2s] group-hover:flex  z-30">
                        <img class="w-7 h-7"
                            :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/${getPrimaryAttribute(hero.stats.primaryAttribute)}.png`" />
                        <span class="text-[18px] leading-[20px] font-reaver font-semibold text-white uppercase tracking-[1px] p-[8px] pl-0 text-shadow-[0_0_4px_#000]">{{
                            hero.displayName }}</span>
                    </div>
                    <div class="hidden group-hover:flex hero_shadow z-10">
                        <div class="absolute left-0 bottom-0 right-0 w-full h-full pointer-events-none">
                            <div class="absolute w-full h-full"
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