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