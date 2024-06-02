const createFormTable = require("./createFormTable");

class Migrations {
  constructor() {}

  async migrate(req, res) {
    await createFormTable.create();
    res.send(["Migrated"]);
  }
}

module.exports = new Migrations();
