import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IHero } from '@/constants';

export const useHeroeStore = defineStore('hero', {
    state: () => ({
		info: {} as IHero,
	}),
    actions: {
        SET_CURRENT_HERO(heroInfo: any) {
			this.info = heroInfo;
		},
        GET_CURRENT_HERO() {
			return this.info;
		},
    }
})
