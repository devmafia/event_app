<template>
    <div class="p-6">
      <div class="flex justify-end mb-4 relative">
        <button 
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          @click="openFilter"
        >
          Пошуковий фільтр
        </button>
  
        <div v-if="isModalOpen" class="absolute bg-white shadow-lg rounded-lg p-4 mt-2 z-10">
          <div class="mb-4">
            <label for="category" class="block mb-1">Категорія</label>
            <select v-model="selectedCategory"
              name="by_category" 
              id="category" 
              class="border rounded-md p-2 w-full"
            >
              <option value="">Виберіть категорію</option>
              <option>
                Cat
              </option>
              <option>
                Category
              </option>
            </select>
          </div>
  
          <div class="mb-4">
            <label for="time" class="block mb-1">Дата</label>
            <input v-model="selectedDate"
              type="date" 
              id="time" 
              class="border rounded-md p-2 w-full"
            />
          </div>
  
          <div class="mb-4">
            <label class="block mb-1">За літерою</label>
            <select v-model="selectedLetter" class="border rounded-md p-2 w-full">
              <option value="">Виберіть літеру</option>
              <option v-for="letter in letters" :key="letter" :value="letter">
                {{ letter }}
              </option>
            </select>
          </div>
  
          <button 
            @click="closeFilter" 
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          >
            Закрити
          </button>
        </div>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(event, index) in filteredEvents.slice(0, 9)" 
          :key="index" 
          class="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <img
            :src="event.image" 
            :alt="event.title"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h5 class="text-xl font-semibold mb-2">{{ event.title }}</h5>
            <p class="text-gray-600">{{ event.date }}</p>
            <p class="text-gray-600">{{ event.category }}</p>
            <p class="text-gray-700">{{ event.description }}</p>
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
    </div>
  </template>
  

<script setup>
import { onMounted, ref, computed } from "vue";

    const eventsData = ref([]);

    const isModalOpen = ref(false);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const selectedCategory = ref("");
    const selectedDate = ref("");
    const selectedLetter = ref("");

    function openFilter() {
        isModalOpen.value = true;
    }

    function closeFilter() {
        isModalOpen.value = false;
    }

    const fetchEventsData = async () => {
        try {
            const res = await fetch('http://localhost:5000/events/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }})
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return [];
        }
    }

    onMounted(async () => {
        eventsData.value = await fetchEventsData();
    })

    const filteredEvents = computed(() => {
    return eventsData.value.filter(event => {
      console.log(selectedCategory.value)
        const matchesCategory = selectedCategory.value !== "" ? event.category === selectedCategory.value : true;
        
       const matchesDate = selectedDate.value
            ? new Date(event.date).toISOString().split("T")[0] === selectedDate.value 
            : true;
        
        const matchesLetter = selectedLetter.value !== "" ? event.title.startsWith(selectedLetter.value) : true;
        
        return matchesCategory && matchesDate && matchesLetter;
    });
});


</script>