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
export const queryGetHeroInfo= (heroId: number) =>
`query getHeroMatchups {
    heroStats {
        matchUp(heroId: ${heroId}, matchLimit: 0, take: 130, bracketBasicIds: [CRUSADER_ARCHON, LEGEND_ANCIENT, DIVINE_IMMORTAL]) {
            heroId
            vs {
                heroId2
                synergy
                matchCount
                winCount
                winRateHeroId1
                winRateHeroId2
            }
            with {
                heroId2
                synergy
                matchCount
                winCount
                winRateHeroId1
                winRateHeroId2
            }
        }
    }
}`;