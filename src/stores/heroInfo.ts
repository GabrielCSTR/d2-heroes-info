import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IHero } from '@/constants';

export const useHeroeStore = defineStore('hero', {
    state: () => ({
		info: {} as IHero,
        allHeroes: [] as IHero[],
	}),
    actions: {
        SET_ALL_HEROES(heroes: any[]) {
			this.allHeroes = heroes;
		},
        GET_ALL_HEROES() {
			return this.allHeroes;
		},
        SET_CURRENT_HERO(heroInfo: any) {
			this.info = heroInfo;
		},
        GET_CURRENT_HERO() {
			return this.info;
		},
    }
})
