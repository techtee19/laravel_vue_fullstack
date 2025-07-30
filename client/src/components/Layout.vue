<template>
  <div>
    <header>
      <nav>
        <h1>
          <router-link to="/">Trainee Network</router-link>
        </h1>
        <router-link :to="{ name: 'TraineesList' }">All Trainee</router-link>
        <router-link :to="{ name: 'CreateTrainee' }"
          >Create New Trainee</router-link
        >
      </nav>
    </header>

    <main class="container">
      <slot />
    </main>
  </div>
</template>

<script>
export default {};
</script>

<style scoped></style>
