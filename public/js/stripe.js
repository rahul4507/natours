/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
// Use your publishable key here (it usually starts with 'pk_')
const stripe = Stripe('pk_test_51Qq84lRxjI1XJVUy4rhI25BxTAMkgBliZKdvAlLQsFMLGdCmeF1QWps6XHHP6IhLvqPfgwOAlteF1IhlxyyDy3TH00O4GHk7Zu');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Create checkout form and charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
