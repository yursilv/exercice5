<template>
  <div id="back">
    <header>
      <h1>Русские в Ницце</h1>
    </header>
    <nav>
      <router-link to="/profile" class="profile">
        <figure>
          <img v-if="currentUser.avatar === null" src="../../assets/default_avatar.png" alt="avatar">
          <img v-if="currentUser.avatar !== null" :src="currentUser.avatar" alt="avatar">
          <figcaption>
            <p v-if="currentUser.firstName === null">{{currentUser.login}}</p>
            <p v-if="currentUser.firstName !== null">{{currentUser.firstName}}</p>
          </figcaption>
        </figure>
      </router-link>
      <div id="main-links">
        <router-link to="/announcements"><a>Объявления</a></router-link>
        <router-link to="/information"><a>Информация</a></router-link>
        <router-link to="/chat"><a>Чат</a></router-link>
        <router-link to="/users"><a>Пользователи</a></router-link>
      </div>
      <img src="../../assets/exit.svg" class="exit" alt="Выход" @click="exit">
    </nav>
    <main role="main">
      <slot></slot>
    </main>
  </div>
</template>

<script>
/*
  Main layout component containing :
  background + header + navigation bar + slot for other components
*/
export default {
  name: 'MainLayout',
  methods: {
    // called when the user clicks on the exit button
    exit() {
      this.$store.commit('AUTH_LOGOUT');
      this.$router.push('/');
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.user;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #back {
    position: relative;
    min-height: 100%;
    width: 100%;
    background-image: url("../../assets/nice.jpg");
    background-size: 100%;
    background-attachment: fixed;
    display: grid;
    justify-items: center;
    grid-template-rows: 10em 5em auto;
    grid-auto-rows: min-content;
  }
  header {
    margin-top: 2em;
  }
  h1 {
    font-family: "Monotype Corsiva",serif;
    font-size: 4em;
    font-weight: normal;
    color: white;
  }
  nav {
    margin-top: 0;
    bottom: 0;
    width: 80%;
    height: 100%;
    background: #274D81;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  nav figure {
    margin: 0;
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  nav figcaption {
    margin-left: 1em;
  }
  #main-links {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
  }
  nav a {
    color: white;
    text-decoration: none;
    font-size: 1.1em;
  }
  nav img {
    height: 100%;
    width: auto;
  }
  nav p {
    font-weight: bold;
    color: white;
    font-size: 1.1em;
  }
  .exit {
    margin-right: 1em;
    float: left;
    height: 2em;
    cursor: pointer;
  }
  main {
    width: 80%;
    height: 100%;
    background: #EBF1F9;
  }
  h1 {
    margin: 0 0 0.5em 0;
    font-family: "Monotype Corsiva",serif;
    font-size: 4em;
    color: white;
  }
  .profile {
    height: 100%;
    width: 20%;
  }
</style>
