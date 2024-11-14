<template>
    <div>
        <form @submit="handleSubmit">
            <div>
                <input class="field" name="username" type="text" v-model="username" />
            </div>
            <div>
                <input class="field" name="email" type="text" v-model="email" />
            </div>
            <div>
                <input class="field" name="password" type="password" v-model="password" />
            </div>
            <div>
                <input class="field" name="confirm_password" type="password" v-model="confirmPassword" />
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();

async function handleSubmit(e) {
    e.preventDefault();

    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!username.value) {
        alert("Username field should be not empty")
        // alert('Invalid username. It should be 3-20 alphanumeric characters.');
        return;
    }
    if (!email.value) {
        alert("Email field should be not empty")
        // alert('Invalid email format.');
        return;
    }
    if (!password.value) {
        alert("Password field should be not empty")
        // alert('Password must be at least 8 characters long and contain at least one letter and one number.');
        return;
    }
    if (password.value !== confirmPassword.value) {
        alert('Passwords do not match.');
        return;
    }

    const userData = {
        username: username.value,
        email: email.value,
        password: password.value,
    };

    await fetchUserData(userData);
}

const fetchUserData = async (userData) => {
    try {
        const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
    },
        body: JSON.stringify(userData),
    })
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
        const data = await res.json();
        router.push('/login');
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

</script>

<style>
.field {
    margin: 10px 0;
    padding: 10px;
    border: 3px solid black;
    border-radius: 5px;
}
</style>