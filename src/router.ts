import { createRouter, createMemoryHistory, type Router } from "vue-router";

const routes: Array<any> = [];
//@ts-ignore
const files = import.meta.glob("./pages/**/*.route.ts", { eager: true });

for (const key in files) {
  routes.push((files[key] as any).default);
}

const router: Router = createRouter({
  history: createMemoryHistory(),
  routes: [...routes],
});

export { router, routes };
