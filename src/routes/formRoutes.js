const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");
const { upload } = require("../middleware/multer");

router.post(
  "/create",
  upload.array("img", 10),
  formController.constructor.validate("createForm"),
  formController.createForm
);
router.put(
  "/edit/:id",
  upload.array("img", 10),
  formController.constructor.validate("editForm"),
  formController.editForm
);
router.get("/getall", formController.getAllForm);
router.get("/view/:id", formController.getByFormId);
router.delete("/delete/:id", formController.deleteForm);

module.exports = router;
