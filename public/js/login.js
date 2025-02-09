// /* eslint-disable */
// import axios from 'axios';
// import { showAlert } from './alerts';

// const { STATUS } = require("../../utils/constants");

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

// export const logout = async () => {
//   try {
//     const res = await axios({
//       method: 'GET',
//       url: 'http://127.0.0.1:3000/api/v1/users/logout'
//     });
//     if ((res.data.status = 'success')) location.reload(true);
//   } catch (err) {
//     console.log(err.response);
//     showAlert('error', 'Error logging out! Try again.');
//   }
// };


const login = async (email, password) => {
  console.log(email);
  console.log(password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    console.log(res);
    if (res.data.status === 'success') {
      // alert('Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      });
    }
  } catch (err) {
    console.log(err);
  }
}

document.querySelector('.form').addEventListener('submit', e => {
  // alert(email);
  // console.log('Hello');
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  // alert(email);
  // console.log(email);
  login(email, password);
});

