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