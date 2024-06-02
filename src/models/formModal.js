const path = require("path");
const fs = require("fs");
const { getCurrentTime } = require("../common/helper");

class FormModal {
  constructor() {}

  async createForm(input, filenames) {
    try {
      const imagePaths = filenames.map((file) => file.path);

      let data = {
        first_name: input.first_name?.trim(),
        last_name: input.last_name?.trim(),
        images: JSON.stringify(imagePaths),
        description:
          input?.description !== "" ? input?.description?.trim() : null,
        created_at: getCurrentTime(),
        updated_at: getCurrentTime(),
      };

      const [Rows, postFields] = await connectPool.query(
        "INSERT INTO forms SET ?",
        data
      );

      return Rows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async editForm(id, input, filenames) {
    try {
      console.log("eee", filenames);
      let data = {
        first_name: input.first_name?.trim(),
        last_name: input.last_name?.trim(),
        images: JSON.stringify(filenames),
        description:
          input.description !== "" ? input.description?.trim() : null,
        updated_at: getCurrentTime(),
      };

      await connectPool.query(`UPDATE forms SET ? WHERE id = ?`, [data, id]);

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteImage(id, imagePath) {
    try {
      const result = await connectPool.query(
        `UPDATE forms SET images = JSON_REMOVE(images, JSON_UNQUOTE(JSON_SEARCH(images, 'one', ?))) WHERE id = ?`,
        [imagePath, id]
      );

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getExistingImages(id) {
    try {
      const result = await connectPool.query(
        `SELECT images FROM forms WHERE id = ?`,
        [id]
      );

      if (result?.length > 0) {
        // Access the correct element of the array
        const imagesString = result[0][0].images;
        return JSON.parse(imagesString);
      }
      return [];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllForm() {
    try {
      const [rows, fields] = await connectPool.query(`SELECT * FROM forms`);
      return rows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getByFormId(id) {
    try {
      const [rows, fields] = await connectPool.query(
        `SELECT * from forms WHERE id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteForm(id) {
    try {
      const [fileRows] = await connectPool.query(
        `SELECT images FROM forms WHERE id = ?`,
        [id]
      );
      const images = JSON.parse(fileRows[0].images);

      const uploadDir = process.env.UPLOAD_DIR;

      for (const imageName of images) {
        const filePath = path.join(uploadDir, imageName);
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      }
      await connectPool.query(`DELETE FROM forms WHERE id = ?`, [id]);

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new FormModal();
