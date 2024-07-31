<script lang="ts" setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { API_URL, queryGetAllHeroes, stractzApi } from '@/utils'
import { type IHero } from '@/constants'

const allHeroes = ref();
const primaryAttribute = [
    { name: 'agi', type: 'hero_agility' },
    { name: 'str', type: 'hero_strength' },
    { name: 'int', type: 'hero_intelligence' },
    { name: 'all', type: 'hero_universal' },
]

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
            allHeroes.value = heroes.sort((a: IHero, b: IHero) => a.displayName.localeCompare(b.displayName));
        })
        .catch((err) => {
            console.error('Error:', err);
        })
})

const getPrimaryAttribute = (attr: string) => {
    return primaryAttribute.find((item) => item.name === attr)?.type ?? '';
}

</script>

<template>
    <section class="container mx-auto mt-10">
        <div class="flex flex-col justify-center items-center">
            <h1 class="font-sans font-bold text-4xl uppercase"> Escolha o seu herói</h1>
            <!-- SEARCH -->
            <div class="flex justify-center items-center bg-gray-700 w-full h-20 mt-5 rounded">
                <h1>COMPONENTS SEARCH</h1>
            </div>

            <!-- HEROES -->
            <div class="grid grid-cols-4 gap-4 mt-6 pb-10">
                <div class="group flex flex-col justify-center items-center border-2 cursor-pointer border-gray-400 hover:border-gray-800 shadow-md shadow-gray-700 transition duration-150 ease-out transform hover:-translate-y-1 hover:scale-125 hover:z-50 z-10"
                    v-for="hero in allHeroes" :key="hero.id">
                    <img :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.shortName}.png`"
                        alt="Hero image" class="w-[225] h-[127]">
                    <div
                        class="hidden pl-2 mb-1 items-center absolute left-0 bottom-0 right-0 group-hover:flex w-full h-8">
                        <img class="w-7 h-7"
                            :src="`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/${getPrimaryAttribute(hero.stats.primaryAttribute)}.png`" />
                        <span
                            class="pl-2 text-white drop-shadow-[2px_2px_var(--tw-shadow-color)] shadow-gray-950 text-sm font-bold font-sans uppercase">{{
                                hero.displayName }}</span>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>