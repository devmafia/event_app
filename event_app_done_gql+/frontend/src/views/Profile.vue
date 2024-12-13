<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h3 class="text-2xl font-semibold mb-6 text-gray-800">User Profile</h3>

    <div class="profile-section mb-6">
      <p class="text-gray-700"><strong>Username:</strong> {{ userData.username }}</p>
      <label class="block text-sm font-medium text-gray-700 mt-4">Edit Username:</label>
      <input
        class="field border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-500"
        name="username"
        type="text"
        v-model="username"
        placeholder="New username"
      />
      <button
        @click="handleEditUsername"
        class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Edit username
      </button>
    </div>

    <div class="profile-section mb-6">
      <p class="text-gray-700"><strong>Email:</strong> {{ userData.email }}</p>
      <label class="block text-sm font-medium text-gray-700 mt-4">Edit Email:</label>
      <input
        class="field border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-500"
        name="email"
        type="text"
        v-model="email"
        placeholder="New email"
      />
      <button
        @click="handleEditEmail"
        class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Edit email
      </button>
    </div>

    <div class="profile-section mb-6">
      <label class="block text-sm font-medium text-gray-700">Edit Password:</label>
      <input
        class="field border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-500 mb-2"
        name="password"
        type="password"
        v-model="password"
        placeholder="New password"
      />
      <input
        class="field border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-500 mb-4"
        name="confirm_password"
        type="password"
        v-model="confirm_password"
        placeholder="Confirm password"
      />
      <button
        @click="handleEditPassword"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Edit password
      </button>
    </div>

    <button
      class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 mb-6"
      @click="handleDeleteUser"
    >
      Delete user
    </button>

    <div class="bookings-section">
      <h3 class="text-xl font-semibold mb-4 text-gray-800">Your Bookings</h3>
      <div class="bookings-list">
        <div v-if="userBookings.length === 0" class="no-bookings mb-4">
          <p class="text-gray-600">You have no bookings yet.</p>
        </div>
        <div
          v-for="booking in userBookings"
          :key="booking.id"
          class="booking-card bg-gray-50 p-4 rounded-lg shadow mb-4"
        >
          <h4 class="text-lg font-semibold">Booking ID: {{ booking.id }}</h4>
          <p class="text-gray-700"><strong>Guest Name:</strong> {{ booking.guestName }}</p>
          <p class="text-gray-700"><strong>Email:</strong> {{ booking.guestEmail }}</p>
          <p class="text-gray-700"><strong>Phone:</strong> {{ booking.phone }}</p>
          <p class="text-gray-700"><strong>Total Price:</strong> ${{ booking.totalPrice }}</p>

          <h5 class="mt-4 text-sm font-medium text-gray-700">Events:</h5>
          <ul>
            <li
              v-for="event in booking.events"
              :key="event.id"
              class="event-item flex items-center justify-between p-2 border-b border-gray-200"
            >
              <div class="flex items-center">
                <img :src='"http://localhost:5000"+event.image' alt="Event image" class="event-image w-16 h-16 object-cover rounded-md mr-2" />
                <div>
                  <strong>{{ event.title }}</strong> ({{ new Date(event.date).toLocaleDateString() }})
                  <p class="text-gray-600"><strong>Description:</strong> {{ event.description }}</p>
                  <p class="text-gray-700"><strong>Price:</strong> ${{ event.price }}</p>
                  <strong>Seats:</strong>
                  <ul>
                    <li
                      v-for="seat in booking.seats"
                      :key="seat.id"
                      class="text-gray-600"
                    >
                      Seat Number: {{ seat.seatNumber }}
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
          <button
            @click="handleDeleteBooking(booking.id)"
            class="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          >
            Delete booking
          </button>
        </div>
      </div>
    </div>

    <div v-if="messages.length !== 0" class="mt-6">
      <ul class="space-y-2">
        <li v-for="(message, index) in messages" :key="index" class="text-gray-600">
          {{ message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { FETCH_USER_DATA, FETCH_USER_BOOKINGS, UPDATE_USERNAME, UPDATE_EMAIL, UPDATE_PASSWORD, DELETE_USER, DELETE_BOOKING } from '../graphql/profileQueries';
import Cookie from "js-cookie";

const username = ref('');
const email = ref('');
const password = ref('');
const confirm_password = ref('');
const userData = ref({});
const userBookings = ref([]);
const messages = ref([]);
const userId = parseInt(Cookie.get('userId'), 10);

const userToken = localStorage.getItem('jwt');

const { onResult: userDataResponse, loading: loadingUserData, error: errorUserData } = useQuery(
      FETCH_USER_DATA,
      () => ({
        id: userId
      }),
      () => ({
        context: {
          headers: {
            Authorization: userToken
              ? `Bearer ${userToken}`
              : undefined
          }
        }
      })
    );
const { onResult: bookingsData, loading: loadingBookings, error: errorBookings } = useQuery(FETCH_USER_BOOKINGS,
      () => ({
        id: userId
      }),
      () => ({
        context: {
          headers: {
            Authorization: userToken
              ? `Bearer ${userToken}`
              : undefined
          }
        }
      })
);

const { mutate: updateUsername } = useMutation(UPDATE_USERNAME,
      () => ({
        context: {
        headers: {
          Authorization: userToken
            ? `Bearer ${userToken}`
            : undefined
        }
      }})
);
const { mutate: updateEmail } = useMutation(UPDATE_EMAIL,
() => ({
        context: {
        headers: {
          Authorization: userToken
            ? `Bearer ${userToken}`
            : undefined
        }
      }})
);
const { mutate: updatePassword } = useMutation(UPDATE_PASSWORD,
() => ({
        context: {
        headers: {
          Authorization: userToken
            ? `Bearer ${userToken}`
            : undefined
        }
      }})
);
const { mutate: deleteUser } = useMutation(DELETE_USER,
() => ({
        context: {
        headers: {
          Authorization: userToken
            ? `Bearer ${userToken}`
            : undefined
        }
      }})
);
const { mutate: deleteBooking } = useMutation(DELETE_BOOKING,
() => ({
        context: {
        headers: {
          Authorization: userToken
            ? `Bearer ${userToken}`
            : undefined
        }
      }})
);

onMounted(() => {
    userDataResponse((result) => {
      if (result.data?.getUserdata.user) {
        userData.value = result.data.getUserdata.user;
      }
    })

    bookingsData((result) => {
      if (result.data?.getBookings) {
        userBookings.value = result.data.getBookings;
      }
    })
});

const handleEditUsername = async () => {
  const userToken = localStorage.getItem('jwt');

  try {
    const { data } = await updateUsername({
      variables: {
        id: parseInt(userData.value.id),
        username: username.value
    }
  });
  if (data?.updateUsername?.user) {
      userData.value = { ...userData.value, username: data.updateUsername.user.username };
    }
  } catch (error) {
      console.error('Update username error:', error);
  }
};

const handleEditEmail = async () => {
  const userToken = localStorage.getItem('jwt');
  try {
      const { data } = await updateEmail({
        variables: {
          id: parseInt(userData.value.id),
          email: email.value
        }
  });
  if (data?.updateEmail?.user) {
      userData.value = { ...userData.value, email: data.updateEmail.user.email };
    }
  } catch (error) {
      console.error('Update email error:', error);
  }
};

const handleEditPassword = async () => {
  const userToken = localStorage.getItem('jwt');
  if (password.value !== confirm_password.value) {
      alert("Passwords do not match");
      return;
  }

  try {
      const { data } = await updatePassword({ variables: { id: parseInt(userData.value.id), password: password.value },
    });
      alert("Password updated successfully");
  } catch (error) {
      console.error('Update password error:', error);
  }
};

const handleDeleteUser = async () => {
  const userToken = localStorage.getItem('jwt');
  try {
      await deleteUser(

      {variables: { userId: parseInt(userData.value.id) }
    });
      router.push('/events');
  } catch (error) {
      console.error('Delete user error:', error);
  }
};

const handleDeleteBooking = async (bookingId) => {
  const userToken = localStorage.getItem('jwt');
  try {
      await deleteBooking({variables: { bookingId: parseInt(bookingId) },
    });
      userBookings.value = userBookings.value.filter(b => b.id !== bookingId);
  } catch (error) {
      console.error('Delete booking error:', error);
  }
};

</script>

<style scoped>
.field {
  padding: 10px;
  margin-top: 5px;
  border-radius: 4px;
}
.event-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
}
</style>
