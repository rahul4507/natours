// /* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// export const login = async (email, password) => {
//   try {
//     alert(email);
//     const res = await axios({
//       method: 'POST',
//       url: 'http://127.0.0.1:3000/api/v1/users/login',
//       data: {
//         email,
//         password
//       }
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', 'Logged in successfully!');
//       window.setTimeout(() => {
//         location.assign('/');
//       }, 1500);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
      withCredentials: true
    });
    if ((res.data.status = 'success')) {
      window.setTimeout(() => {
        location.assign('/');
      });
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};


export const login = async (email, password) => {
  console.log(email);
  console.log(password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      },
      withCredentials: true
    });
    // console.log(res);
    showAlert('success', res);
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      });
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}

export const signup = async (name, email, password, passwordConfirm) => {
  console.log(name);
  console.log(email);

  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      },
      withCredentials: true
    });
    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      });
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}


