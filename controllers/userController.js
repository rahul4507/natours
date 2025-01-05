const { STATUS } = require('../utils/constants');

exports.getUser = (req, res) => {
  res
    .status(500)
    .json({ status: STATUS.ERROR, message: 'This route is not yet defined' });
};

exports.getUsers = (req, res) => {
  res
    .status(500)
    .json({ status: STATUS.ERROR, message: 'This route is not yet defined' });
};

exports.createUser = (req, res) => {
  res
    .status(500)
    .json({ status: STATUS.ERROR, message: 'This route is not yet defined' });
};

exports.updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: STATUS.ERROR, message: 'This route is not yet defined' });
};

exports.deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: STATUS.ERROR, message: 'This route is not yet defined' });
};
