const express = require('express');

const router = express.Router();

const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

const getUser = (req, res) => {
  res
    .status(500)
    .json({ status: ERROR, message: 'This route is not yet defined' });
};

const getUsers = (req, res) => {
  res
    .status(500)
    .json({ status: ERROR, message: 'This route is not yet defined' });
};

const createUser = (req, res) => {
  res
    .status(500)
    .json({ status: ERROR, message: 'This route is not yet defined' });
};

const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: ERROR, message: 'This route is not yet defined' });
};

const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: ERROR, message: 'This route is not yet defined' });
};

// Users
router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
