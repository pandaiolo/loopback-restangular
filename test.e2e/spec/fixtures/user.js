// Test model extension with prototype function
module.exports = function (User) {

  User.prototype.getFullName = function () {
    return this.firstName + this.lastName;
  };

  return User;
};
