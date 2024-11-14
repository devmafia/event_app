import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import "./style.css"
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo-client';

createApp(App).use(ApolloProvider, { apolloClient }).use(router).use(store).mount('#app');
