<template>
  <welcome-layout>
    <div id="images">
      <img src="../assets/vv4.jpg" alt="">
      <img src="../assets/prom2.jpg" alt="">
      <img src="../assets/chateau.jpg" alt="">
      <img src="../assets/vv2.jpg" alt="">
      <img src="../assets/massena.jpg" alt="">
      <img src="../assets/eglise.jpg" alt="">
      <img src="../assets/fleurs.jpg" alt="">
      <img src="../assets/prom.jpg" alt="">
      <img src="../assets/arene.jpg" alt="">
      <img src="../assets/manst.jpg" alt="">
      <img src="../assets/vv.jpg" alt="">
      <img src="../assets/vv3.jpg" alt="">
    </div>
    <header>
      <h1>Русские в Ницце</h1>
    </header>
    <section class="login_block">
      <div class="form">
        <form @submit="checkForm">
          <label>
            <input class="textinput" v-model="login" placeholder="Ваш логин" :class="{ formError: loginError && !login}">
          </label>
          <label>
            <input type="password" class="textinput" v-model="password" placeholder="Ваш пароль" :class="{ formError: passwordError && !password}">
          </label>
          <div class="status">
            <p v-if="authLoginError && !loading" class="messageError">
              Пользователя с таким логином не существует
            </p>
            <p v-if="authPasswordError && !loading" class="messageError">
              Неверный пароль
            </p>
            <p v-if="serverError && !loading" class="messageError">
              Ошибка сервера
            </p>
            <img v-if="loading" src="../assets/loading.gif" style="width: 30px; height: auto" alt="loading">
          </div>
          <input type="submit" value="Вход" class="submit_button">
        </form>
        <div class="last_buttons">
          <router-link to="/"><a>Забыли пароль?</a></router-link>
          <router-link to="/registration"><a style="font-weight: bold">Регистрация</a></router-link>
        </div>
      </div>
    </section>
    <aside>
      <p id="welcome">{{welcomeMessage}}</p>
    </aside>
  </welcome-layout>
</template>

<script>
import { Auth } from '../api';

export default {
  name: 'Welcome',
  data() {
    return {
      welcomeMessage: 'Добро пожаловать на сайт Русские в Ницце! Здесь вы найдёте полезные объявления, информацию о городе и сможете задать вопросы местным.',
      login: '',
      password: '',
      loginError: false,
      passwordError: false,
      authLoginError: false,
      authPasswordError: false,
      serverError: false,
      auth: new Auth(),
    };
  },
  methods: {
    /*
      hides all the errors
    */
    hideErrors() {
      this.loginError = false;
      this.passwordError = false;
      this.authLoginError = false;
      this.authPasswordError = false;
      this.serverError = false;
    },
    /*
      checking the form for errors and executing a request
    */
    checkForm(e) {
      e.preventDefault();
      if (this.login && this.password) {
        this.hideErrors();
        this.auth.execute({ login: this.login, password: this.password })
          .then(() => {
            this.$router.push('/users');
          }).catch((err) => {
            if (err.response.status === 404) {
              this.authLoginError = true;
            }
            if (err.response.status === 422) {
              this.authPasswordError = true;
            }
            if (err.response.status === 500) {
              this.serverError = true;
            }
          });
      }
      if (!this.login) {
        this.loginError = true;
      }
      if (!this.password) {
        this.passwordError = true;
      }
      return false;
    },
  },
  computed: {
    // field needed to display the loading animation
    loading() {
      return this.auth.status === 'loading';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login_block {
    height: 19em;
    padding: 1em 0 1em 0;
    width: 35em;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
  }
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .textinput {
    font-size: 1.2em;
    margin-top: 1em;
    width: 20em;
    padding: 0.8em;
  }
  .last_buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 22em;
    font-size: 1.1em;
    margin-top: 1em;
  }
  a {
    color: #424242;
    text-decoration: none;
  }
  h1 {
    font-family: "Monotype Corsiva",serif;
    font-weight: normal;
    font-size: 4em;
    color: white;
  }
  #images {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  img {
    margin: 0.8em;
    height: 7em;
  }
  #welcome {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    font-size: 1.1em;
    color: white;
  }
</style>
