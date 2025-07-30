import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import Trainee from "./Trainee.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";

const app = createApp(Trainee);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize authentication after Pinia is set up
const authStore = useAuthStore();
authStore.initializeAuth();

// Add to window for debugging (remove in production)
// if (import.meta.env.DEV) {
//   window.authStore = authStore;
//   window.clearAuth = () => authStore.forceLogout();
//   window.debugAuth = () => authStore.debugAuthState();
// }

app.mount("#app");
