<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    /*
      if the current token is expired, a 401 error will be intercepted,
      and the user will be logged out after receiving this pop-up
    */
    this.$HTTP.interceptors.response.use(response => response, error => new Promise(() => {
      if (error.response.status === 401) {
        this.$swal({
          title: 'Сессия истекла',
          text: 'Ваша сессия истекла',
          type: 'warning',
          confirmButtonColor: '#274D81',
          confirmButtonText: 'Ок',
        }).then(() => {
          this.$store.dispatch('AUTH_LOGOUT');
          this.$router.push('/');
        });
      }
      throw error;
    }));
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  overflow-y: hidden;
}
html, body {
  margin: 0;
  height: 100%;
}

/*
  some styles shared by several components of the application
*/

.formError {
  border-color: lightcoral;
  border-style: solid;
}
.messageError {
  color: red;
  font-size: 1em;
}
.submit_button {
  color: white;
  font-size: 1.4em;
  width: 8em;
  height: 2.5em;
  border-radius: 10px;
  border-style: none;
  cursor: pointer;
  background-color: #274D81;
}
.normal_button {
  color: white;
  font-size: 1.2em;
  width: 8em;
  height: 2.5em;
  border-radius: 10px;
  border-style: none;
  cursor: pointer;
  background-color: #3D67A0;
}
.status {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5em;
  height: 40px;
}
</style>
