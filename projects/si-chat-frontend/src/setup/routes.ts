import { type App, inject } from 'vue';
import { createRouter, createWebHistory, type RouteRecordRaw  } from 'vue-router'
import { AuthServiceSymbol } from 'domain/authentication';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';

export enum Route {
    Home = 'home',
    Login = 'login'
}

const routes:RouteRecordRaw[] = [
    {
        path: '/',
        component: HomeView,
        meta: {
            authRequired: true
        }
    },
    {
        path: '/home',
        name: Route.Home,
        redirect: '/'
    },
    {
        path: '/login',
        name: Route.Login,
        component: LoginView
    }
];

export function registerRoutes<T>(app: App<T>) {
    const baseUrl = import.meta.env.BASE_URL;
    const router = createRouter({        
        history: createWebHistory(baseUrl),
        routes 
    });

    router.beforeEach((to) => {
        const { authRequired } = to.meta;
        const auth = inject(AuthServiceSymbol);
        const authenticated = auth?.authenticated ?? false;

        if(!!authRequired && !authenticated) {
            return {
                name: Route.Login,
            }
        }

        if(to.name === Route.Login && authenticated){
            return {
                name: Route.Home
            }
        }
    });

    app.use(router);

    return router;
}

declare module 'vue-router' {
    interface RouteMeta {
        /**
         * This route requires authentication to access.
         */
        authRequired?: boolean
    }
}