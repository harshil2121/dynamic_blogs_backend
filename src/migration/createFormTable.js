class createFormTable {
  constructor() {}

  async create() {
    try {
      const [create, fields_create] = await connectPool.query(
        `CREATE TABLE IF NOT EXISTS forms (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(255) DEFAULT NULL,
          last_name VARCHAR(255) DEFAULT NULL,
          description TEXT DEFAULT NULL,
          images JSON DEFAULT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP NULL DEFAULT NULL
        )`
      );
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new createFormTable();
