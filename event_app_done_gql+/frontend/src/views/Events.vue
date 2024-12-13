<template>
  <div class="max-w-6xl mx-auto p-6">
      <div class="flex justify-end mb-4 relative">
          <button
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 shadow-md"
              @click="openFilter"
          >
              Пошуковий фільтр
          </button>

          <div v-if="isModalOpen" class="absolute bg-white shadow-lg rounded-lg p-4 mt-2 z-10 w-64">
              <div class="mb-4">
                  <label for="category" class="block mb-1 font-medium text-gray-700">Категорія</label>
                  <select v-model="selectedCategory" name="by_category" id="category" class="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-500">
                      <option value="">Виберіть категорію</option>
                      <option>Cat</option>
                      <option>Category</option>
                  </select>
              </div>

              <div class="mb-4">
                  <label for="time" class="block mb-1 font-medium text-gray-700">Дата</label>
                  <input v-model="selectedDate" type="date" id="time" class="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-500" />
              </div>

              <div class="mb-4">
                  <label class="block mb-1 font-medium text-gray-700">За літерою</label>
                  <select v-model="selectedLetter" class="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-500">
                      <option value="">Виберіть літеру</option>
                      <option v-for="letter in letters" :key="letter" :value="letter">{{ letter }}</option>
                  </select>
              </div>

              <button
                  @click="closeFilter"
                  class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 w-full"
              >
                  Закрити
              </button>
          </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
              v-for="(event, index) in filteredEvents.slice(0, 9)"
              :key="index"
              class="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
          >
              <img
                  :src='"http://localhost:5000"+event.image'
                  :alt="event.title"
                  class="w-full h-48 object-cover"
              />
              <div class="p-4">
                  <h5 class="text-xl font-semibold mb-2">{{ event.title }}</h5>
                  <p class="text-gray-600">{{ event.date }}</p>
                  <p class="text-gray-600">{{ event.category }}</p>
                  <p class="text-gray-700 mb-4">{{ event.description }}</p>
                  <div class="mt-4">
                      <p class="text-lg font-bold">{{ event.price }} UAH</p>
                  </div>
                  <div class="mt-4">
                      <router-link
                          :to="{ name: 'EventDetails', params: { id: event.id } }"
                          class="text-blue-500 hover:underline"
                      >
                          View Event Details
                      </router-link>
                  </div>
              </div>
          </div>
      </div>

      <div v-if="messages.length !== 0" class="mt-6">
          <ul v-for="(message, index) in messages" :key="index">
              <li class="text-gray-600 mb-2">
                  {{ message }}
              </li>
          </ul>
      </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watchEffect } from "vue";
import { useQuery } from "@vue/apollo-composable"
import { FETCH_EVENTS } from "../graphql/eventQueries";

const eventsData = ref([]);

const isModalOpen = ref(false);
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const selectedCategory = ref("");
const selectedDate = ref("");
const selectedLetter = ref("");
const messages = ref([]);

function openFilter() {
  isModalOpen.value = true;
}

function closeFilter() {
  isModalOpen.value = false;
}


const { onResult, loading, error } = useQuery(FETCH_EVENTS);

onMounted(() => {
  console.log('Component Mounted. Loading State:', loading.value);

  watchEffect(() => {
    if (error.value) {
      console.error('GraphQL Error:', error.value);
      messages.value.push(error.value);
    }
  });

  onResult((result) => {
    if (result.data?.getAllEvents) {
      eventsData.value = result.data.getAllEvents;
      console.log('Fetched Events:', eventsData.value);
    }
  });
});

const filteredEvents = computed(() => {
  return eventsData.value.filter(event => {
      const matchesCategory = selectedCategory.value !== "" ? event.category === selectedCategory.value : true;
      const matchesDate = selectedDate.value ? new Date(event.date).toISOString().split("T")[0] === selectedDate.value : true;
      const matchesLetter = selectedLetter.value !== "" ? event.title.startsWith(selectedLetter.value) : true;
      return matchesCategory && matchesDate && matchesLetter;
  });
});
</script>
