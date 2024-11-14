<template>
    <div class="user-profile">
        <h3>User Profile</h3>

        <div class="profile-section">
            <p><strong>Username:</strong> {{ userData.username }}</p>
            <p><strong>Edit Username:</strong></p>
            <input class="field" name="username" type="text" v-model="username" placeholder="New username" />
            <button @click="handleEditUsername">Edit username</button>
        </div>

        <div class="profile-section">
            <p><strong>Email:</strong> {{ userData.email }}</p>
            <p><strong>Edit Email:</strong></p>
            <input class="field" name="email" type="text" v-model="email" placeholder="New email" />
            <button @click="handleEditEmail">Edit email</button>
        </div>

        <div class="profile-section">
            <p><strong>Edit Password:</strong></p>
            <input class="field" name="password" type="password" v-model="password" placeholder="New password" />
            <input class="field" name="confirm_password" type="password" v-model="confirm_password" placeholder="Confirm password" />
            <button @click="handleEditPassword">Edit password</button>
        </div>

        <button class="delete-button" @click="handleDeleteUser">Delete user</button>

        <div class="bookings-section">
            <h3>Your Bookings</h3>
            <div class="bookings-list">
                <div v-if="userBookings.length === 0" class="no-bookings">
                    <p>You have no bookings yet.</p>
                </div>
                <div v-for="booking in userBookings" :key="booking.id" class="booking-card">
                    <h4>Booking ID: {{ booking.id }}</h4>
                    <p><strong>Guest Name:</strong> {{ booking.guestName }}</p>
                    <p><strong>Email:</strong> {{ booking.guestEmail }}</p>
                    <p><strong>Phone:</strong> {{ booking.phone }}</p>
                    <p><strong>Total Price:</strong> ${{ booking.totalPrice }}</p>
                    <p><strong>Created At:</strong> {{ new Date(booking.createdAt).toLocaleString() }}</p>

                    <h5>Events:</h5>
                    <ul>
                        <li v-for="event in booking.events" :key="event.id" class="event-item">
                            <img :src="event.image" alt="Event image" class="event-image" />
                            <strong>{{ event.title }}</strong> ({{ new Date(event.date).toLocaleDateString() }})
                            <p>{{ event.description }}</p>
                            <p><strong>Price:</strong> ${{ event.price }}</p>
                                <strong>Seats:</strong>
                                <ul>
                                <li v-for="seat in booking.seats.filter(seat => seat.eventId === event.id)" :key="seat.id">
                                  Seat Number: {{ seat.seatNumber }}
                                    </li>
                                </ul>
                        </li>
                    </ul>
                    <button @click="handleDeleteBooking(booking.id)">Delete booking</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchWithUserAuth } from '../services/fetchWithAuth';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirm_password = ref('');
const userData = ref({});
const userBookings = ref([]);

const fetchUserData = async () => {
    try {
        const res = await fetchWithUserAuth(`http://localhost:5000/user/`, { method: 'GET' });
        if (!res.ok) throw new Error('Failed to fetch user data');
        
        userData.value = await res.json();
    } catch (error) {
        console.error('Fetch user data error:', error);
    }
};

const fetchUserBookings = async () => {
    try {
        const res = await fetchWithUserAuth(`http://localhost:5000/booking/bookings/`, { method: 'GET' });
        if (!res.ok) throw new Error('Failed to fetch bookings');

        const data = await res.json()
        userBookings.value = data.bookings;
    } catch (error) {
        console.error('Fetch bookings error:', error);
    }
};

onMounted(async () => {
    await fetchUserData();
    if (userData.value.id) await fetchUserBookings();
});

const handleEditUsername = async () => {
    try {
        const res = await fetchWithUserAuth(`http://localhost:5000/user/${userData.value.id}/update_name`, {
            method: 'PUT',
            body: JSON.stringify({ username: username.value }),
        });
        if (!res.ok) throw new Error('Failed to update username');
        
        userData.value.username = await res.json().username;
    } catch (error) {
        console.error('Update username error:', error);
    }
};

const handleEditEmail = async () => {
    try {
        const res = await fetchWithUserAuth(`http://localhost:5000/user/${userData.value.id}/update_email`, {
            method: 'PUT',
            body: JSON.stringify({ email: email.value }),
        });
        if (!res.ok) throw new Error('Failed to update email');

        userData.value.email = await res.json().email;
    } catch (error) {
        console.error('Update email error:', error);
    }
};

const handleEditPassword = async () => {
    if (password.value !== confirm_password.value) {
        alert("Passwords do not match");
        return;
    }

    try {
        const res = await fetchWithUserAuth(`http://localhost:5000/user/${userData.value.id}/update_password`, {
            method: 'PUT',
            body: JSON.stringify({ password: password.value }),
        });
        if (!res.ok) throw new Error('Failed to update password');

        alert("Password updated successfully");
        password.value = '';
        confirm_password.value = '';
    } catch (error) {
        console.error('Update password error:', error);
    }
};

const handleDeleteUser = async () => {
    try {
        const res = await fetchWithUserAuth(`http://localhost:5000/admin/user/`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete user');

        router.push('/events');
    } catch (error) {
        console.error('Delete user error:', error);
    }
};

const handleDeleteBooking = async (bookingId) => {
    console.log(bookingId)

    try {
        const res = await fetchWithUserAuth(`http://localhost:5000/booking/${bookingId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete booking');

        userBookings.value = userBookings.value.filter(booking => booking.id !== bookingId);
        alert("Booking deleted successfully");
    } catch (error) {
        console.error('Delete booking error:', error);
    }
};
</script>

<style scoped>
.user-profile {
    font-family: Arial, sans-serif;
    margin: 20px;
}

.profile-section {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.field {
    width: calc(100% - 10px);
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.delete-button {
    background-color: red;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.delete-button:hover {
    background-color: darkred;
}

.bookings-section {
    margin-top: 30px;
}

.bookings-list {
    display: flex;
    flex-direction: column;
}

.booking-card {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.event-item {
    margin: 10px 0;
}

.event-image {
    max-width: 100px;
    height: auto;
    margin-right: 10px;
}

.no-bookings {
    color: gray;
    font-style: italic;
}
</style>
