const { body, oneOf, validationResult } = require("express-validator");
const formModel = require("../models/formModal");
const { unlinkFiles } = require("../common/helper");
const ResponseHandler = require("../common/responceHandler");
const MSGConst = require("../common/massageConstant");
const fs = require("fs");

class FormController {
  constructor() {
    this.createForm = this.createForm.bind(this);
    this.editForm = this.editForm.bind(this);
    this.deleteFiles = this.deleteFiles.bind(this);
  }

  async createForm(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const filenames = req.files.map((file) => ({
        filename: file.filename,
        original_name: file.originalname,
        path: file.path,
      }));

      const result = await formModel.createForm(req.body, filenames);

      ResponseHandler.successResponse(res, 200, MSGConst.POST_SUCCESS, result);
    } catch (error) {
      console.error(error);
      await this.deleteFiles(req.files.map((file) => file.path));
      ResponseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  async editForm(req, res) {
    try {
      console.log("reqqq", req.body, req.files);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const oneOfError = errors
          .array()
          .find((err) => err.param === "description" || err.param === "img");
        if (oneOfError) {
          return res.status(400).json({ errors: [oneOfError] });
        }
        return res.status(400).json({ errors: errors.array() });
      }

      const id = req.params.id;
      const input = req.body;

      const filenames = req.files.map((file) => ({
        filename: file.filename,
        original_name: file.originalname,
        path: file.path,
      }));

      const existingImages = await formModel.getExistingImages(id);
      const existingImagePaths = existingImages.map((image) => image);
      const newImagePaths = filenames.map((file) => file?.path);

      const removedImages = existingImagePaths.filter(
        (path) => !newImagePaths.includes(path)
      );

      for (const removedImagePath of removedImages) {
        if (fs.existsSync(removedImagePath)) {
          fs.unlinkSync(removedImagePath); // Delete file from the uploads folder
        }
        await formModel.deleteImage(id, removedImagePath); // Delete the image from the database
      }

      const data = await formModel.editForm(id, input, newImagePaths);

      ResponseHandler.successResponse(
        res,
        200,
        "Form updated successfully",
        data
      );
    } catch (error) {
      ResponseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  async getAllForm(req, res) {
    try {
      const result = await formModel.getAllForm(req, res);
      ResponseHandler.successResponse(res, 200, MSGConst.SUCCESS, result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getByFormId(req, res) {
    try {
      const result = await formModel.getByFormId(req.params.id);
      ResponseHandler.successResponse(res, 200, MSGConst.SUCCESS, result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteForm(req, res) {
    try {
      const result = await formModel.deleteForm(req.params.id);
      ResponseHandler.successResponse(res, 200, MSGConst.SUCCESS, result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteFiles(files) {
    try {
      for (const file of files) {
        if (fs.existsSync(file)) {
          await fs.promises.unlink(file);
        }
      }
    } catch (error) {
      console.error("Error deleting files: ", error);
    }
  }

  static validate(method) {
    switch (method) {
      case "createForm":
        return [
          body("first_name").notEmpty().withMessage("Please enter first name."),
          body("last_name").notEmpty().withMessage("Please enter last name."),
          oneOf(
            [
              body("description")
                .notEmpty()
                .withMessage("Please enter description or provide images."),
              body("img").custom((value, { req }) => {
                if (!req.files || req.files.length === 0) {
                  throw new Error(
                    "Please enter description or provide images."
                  );
                } else if (req.files.length > 10) {
                  throw new Error("You can upload a maximum of 10 images.");
                }
                return true;
              }),
            ],
            "Please enter description or provide images."
          ),
        ];

      case "editForm":
        return [
          body("first_name").notEmpty().withMessage("Please enter first name."),
          body("last_name").notEmpty().withMessage("Please enter last name."),
          oneOf(
            [
              body("description")
                .notEmpty()
                .withMessage("Please enter description or provide images."),
              body("img").custom((value, { req }) => {
                if (!req.files || req.files.length === 0) {
                  throw new Error(
                    "Please enter description or provide images."
                  );
                } else if (req.files.length > 10) {
                  throw new Error("You can upload a maximum of 10 images.");
                }
                return true;
              }),
            ],
            "Please enter description or provide images."
          ),
        ];
      default:
        return [];
    }
  }
}

module.exports = new FormController();
