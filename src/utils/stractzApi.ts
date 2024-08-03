import axios from "axios";
import { queryGetAllHeroes } from "./stractzQuery";
import type { IHero } from "@/constants";
import { useHeroeStore } from "@/stores/heroInfo";

const headers = {
    'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`
}
export const API_URL = import.meta.env.VITE_API_URL;

export const stractzApi = axios.create({
    baseURL: API_URL,
    headers
})

export const getAllHeroes = async () =>{
    await stractzApi
    .post(
        API_URL,
        {
            query: queryGetAllHeroes,
        },
    )
    .then((reponse) => {
        const { heroes } = reponse?.data?.data?.constants;
        const appHeroStore: any = useHeroeStore();
        const allHeroes = heroes.sort((a: IHero, b: IHero) => a.displayName.localeCompare(b.displayName));
        appHeroStore.SET_ALL_HEROES(allHeroes)
    })
    .catch((err) => {
        console.error('Error:', err);
    })
}