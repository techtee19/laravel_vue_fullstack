import HomeView from "@/views/HomeView.vue";
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/trainees",
      name: "TraineesList",
      component: () => import("../views/TraineesList.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/trainees/:id",
      name: "TraineeProfile",
      component: () => import("@/views/TraineeProfile.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/trainees/create",
      name: "CreateTrainee",
      component: () => import("../views/CreateTrainee.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/trainees/:id/edit",
      name: "EditTrainee",
      component: () => import("@/views/EditTrainee.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("../views/Register.vue"),
    },
  ],
});

// Add navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  console.log("Router guard:", {
    to: to.name,
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    hasUser: !!authStore.user,
  });

  // Allow navigation to protected routes only if authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log("Redirecting to login - auth required but not authenticated");
    return next("/login");
  }

  // Only redirect if user is truly authenticated and trying to access auth pages
  // This prevents bouncing when auth state is being initialized
  if (
    (to.name === "Login" || to.name === "Register") &&
    authStore.isAuthenticated &&
    authStore.token &&
    authStore.user
  ) {
    console.log("Redirecting to trainees - user already authenticated");
    return next("/trainees");
  }

  console.log("Allowing navigation to", to.name);
  next();
});

export default router;
