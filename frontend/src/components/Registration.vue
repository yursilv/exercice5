<template>
  <welcome-layout>
    <section class="register_block">
      <router-link to="/">
        <img src="../assets/left-arrow.svg" class="exit" alt="Назад">
      </router-link>
      <header>
        <h1>Регистрация</h1>
      </header>
      <form @submit="checkForm" class="form">
        <label>
          <input class="textinput" v-model="login" placeholder="Логин" :class="{ formError: loginError && !login}">
        </label>
        <label>
          <input class="textinput" v-model="mail" placeholder="Почта" :class="{ formError: mailError && !mail}">
        </label>
        <label>
          <input type="password" class="textinput" v-model="password" placeholder="Пароль" :class="{ formError: passwordError && !password}">
        </label>
        <label>
          <input type="password" class="textinput" v-model="passwordRepeat" placeholder="Повторите пароль" :class="{ formError: passwordRepeatError && !passwordRepeat}">
        </label>
        <div class="status">
          <p v-if="passwordsMatchError" class="messageError">
            Пароли не совпадают
          </p>
          <p v-if="loginAndMailAlreadyUsedError" class="messageError">
            Введёные логин и почта уже заняты
          </p>
          <p v-if="loginAlreadyUsedError" class="messageError">
            Введёный логин уже занят
          </p>
          <p v-if="mailAlreadyUsedError" class="messageError">
            Введённая почта уже занята
          </p>
          <p v-if="serverError && !loading" class="messageError">
            Ошибка сервера
          </p>
          <img v-if="loading" src="../assets/loading.gif" style="width: 30px; height: auto" alt="loading">
        </div>
        <input type="submit" value="Подтвердить" class="submit_button">
      </form>
    </section>
  </welcome-layout>
</template>

<script>
import { Register, Auth } from '../api';

export default {
  name: 'Registration',
  data() {
    return {
      welcomeMessage: 'Добро пожаловать на сайт Русские в Ницце! Здесь вы найдёте полезные объявления, информацию о городе и сможете задать вопросы местным.',
      login: '',
      mail: '',
      password: '',
      passwordRepeat: '',
      register: new Register(),
      auth: new Auth(),
      loginError: false,
      mailError: false,
      passwordError: false,
      passwordRepeatError: false,
      passwordsMatchError: false,
      loginAlreadyUsedError: false,
      mailAlreadyUsedError: false,
      loginAndMailAlreadyUsedError: false,
      serverError: false,
    };
  },
  methods: {
    /*
      hides all the errors
    */
    hideErrors() {
      this.loginError = false;
      this.mailError = false;
      this.passwordError = false;
      this.passwordRepeatError = false;
      this.passwordsMatchError = false;
      this.loginAlreadyUsedError = false;
      this.mailAlreadyUsedError = false;
      this.loginAndMailAlreadyUsedError = false;
      this.serverError = false;
    },
    /*
      checking the form for errors and executing a request
    */
    checkForm(e) {
      e.preventDefault();
      // if all conditions are satisfied the registration request can be sent
      if (this.login && this.mail && this.password && this.passwordRepeat && this.password === this.passwordRepeat) {
        this.hideErrors();
        // sending the registration request
        this.register.execute({
          login: this.login,
          mail: this.mail,
          password: this.password,
        }).then(() => {
          // authorizing in case of successful registration
          this.auth.execute({ login: this.login, password: this.password })
            .then(() => {
              // redirecting to the Users page
              this.$router.push('/users');
            });
        }).catch((err) => {
          if (err.response.status === 409) {
            if (err.response.data.data.login && err.response.data.data.mail) {
              this.loginAndMailAlreadyUsedError = true;
            } else if (err.response.data.data.login) {
              this.loginAlreadyUsedError = true;
            } else if (err.response.data.data.mail) {
              this.mailAlreadyUsedError = true;
            }
          }
          if (err.response.status === 500) {
            this.serverError = true;
          }
        });
      }
      if (!this.login) {
        this.loginError = true;
      }
      if (!this.mail) {
        this.mailError = true;
      }
      if (!this.password) {
        this.passwordError = true;
      }
      if (!this.passwordRepeat) {
        this.passwordRepeatError = true;
      }
      if (this.password !== this.passwordRepeat) {
        this.passwordsMatchError = true;
      }
    },
  },
  computed: {
    // field needed to display the loading animation
    loading() {
      return this.register.status === 'loading' || this.auth.status === 'loading';
    },
  },
};
</script>

<style scoped>
  .register_block {
    margin-top: 5%;
    padding: 2em;
    height: auto;
    width: 35em;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
  }
  .exit {
    float: left;
    height: 2em;
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
  .submit_button {
     margin-top: 1em;
  }
</style>
