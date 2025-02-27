import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const headers = type === 'data' ? { 'Content-Type': 'multipart/form-data' } : {};

    const res = await axios({
      method: 'PATCH',
      url,
      data,
      headers
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      location.reload(); // Reload to update UI
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
