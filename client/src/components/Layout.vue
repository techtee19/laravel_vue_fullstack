<template>
  <div>
    <header>
      <nav class="flex justify-between items-center p-4 bg-gray-100">
        <h1>
          <router-link to="/" class="text-xl font-bold"
            >Trainee Network</router-link
          >
        </h1>

        <div class="flex gap-4">
          <template v-if="authStore.isAuthenticated">
            <router-link
              :to="{ name: 'TraineesList' }"
              class="hover:text-blue-600"
              >All Trainees</router-link
            >
            <router-link
              :to="{ name: 'CreateTrainee' }"
              class="hover:text-blue-600"
              >Create New Trainee</router-link
            >
            <button @click="logout" class="hover:text-red-600">Logout</button>
          </template>

          <template v-else>
            <router-link :to="{ name: 'Login' }" class="hover:text-blue-600"
              >Login</router-link
            >
            <router-link :to="{ name: 'Register' }" class="hover:text-blue-600"
              >Register</router-link
            >
          </template>
        </div>
      </nav>
    </header>

    <main class="container mx-auto p-4">
      <slot />
    </main>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

export default {
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const logout = async () => {
      await authStore.logout();
      router.push("/login");
    };

    return {
      authStore,
      logout,
    };
  },
};
</script>

<style scoped></style>
