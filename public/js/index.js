import { login, logout, signup } from './login.js';
import { updateSettings } from './updateSettings.js';
import { displayMap } from './mapbox.js';
import { bookTour } from './stripe.js';
import '@babel/polyfill';


// DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');
const signupForm = document.querySelector('.form--signup');
const updateUserDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
const bookTourButton = document.getElementById('book-tour');

// Login
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

// Logout
if (logoutButton) logoutButton.addEventListener('click', logout);

// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

// Signup
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

// update settings
if (updateUserDataForm) {
  updateUserDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);

    const photoInput = document.getElementById('photo');
    if (photoInput.files.length > 0) {
      form.append('photo', photoInput.files[0]); // Append the selected photo
    }

    await updateSettings(form, 'data');
  });
}

// update password
if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');
  });
}

if (bookTourButton) {
  bookTourButton.addEventListener('click', async e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    await bookTour(tourId);
  });
} 