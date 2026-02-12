module.exports = function generateUserId() {
  return "COT" + Math.floor(100000 + Math.random() * 900000);
};
