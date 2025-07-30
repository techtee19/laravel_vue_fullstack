<template>
  <div>
    <h1>Welcome to the Training Center App</h1>
    <router-link v-if="!isAuthenticated" to="/login">Login</router-link> |
    <router-link v-if="!isAuthenticated" to="/register">Register</router-link>
    <router-link v-if="isAuthenticated" to="/trainees">Trainees</router-link>
    <button v-if="isAuthenticated" @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();
const isAuthenticated = ref(!!localStorage.getItem("token"));

function logout() {
  api.setAuthToken(localStorage.getItem("token"));
  api.logout().finally(() => {
    localStorage.removeItem("token");
    isAuthenticated.value = false;
    router.push("/login");
  });
}
</script>

<style lang="scss" scoped></style>
