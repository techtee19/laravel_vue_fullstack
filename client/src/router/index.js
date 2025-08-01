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
    from: from.name,
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    hasUser: !!authStore.user,
    localStorage: !!localStorage.getItem("token"),
  });

  // SIMPLIFIED: Always allow access to register and login pages
  if (to.name === "Register" || to.name === "Login") {
    console.log("Allowing access to auth page:", to.name);
    return next();
  }

  // For protected routes, require authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log("Redirecting to login - protected route requires auth");
    return next("/login");
  }

  console.log("Allowing navigation to", to.name);
  next();
});

export default router;
