export interface IHeroInfo {
    heroId: number,
    withData: [],
    againstData: []
}
export interface IHero {
    id: number,
    name: string,
    displayName: string,
    shortName: string,
    stats: {
        primaryAttribute: string
    }
    attr?: string
}

export interface IHeroesVs {
    heroId2: number,
    displayName: string,
    matchCount: number,
    shortName: string,
    synergy: number,
    winCount: number,
    winsAverage: number,
    winrate: number,
    difference: number,
    winRateHeroId1: number,
    winRateHeroId2: number,
}

export const primaryAttributes = [
    { name: 'agi', type: 'hero_agility' , sortName: 'Agilidade' },
    { name: 'str', type: 'hero_strength', sortName: 'Força' },
    { name: 'int', type: 'hero_intelligence', sortName: 'Inteligencia' },
    { name: 'all', type: 'hero_universal', sortName: 'Universal' },
];