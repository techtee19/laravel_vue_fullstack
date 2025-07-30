<template>
  <div class="px-8 py-12 text-center">
    <h1>Welcome to the Trainee Network</h1>
    <p>Click the button below to view the list of trainees.</p>

    <router-link :to="{ name: 'TraineesList' }" class="inline-block mt-4 btn">
      Find Trainees!
    </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
