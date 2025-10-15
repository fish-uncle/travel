import { createRouter, createWebHistory, type Router } from "vue-router";

const routes: Array<any> = [];
//@ts-ignore
const files = import.meta.glob("./pages/**/*.route.ts", { eager: true });

for (const key in files) {
  routes.push((files[key] as any).default);
}

const router: Router = createRouter({
  history: createWebHistory(),
  routes: [...routes],
});

export { router, routes };
