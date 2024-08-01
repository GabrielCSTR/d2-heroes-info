export const queryGetAllHeroes = 
`
query {
    constants {
        heroes {
            id
            name
            displayName
            shortName
            stats {
                primaryAttribute
            }
        }
    }
}
    `
export const queryGetHeroInfo = `
query GetHeroMatchUps($heroId: Short!, $matchLimit: Int!, $bracketBasicIds: [RankBracketBasicEnum]) {
        heroStats {
                heroVsHeroMatchup(
                    heroId: $heroId

                    matchLimit: $matchLimit
                    bracketBasicIds: $bracketBasicIds
                ) {
                advantage {
                    heroId
                    matchCountWith
                    matchCountVs
                with {
                        heroId2
                        matchCount
                        winCount
                        synergy
                        winsAverage
                    }
                vs {
                    heroId2
                    matchCount
                    winCount
                    synergy
                    winsAverage
                }
            }
        }
    }
}
`;