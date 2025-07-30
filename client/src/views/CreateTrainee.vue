<template>
  <div class="max-w-2xl mx-auto p-6">
    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">Create a New Trainee</h2>
        <p class="mt-2 text-sm text-gray-600">Fill in the details below to create a new trainee profile</p>
      </div>

      <!-- Trainee Name -->
      <div class="space-y-1">
        <label for="name" class="block text-sm font-medium text-gray-700">Trainee Name</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter trainee's full name"
        />
        <div v-if="validation.name.error" class="text-red-600 text-sm">
          {{ validation.name.message }}
        </div>
      </div>

      <!-- Trainee Skill -->
      <div class="space-y-1">
        <label for="skill" class="block text-sm font-medium text-gray-700">
          Skill Level (0-100)
        </label>
        <input
          type="number"
          id="skill"
          v-model="form.skill"
          min="0"
          max="100"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Rate skill level from 0 to 100"
        />
        <div v-if="validation.skill.error" class="text-red-600 text-sm">
          {{ validation.skill.message }}
        </div>
      </div>

      <!-- Trainee Bio -->
      <div class="space-y-1">
        <label for="bio" class="block text-sm font-medium text-gray-700">
          Biography
          <span class="text-gray-500 text-xs">(minimum 20 characters)</span>
        </label>
        <textarea
          rows="5"
          id="bio"
          v-model="form.bio"
          required
          class="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          :class="{
            'border-red-300 focus:ring-red-500 focus:border-red-500': validation.bio.error,
            'border-green-300 focus:ring-green-500 focus:border-green-500': validation.bio.valid
          }"
          placeholder="Tell us about the trainee's background, experience, and goals..."
        ></textarea>
        <div class="flex justify-between items-center">
          <div>
            <div v-if="validation.bio.error" class="text-red-600 text-sm">
              {{ validation.bio.message }}
            </div>
            <div v-else-if="validation.bio.valid" class="text-green-600 text-sm">
              ✓ Biography looks good!
            </div>
          </div>
          <div class="text-sm" :class="{
            'text-red-600': form.bio.length < 20 && form.bio.length > 0,
            'text-green-600': form.bio.length >= 20,
            'text-gray-500': form.bio.length === 0
          }">
            {{ form.bio.length }}/20 characters
          </div>
        </div>
      </div>

      <!-- Training Center Selection -->
      <div class="space-y-1">
        <label for="training_center_id" class="block text-sm font-medium text-gray-700">
          Training Center
        </label>
        <select
          id="training_center_id"
          v-model="form.training_center_id"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="" disabled>Select a Training Center</option>
          <option
            v-for="center in trainingCenters"
            :key="center.id"
            :value="center.id"
          >
            {{ center.name }}
          </option>
        </select>
        <div v-if="validation.training_center_id.error" class="text-red-600 text-sm">
          {{ validation.training_center_id.message }}
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="!isFormValid"
        class="w-full py-3 px-4 rounded-md text-white font-medium transition duration-200"
        :class="{
          'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500': isFormValid,
          'bg-gray-400 cursor-not-allowed': !isFormValid
        }"
      >
        <span v-if="isFormValid">Create Trainee</span>
        <span v-else>Please fill all required fields correctly</span>
      </button>

      <!-- Validation Summary -->
      <div v-if="!isFormValid && hasAttemptedSubmit" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">Please fix the following issues:</h3>
            <ul class="mt-2 text-sm text-yellow-700 list-disc list-inside">
              <li v-if="validation.name.error">{{ validation.name.message }}</li>
              <li v-if="validation.skill.error">{{ validation.skill.message }}</li>
              <li v-if="validation.bio.error">{{ validation.bio.message }}</li>
              <li v-if="validation.training_center_id.error">{{ validation.training_center_id.message }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Server Errors -->
      <div v-if="errors.length" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Server Error</h3>
            <ul class="mt-2 text-sm text-red-700">
              <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import api from "../services/api.js";

export default {
  data() {
    return {
      form: {
        name: "",
        skill: "",
        bio: "",
        training_center_id: "",
      },
      trainingCenters: [],
      errors: [],
      hasAttemptedSubmit: false,
    };
  },

  computed: {
    validation() {
      return {
        name: {
          error: this.form.name.length > 0 && this.form.name.length < 2,
          valid: this.form.name.length >= 2,
          message: "Name must be at least 2 characters long"
        },
        skill: {
          error: this.form.skill !== "" && (this.form.skill < 0 || this.form.skill > 100),
          valid: this.form.skill >= 0 && this.form.skill <= 100,
          message: "Skill level must be between 0 and 100"
        },
        bio: {
          error: this.form.bio.length > 0 && this.form.bio.length < 20,
          valid: this.form.bio.length >= 20,
          message: `Biography must be at least 20 characters long (currently ${this.form.bio.length})`
        },
        training_center_id: {
          error: this.hasAttemptedSubmit && !this.form.training_center_id,
          valid: !!this.form.training_center_id,
          message: "Please select a training center"
        }
      };
    },

    isFormValid() {
      return (
        this.form.name.length >= 2 &&
        this.form.skill >= 0 &&
        this.form.skill <= 100 &&
        this.form.bio.length >= 20 &&
        this.form.training_center_id !== ""
      );
    }
  },

  methods: {
    async fetchTrainingCenters() {
      try {
        const response = await api.getTrainingCenters();
        this.trainingCenters = response.data.data;
        console.log("Training centers loaded:", this.trainingCenters);
      } catch (error) {
        console.error(
          "Error fetching training centers:",
          error.response?.data?.message || error.message
        );
        this.errors.push("Failed to load training centers. Please refresh the page.");
      }
    },

    async submitForm() {
      this.hasAttemptedSubmit = true;
      this.errors = []; // Clear previous errors

      // Client-side validation
      if (!this.isFormValid) {
        return; // Form validation will show the errors
      }

      try {
        const formData = {
          name: this.form.name.trim(),
          skill: parseInt(this.form.skill),
          bio: this.form.bio.trim(),
          training_center_id: parseInt(this.form.training_center_id),
        };

        const response = await api.createTrainee(formData);
        if (response.data.success) {
          // Success notification
          this.$router.push({ 
            name: "TraineesList",
            params: { message: "Trainee created successfully!" }
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        
        // Handle validation errors from server
        if (error.response?.data?.errors) {
          const serverErrors = error.response.data.errors;
          Object.keys(serverErrors).forEach(field => {
            if (Array.isArray(serverErrors[field])) {
              this.errors.push(...serverErrors[field]);
            } else {
              this.errors.push(serverErrors[field]);
            }
          });
        } else if (error.response?.data?.message) {
          this.errors.push(error.response.data.message);
        } else {
          this.errors.push("Failed to create trainee. Please try again.");
        }
      }
    },
  },

  mounted() {
    this.fetchTrainingCenters();
  },
};
</script>

<style scoped></style>
