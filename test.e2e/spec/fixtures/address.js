// Test extending local model
module.exports = function (Address) {

  Address.prototype.prettyPrint = function () {
    // Just a prototype function
  };

};
