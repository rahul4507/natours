/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('sk_test_51Qq84lRxjI1XJVUyhIjRkyS0BT8ZiBS6KTA46doyiZhtysbayYFfsImpv8mVdeDccE52EpNqcMlQf1MTr6mXZUny006S5Q8f6D');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
