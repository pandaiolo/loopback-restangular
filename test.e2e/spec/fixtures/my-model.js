// Test static properties model extension
module.exports = function (MyModel) {

  MyModel.STATUS_NEW = 0;
  MyModel.STATUS_PAID = 1;

  return MyModel;
};
