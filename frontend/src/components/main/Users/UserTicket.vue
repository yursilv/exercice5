<template>
  <div class="main_container">
    <div class="container">
      <figure>
        <img v-if="user.avatar === null" src="../../../assets/default_avatar.png" alt="avatar">
        <img v-if="user.avatar !== null" :src="user.avatar" alt="avatar">
        <figcaption>
          <p v-if="user.firstName === null && user.lastName === null">{{user.login}}</p>
          <p v-if="user.firstName !== null && user.lastName === null">{{user.firstName}} ({{user.login}})</p>
          <p v-if="user.firstName !== null && user.lastName !== null">{{user.firstName}} {{user.lastName}} ({{user.login}})</p>
        </figcaption>
      </figure>
      <input type="button" value="Добавить" class="normal_button">
    </div>
    <hr>
  </div>
</template>

<script>
/*
  Displaying an individual user in the list
  (the add button doesn't do anything for the moment)
*/
export default {
  name: 'UserTicket',
  props: {
    user: {},
  },
};
</script>

<style scoped>
  figure img {
    height: 70%;
    width: auto;
    border-radius: 50%;
  }
  .container {
    width: 100%;
    height: 5em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  figure {
    margin: 0;
    height: 5em;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  figcaption {
    margin-left: 1em;
    color: white;
  }
  .main_container {
    width: 90%;
    display: block;
  }
  hr {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    border: none;
    background-color: white;
    height: 1px;
  }
</style>
