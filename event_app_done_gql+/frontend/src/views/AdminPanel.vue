<template>
  <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">{{ editOpen ? 'Edit Event' : 'Add Event' }}</h2>

      <div class="mb-6 bg-white p-4 shadow-md rounded-lg">
          <input
              placeholder="Event title"
              type="text"
              v-model="title"
              class="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
              type="date"
              v-model="date"
              class="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
              placeholder="Category"
              type="text"
              v-model="category"
              class="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <textarea
              placeholder="Description"
              v-model="description"
              class="w-full p-2 border border-gray-300 rounded mb-4"
          ></textarea>
          <input
              placeholder="Price"
              type="text"
              v-model="price"
              class="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
              placeholder="Place"
              type="text"
              v-model="place"
              class="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
              type="file"
              @change="onFileChange"
              class="w-full mb-4"
          />
          <input
              placeholder="Available Seats"
              type="number"
              v-model="availableSeats"
              class="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <div class="flex space-x-2">
              <button
                  v-if="editOpen"
                  @click="handleUpdateEvent"
                  class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                  Редагувати
              </button>
              <button
                  v-else
                  @click="handleAddEvent"
                  class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                  Додати івент
              </button>
              <button
                  v-if="editOpen"
                  @click="cancelEdit"
                  class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                  Скасувати
              </button>
          </div>
      </div>

      <h3 class="text-xl font-semibold mb-4">Event List</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
              v-for="(event, index) in eventsData.slice(0, 9)"
              :key="index"
              class="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
              <img
                  :src="event.image"
                  :alt="event.title"
                  class="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h5 class="font-bold text-lg mb-2">{{ event.title }}</h5>
              <p class="text-gray-600">{{ new Date(event.date).toLocaleDateString() }}</p>
              <p class="text-gray-600">{{ event.category }}</p>
              <p class="text-gray-800 mt-2">{{ event.description }}</p>
              <p class="font-semibold mt-2">Place: {{ event.place }}</p>
              <p class="font-semibold mt-2">Price: ${{ event.price }}</p>
              <div class="mt-4 flex space-x-2">
                  <button
                      @click="handleOpenEditEvent(event)"
                      class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                      Редагувати
                  </button>
                  <button
                      @click="handleDeleteEvent(event.id)"
                      class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                      Видалити
                  </button>
              </div>
          </div>
      </div>
      <dir v-if="messages.length !== 0">
          <ul v-for="(message, index) in messages" :key="index">
              <li>messages</li>
          </ul>
      </dir>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuery, useMutation } from '@apollo/client';
import { FETCH_EVENTS, ADD_EVENT, UPDATE_EVENT, DELETE_EVENT } from '../graphql/adminQueries';

const title = ref('');
const imageFile = ref(null);
const description = ref('');
const date = ref('');
const category = ref('');
const place = ref('');
const price = ref('');
const availableSeats = ref('');

const currentEvent = ref('');
const editOpen = ref(false);
const eventsData = ref([]);
const messages = ref([]);

const { loading, error, data } = useQuery(FETCH_EVENTS);
const [addEvent] = useMutation(ADD_EVENT);
const [updateEvent] = useMutation(UPDATE_EVENT);
const [deleteEvent] = useMutation(DELETE_EVENT);

onMounted(() => {
  if (data && data.events) {
      eventsData.value = data.events;
  }
});

const onFileChange = (event) => {
  imageFile.value = event.target.files[0];
};

const handleAddEvent = async () => {
  try {
      const variables = {
          title: title.value,
          description: description.value,
          date: date.value,
          category: category.value,
          place: place.value,
          price: price.value,
          availableSeats: parseInt(availableSeats.value),
          image: imageFile.value,
      };

      const { data } = await addEvent({ variables });
      eventsData.value.push(data.addEvent);
      clearForm();
  } catch (error) {
      console.error('Error adding event:', error);
  }
};

const handleUpdateEvent = async () => {
  try {
      const variables = {
          id: currentEvent.value.id,
          title: title.value,
          description: description.value,
          date: date.value,
          category: category.value,
          place: place.value,
          price: price.value,
          availableSeats: parseInt(availableSeats.value),
          image: imageFile.value,
      };

      const { data } = await updateEvent({ variables });
      const index = eventsData.value.findIndex(event => event.id === currentEvent.value.id);
      eventsData.value[index] = data.updateEvent;
      editOpen.value = false;
      clearForm();
  } catch (error) {
      console.error('Error updating event:', error);
  }
};

const handleDeleteEvent = async (id) => {
  try {
      await deleteEvent({ variables: { id } });
      eventsData.value = eventsData.value.filter(event => event.id !== id);
  } catch (error) {
      console.error('Error deleting event:', error);
  }
};

const clearForm = () => {
  title.value = '';
  imageFile.value = null;
  description.value = '';
  date.value = '';
  category.value = '';
  price.value = '';
  place.value = '';
  availableSeats.value = '';
};

const handleOpenEditEvent = (event) => {
  editOpen.value = true;
  currentEvent.value = event;
  title.value = event.title;
  description.value = event.description;
  date.value = event.date;
  category.value = event.category;
  price.value = event.price;
  place.value = event.place;
  availableSeats.value = event.availableSeats;
};

const cancelEdit = () => {
  clearForm();
  editOpen.value = false;
};
</script>
