const { forEach, map } = require("lodash");
const Sequelize = require("sequelize");
const { FileCategory, File } = require("../../models/model");
const error = require("../../util/errors");

const uuid = require("uuid");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const config = require("../../config/app");

const mimeType = require("./mimetype.json");

const rimraf = require("rimraf");

const uploadPath = "./../../../public/uploads/";
const sharp = require('sharp');

module.exports = {
  default: async (req, res) => {
    res.json({
      maxFileSize: config.maxFileSize,
      acceptedFileTypes: config.allowedFileType,
    });
  },
  mime: async (req, res) => {
    const arrMime = [];

    forEach(mimeType, (value, key) => {
      arrMime.push({
        extension: key,
        mimetype: value,
      });
    });

    res.json(arrMime);
  },
  category: async (req, res, next) => {
    const mFileCategory = await FileCategory.findOne({
      attributes: ["id", "maxFileSize", "slug", "allowedExtension"],
      where: {
        slug: req.query.slug,
      },
    });
    if (!mFileCategory) {
      return error(res).validationError("Invalid ID");
    }
    mFileCategory.allowedExtension = map(
      mFileCategory.allowedExtension,
      (val) => {
        return mimeType[val];
      }
    );
    res.json(mFileCategory);
  },
  upload: async (req, res, next) => {
    // console.log("body = =", req.body);
    const categoryId = req.params.fileCategory;
    let category = null;

    let allowedFileType = config.allowedFileType;

    let limits = {
      files: 1,
      fileSize: config.maxFileSize,
    };

    if (categoryId) {
      category = await FileCategory.findOne({
        where: {
          slug: categoryId,
        },
      });
    }

    // Make Category Directory
    let _path = uploadPath;
    if (category) {
      _path = _path + category.slug + "/";
      const dirCat = path.join(__dirname + _path);
      if (!fs.existsSync(dirCat)) {
        await fs.mkdirSync(dirCat);
      }

      if (category.maxFileSize) {
        limits.fileSize = category.maxFileSize * 1024;
      }

      if (category.allowedExtension) {
        allowedFileType = map(category.allowedExtension, (ext) => {
          return mimeType[ext];
        });
      }
    }

    const id = uuid.v4();

    // Make Directory
    const dir = path.join(__dirname + _path + id);
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }
    let newName = null;

    const storage = multer.diskStorage({
      destination: dir + "/",
      filename: function (req, file, cb) {
        // console.log(file);
        let ext = null;
        for (var tp in mimeType) {
          if (mimeType[tp] == file.mimetype) {
            ext = tp;
            break;
          }
        }
        const filename = file.originalname;
        var _name = filename.substr(0, filename.lastIndexOf("."));
        _name = _name.replace(/[^a-zA-Z0-9-_\ \.\_\(\)]+/gi, "");
        _name = _name.substring(0, 100);
        newName = _name + "." + ext;

        cb(null, newName);
      },
    });

    try {
      const upload = multer({
        storage: storage,
        limits: limits,
        fileFilter: (req, file, cb) => {
          console.log("Mime = ", file.mimetype);
          console.log("File Type = ", allowedFileType);
          
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > limits.fileSize) {
            return cb({
              "status": false,
              "message": "File size cannot be more than " + module.exports.formatBytes(limits.fileSize)
            }, false);
          }

          if (allowedFileType.indexOf(file.mimetype) !== -1) {
            cb(null, true);
          } else {
            return cb({
              "status": false,
              "message": "Only " + allowedFileType.join(", ") + " Allowed"
            }, false);
          }
        },
      }).single("file");

      if (upload) {
        uploading = await upload(req, res, async (err) => {
          if(err){
            res.status(400).send(err);
          }

          // compress only image file
          const file = req.file;
          if (allowedFileType.indexOf(file.mimetype) !== -1) {
            const imagePath = req.file.path;
            const outputFile = req.file.path;
            const targetSize = 200000; // 200kb in bytes

            // Read the input image file
            fs.readFile(imagePath, function(err, data) {
              if (err) throw err;

              // Resize and compress the image using sharp
              sharp(data)
              .resize({ width: 800, height: 800, fit: 'inside' })
              .jpeg({ quality: 80, progressive: true, chromaSubsampling: '4:4:4' })
              .png({ quality: 80, progressive: true, chromaSubsampling: '4:4:4' })
              .toBuffer(function(err, buffer) {
                if (err) throw err;
                // Check if the compressed image is under the target size
                if (buffer.length > targetSize) {
                  // If the compressed image is still too big, reduce the quality and try again
                  sharp(buffer)
                    .jpeg({ quality: 60, progressive: true, chromaSubsampling: '4:2:0' })
                    .png({ quality: 60, progressive: true, chromaSubsampling: '4:2:0' })
                    .toBuffer(function(err, buffer) {
                      if (err) throw err;
                      
                      // Write the compressed image buffer to a file
                      fs.writeFile(outputFile, buffer, function(err) {
                        if (err) throw err;
                        console.log(`Compressed image saved to ${outputFile}`);
                      });
                    });
                } else {
                  // Write the compressed image buffer to a file
                  fs.writeFile(outputFile, buffer, function(err) {
                    if (err) throw err;
                    console.log(`Compressed image saved to ${outputFile}`);
                  });
                }
              });
            });
          }

          try {
            let fpath = id + "/" + newName;
            if (category) {
              fpath = category.slug + "/" + fpath;
            }
            const theFile = uploadPath + fpath;
            const extname = path.extname(theFile).substr(1);

            const mFile = await new File({
              id: id,
              fileCategoryId: category ? category.id : null,
              name: newName,
              type: file.mimetype,
              size: file.size,
              path: "/" + fpath,
              extension: extname,
              createdBy: req.user ? req.user.id : null,
            }).save();
            res.send(mFile.id);
          } catch (err) {
            next(err);
          }
        });
      }
    } catch (err) {
      next(err);
    }
  },
  load: async (req, res, next) => {
    const fileId = req.body.fileId;

    if (fileId) {
      const files = await File.findAll({
        attributes: [
          "id",
          "name",
          "fileCategoryId",
          "type",
          "size",
          "extension",
          "path",
        ],
        where: {
          id: {
            [Sequelize.Op.in]: fileId,
          },
        },
      });

      let data = [];
      forEach(files, (value, key) => {
        data.push({
          id: value.id,
          name: value.name,
          type: value.type,
          size: value.size,
          url: config.fileUrl + value.path,
        });
      });
      res.json(data);
    }

    error(res).validationError("Invalid ID");
  },
  delete: async (req, res, next) => {
    const id = req.query.id;
    const mFile = await File.findByPk(id);

    if (mFile) {
      let _path = uploadPath;
      if (mFile.fileCategoryId != null) {
        const mFileCategory = await FileCategory.findByPk(mFile.fileCategoryId);

        _path = _path + mFileCategory.slug + "/";
      }

      const dir = path.join(__dirname + _path + mFile.id);
      console.log(dir);
      await rimraf.sync(dir);

      await File.destroy({
        where: {
          id: id,
        },
      });
      res.send({ status: true });
    }
  },
  formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }
};
