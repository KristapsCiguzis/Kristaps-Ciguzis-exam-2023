<template>
    <div id="login-view">
      <form class="login-form" @submit.prevent="submitForm">
        <div class="wrapper-logo">
          <img src="@/assets/logo.svg" alt="Kraken.fm logo" />
          <div>KRAKEN.FM</div>
        </div>
        <input id="input-email" placeholder="E-mail" v-model="email" type="email" />
        <input id="input-password" type="password" placeholder="Password" v-model="password" />
        <button id="btn-submit" type="submit" :disabled="!email || password.length < 6">LOGIN</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useAuthStore } from '../stores/auth';
  
  export default {
    name: 'Login',
    setup() {
      const email = ref('');
      const password = ref('');
      const auth = useAuthStore();
  
      const submitForm = () => {
        auth.authenticate(email.value, password.value);
      };
  
      return {
        email,
        password,
        submitForm,
      };
    },
  };
  </script>