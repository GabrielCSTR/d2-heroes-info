import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from "vue-router";


export const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Home",
        component: () => import("@/pages/Home.vue"),
    },
    {
        path: "/hero/:name",
        name: "HeroDetails",
        component: () => import("@/pages/heroinfo/[id].vue"),
    },
    // {
    // 	path: "/:catchAll(.*)",
    // 	name: "not_found",
    // 	component: () => import("@/pages/Errors/404.vue"),
    // },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, _, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: "smooth",
            };
        } else if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});

export default router;
