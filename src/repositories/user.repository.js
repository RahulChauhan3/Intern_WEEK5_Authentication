const User = require("../models/User");

function createUserRepository() {
  return {
    findByEmail(email, options = {}) {
      const query = User.findOne({ email: email.toLowerCase() });
      if (options.includePasswordHash) query.select("+passwordHash");
      return query.exec();
    },
    create(data) {
      return User.create(data);
    },
    findPublicById(id) {
      return User.findById(id).select("name email createdAt").exec();
    }
  };
}

module.exports = { createUserRepository };
