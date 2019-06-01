<template>
  <main-layout>
    <div class="tickets_container">
      <h2>Список пользователей</h2>
      <label>
        <input class="textinput" v-model="name" placeholder="Введите имя пользователя">
      </label>
      <p>Найдено пользователей: {{filteredUsers.length}}</p>
      <userTicket  v-if="usersLoaded" v-for="u in filteredUsers"
                          v-bind:user="u"
                          v-bind:key="u.id">
      </userTicket>
    </div>
  </main-layout>
</template>

<script>
import UserTicket from '@/components/main/Users/UserTicket';
import { GetUsers } from '../../../api';

export default {
  name: 'Users',
  components: {
    userTicket: UserTicket,
  },
  data() {
    return {
      users: [],
      getUsers: new GetUsers(),
      name: '',
    };
  },
  created() {
    // executing a GET /users request
    this.getUsers.execute().then((users) => {
      this.users = users;
    });
  },
  computed: {
    usersLoaded() {
      return this.getUsers.status === 'success';
    },
    /*
     filters users list based on the input (name field)
     returns only users whose first name, last name or login matches the input
    */
    filteredUsers() {
      return this.users.filter((user) => {
        const regexp = new RegExp(`^${this.name}`, 'i');
        return regexp.test(user.firstName) || regexp.test(user.lastName) || regexp.test(user.login);
      });
    },
  },
};
</script>

<style scoped>
  .tickets_container {
    min-height: 80%;
    margin: 4% 20% 4% 20%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: #618BC1;
  }
  h2 {
    color: white;
    font-weight: bold;
  }
  input {
    width: 20em;
    height: 2em;
    margin-bottom: 2em;
  }
  p {
    color: white;
  }
</style>
