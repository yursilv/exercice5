import store from './store';

// basic class for a request
class Request {
  http = store.state.HTTP;
  store = store;
  status = null;
}

class GetUsers extends Request {
  execute() {
    return new Promise((resolve, reject) => {
      this.status = 'loading';
      // a token is needed to get access to the api
      this.http.defaults.headers.authorization = this.store.state.token;
      this.http.get('users')
        .then((response) => {
          this.status = 'success';
          this.store.commit('TOKEN_UPDATE', response.data.data.token);
          resolve(response.data.data.users);
        })
        .catch((err) => {
          this.status = 'error';
          reject(err);
        });
    });
  }
}

class Auth extends Request {
  execute(user) {
    return new Promise((resolve, reject) => {
      this.status = 'loading';
      this.http.defaults.headers.authorization = this.store.state.token;
      this.http.post('users/auth', { user })
        .then((response) => {
          this.store.commit('AUTH_SUCCESS', { token: response.data.data.token, user: response.data.data.user });
          resolve(response.data.data.user);
        })
        .catch((err) => {
          this.status = 'error';
          reject(err);
        });
    });
  }
}

class Register extends Request {
  execute(user) {
    return new Promise((resolve, reject) => {
      this.status = 'loading';
      this.http.post('users/register', { user, token: this.store.state.token })
        .then((response) => {
          this.status = 'success';
          resolve(response.data.data.user);
        })
        .catch((err) => {
          this.status = 'error';
          reject(err);
        });
    });
  }
}

export {
  GetUsers,
  Auth,
  Register,
};
