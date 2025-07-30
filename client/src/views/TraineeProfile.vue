<template>
  <div>
    <h2>{{ trainee.name }}'s Profile</h2>

    <!-- Trainee Info -->
    <div class="p-4 bg-gray-200 rounded">
      <p><strong>Skill level:</strong> {{ trainee.skill }}</p>
      <p><strong>Id:</strong> {{ trainee.id }}</p>
      <p><strong>About me:</strong></p>
      <p>{{ trainee.bio }}</p>
    </div>

    <!-- Training Center Info -->
    <div class="px-4 pb-4 my-4 bg-white border-2 border-dashed rounded">
      <h3>Training Center Information</h3>
      <p>
        <strong>Training Center name:</strong>
        {{ trainee.training_center.name }}
      </p>
      <p><strong>Location:</strong> {{ trainee.training_center.location }}</p>
      <p><strong>About the Training Center:</strong></p>
      <p>{{ trainee.training_center.description }}</p>
    </div>

    <!-- Delete a Trainee -->
    <form @submit.prevent="deleteTrainee(trainee.id)">
      <button type="submit" class="my-4 btn">Delete Trainee</button>
    </form>
  </div>
</template>

<script>
import api from "../services/api.js";

export default {
  name: "TraineeProfile",

  data() {
    return {
      trainee: {
        name: "",
        skill: "",
        id: null,
        bio: "",
        training_center: {
          name: "",
          location: "",
          description: "",
        },
      },
    };
  },
  methods: {
    async fetchTrainee(id) {
      try {
        const response = await api.getTraineeById(id);
        this.trainee = response.data.data;
      } catch (error) {
        console.error(
          "Error fetching trainee:",
          error.response?.data?.message || error.message
        );
      }
    },
    async deleteTrainee(id) {
      if (confirm("Are you sure you want to delete this trainee?")) {
        try {
          await api.deleteTrainee(id);
          this.$router.push("/trainees");
        } catch (error) {
          console.error(
            "Error deleting trainee:",
            error.response?.data?.message || error.message
          );
        }
      }
    },
  },
  mounted() {
    const traineeId = this.$route.params.id; // Get trainee ID from route params
    console.log("Trainee ID:", traineeId);

    this.fetchTrainee(traineeId);
  },
};
</script>

<style scoped></style>
