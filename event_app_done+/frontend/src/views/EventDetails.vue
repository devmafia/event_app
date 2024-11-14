<template>
  <div class="p-6">
    <div v-if="loading" class="text-center p-4">
      <p class="text-gray-600">Loading...</p>
    </div>
    
    <div v-else-if="error" class="text-center p-4">
      <p class="text-red-500">{{ error }}</p>
    </div>
  
    <div v-else-if="event" class="bg-white shadow-md rounded-lg p-6">
      <h1 class="text-2xl font-bold mb-4">Event Details</h1>
      <div class="flex justify-between">
        <div>
      <img 
        v-if="event.image" 
        :src="event.image" 
        :alt="event.title" 
        class="w-40 h-50 object-cover rounded-lg mb-4" 
      />
      
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">{{ event.title }}</h2>
        <p class="text-gray-700">Date: <span class="font-medium">{{ formatDate(event.date) }}</span></p>
        <p class="text-gray-700">Category: <span class="font-medium">{{ event.category }}</span></p>
        <p class="text-gray-700">Description: <span class="font-medium">{{ event.description }}</span></p>
        <p class="text-gray-700">Price: <span class="font-medium">{{ event.price }} UAH</span></p>
        <p class="text-gray-700">Place: <span class="font-medium">{{ event.place }}</span></p>
      </div>
    </div>
      <div v-if="event.seats && event.seats.length" class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Select Seats</h3>
        <div class="grid grid-cols-5 gap-2">
          <div 
            v-for="seat in event.seats" 
            :key="seat.id" 
            class="seat p-2 border rounded transition duration-200"
            :class="{
              'bg-gray-200 cursor-not-allowed': seat.isBooked,
              'bg-blue-100 hover:bg-blue-200': !seat.isBooked && !isSelectedSeat(seat),
              'bg-blue-200': isSelectedSeat(seat)
            }"
          >
            <label :class="{ 'text-red-500': seat.isBooked }">
              <input 
                type="checkbox" 
                :disabled="seat.isBooked"
                :checked="isSelectedSeat(seat)"
                @change="toggleSeat(seat)"
                class="mr-2"
              >
              Seat {{ seat.seatNumber }}
              <span v-if="isInCart(seat)" class="text-sm text-blue-600">(In Cart)</span>
            </label>
          </div>
        </div>
      </div>
      </div>
      <div class="mt-4">
          <p class="mb-2">Selected Seats: <span class="font-bold">{{ selectedSeats.length }}</span></p>
          <p class="mb-4">Total Price: <span class="font-bold">{{ totalPrice }} UAH</span></p>
          <button 
            @click="addSelectedSeatsToCart"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition duration-200"
          >
            Add Selected Seats to Cart
          </button>
          <button 
            @click="removeSelectedSeatsFromCart"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400 transition duration-200 ml-2"
          >
            Remove Selected Seats from Cart
          </button>
        </div>
    </div>
  </div>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const route = useRoute();
const store = useStore();
const event = ref(null);
const loading = ref(true);
const error = ref(null);

const selectedSeats = computed(() => store.getters.selectedSeats);
const calculateTotalPrice = computed(() => store.getters.calculateTotalPrice);
const totalPrice = computed(() => store.getters.totalPrice);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const isSelectedSeat = (seat) => {
  return selectedSeats.value.some(s => s.id === seat.id);
};

const isInCart = (seat) => {
  return store.getters.isInCart(event.value?.id, seat.id);
};

const fetchEventDetails = async (eventId) => {
  try {
    const res = await fetch(`http://localhost:5000/events/${eventId}`);
    if (!res.ok) throw new Error(`Failed to fetch event details (${res.status})`);
    const data = await res.json();
    if (!data) throw new Error('No event data received');
    return data;
  } catch (err) {
    throw new Error(`Error fetching event details: ${err.message}`);
  }
};

const toggleSeat = (seat) => {
  if (isSelectedSeat(seat)) {
    const updatedSeats = selectedSeats.value.filter(s => s.id !== seat.id);
    store.commit('setSelectedSeats', updatedSeats);
  } else {
    const updatedSeats = [...selectedSeats.value, seat];
    store.commit('setSelectedSeats', updatedSeats);
  }
};

const removeSelectedSeatsFromCart = () => {
  if (!event.value || selectedSeats.value.length === 0) return;

  store.commit('removeSeatsFromCart', {
    eventId: event.value.id,
    seatIds: selectedSeats.value.map(seat => seat.id)
  });

  store.commit('setSelectedSeats', []);
};

const addSelectedSeatsToCart = () => {
  if (!event.value || selectedSeats.value.length === 0) return;

  store.commit('addToCart', {
    event: event.value,
    seats: [...selectedSeats.value],
    price: event.value.price
  });
};

onMounted(async () => {
  const eventId = route.params.id;
  try {
    loading.value = true;
    event.value = await fetchEventDetails(eventId);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>

