const multer = require("multer");
const fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = `${process.env.UPLOAD_DIR}`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileExt = file.originalname.split(".").pop();
    cb(null, `${file.originalname}`);
  },
});

exports.upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "img") {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(
          new Error("Invalid file type. Only PNG, JPG, and JPEG are allowed.")
        );
      }
    } else {
      cb(new Error("Invalid fieldname"));
    }
  },
});
