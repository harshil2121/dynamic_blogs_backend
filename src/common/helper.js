const moment = require("moment");
const fs = require("fs");

const getCurrentTime = () => moment().format("YYYY-MM-DD HH:mm:ss");
const getDateTime = (date) => moment(date).format("YYYY-MM-DD HH:mm:ss");

const unlinkFiles = async (file) => {
  if (fs.existsSync(file)) {
    await fs.unlinkSync(file);
  }
};

module.exports = {
  getCurrentTime,
  getDateTime,
  unlinkFiles,
};
