import multer, { Field, Options, StorageEngine, diskStorage, memoryStorage } from "multer";
import path from "path";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppParams } from "../models/params.model";

const multerDisk = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/public/imgs");
  },
  filename: (req, file, cb) => {
    const extName = path.extname(file.originalname);
    const newFileName = `image-${Date.now()}${extName}`;
    cb(null, newFileName);
  },
});

const multerMemory = memoryStorage();

const createMulterOptions = (storageEngine: StorageEngine): Options => ({
  storage: storageEngine,
  limits: {
    fileSize: 4e6,
  },
  fileFilter : (req, file, cb) => {
    const allowedExtensions = /\.(jpg|png|jpeg|webp)$/i;
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.test(fileExtension)) {
        return cb(new Error("Incorrect File"));
      }
      cb(null, true);
    },
});


const uploader = multer(createMulterOptions(multerDisk));
const cloudUploader = multer(createMulterOptions(multerMemory));


//const cloudUploader = (fieldName: string) => cloudUploader.single(fieldName) as RequestHandler<AppParams>;
export const singleCloudUploader = (fieldName: string) => {

  const singleCloud = cloudUploader.single(fieldName);

  return (req: Request, res: Response, next: NextFunction) => {
    singleCloud(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
          switch (err.code) {
              case "LIMIT_PART_COUNT":
                  res.status(400).send({ message: "The number of uploaded files exceeds the limit." });
                  break;
              case "LIMIT_FILE_SIZE":
                  res.status(400).send({ message: "The uploaded file size exceeds the limit." });
                  break;
              case "LIMIT_FILE_COUNT":
                  res.status(400).send({ message: "The number of uploaded files exceeds the limit." });
                  break;
              case "LIMIT_FIELD_KEY":
                  res.status(400).send({ message: "The uploaded field key is invalid." });
                  break;
              case "LIMIT_FIELD_VALUE":
                  res.status(400).send({ message: "The uploaded field value is invalid." });
                  break;
              case "LIMIT_FIELD_COUNT":
                  res.status(400).send({ message: "The number of uploaded fields exceeds the limit." });
                  break;
              case "LIMIT_UNEXPECTED_FILE":
                      res.status(400).send({ message: "The uploaded file format is invalid." });
                  break;
              default:
                  res.status(500).send({ message: "An error occurred while uploading the file." });
          }
      } else if (err) {
          if (req.file?.mimetype !== "image/jpeg" && req.file?.mimetype !== "image/png" && req.file?.mimetype !== "image/jpg") {
            res.status(400).send({ message: "Only JPG, PNG, or JPEG files are allowed." });
          }
          return res.status(500).json({ error: 'Internal server error' });
      } else {
          next();
      }
  });
  };
};

//export const multiCloudUploader = (fieldName: string, maxCount: number) => cloudUploader.array(fieldName, maxCount);
export const multiCloudUploader = (fieldName: string, maxCount: number): RequestHandler => {

    const multiCloud = cloudUploader.array(fieldName, maxCount);
    return (req: Request, res: Response, next: NextFunction) => {
      multiCloud(req, res, (err: unknown) => {
        if (err instanceof multer.MulterError) {
          switch (err.code) {
              case "LIMIT_PART_COUNT":
                  res.status(400).send({ message: "The number of uploaded files exceeds the limit." });
                  break;
              case "LIMIT_FILE_SIZE":
                  res.status(400).send({ message: "The uploaded file size exceeds the limit." });
                  break;
              case "LIMIT_FILE_COUNT":
                  res.status(400).send({ message: "The number of uploaded files exceeds the limit." });
                  break;
              case "LIMIT_FIELD_KEY":
                  res.status(400).send({ message: "The uploaded field key is invalid." });
                  break;
              case "LIMIT_FIELD_VALUE":
                  res.status(400).send({ message: "The uploaded field value is invalid." });
                  break;
              case "LIMIT_FIELD_COUNT":
                  res.status(400).send({ message: "The number of uploaded fields exceeds the limit." });
                  break;
              case "LIMIT_UNEXPECTED_FILE":
                      res.status(400).send({ message: "The uploaded file format is invalid." });
                  break;
              default:
                  res.status(500).send({ message: "An error occurred while uploading the file." });
          }
        } else if (err) {
          if (!req.file || !["image/jpeg", "image/png", "image/jpg"].includes(req.file.mimetype)) {
            return res.status(400).send({ message: "Only JPG, PNG, or JPEG files are allowed." });
          }
          return res.status(500).json({ error: 'Internal server error' });
        }
        next(); // Lanjutkan ke middleware berikutnya jika tidak ada kesalahan
      });
    };
};

//export const multiFieldCloudUploader = (fieldConfig: Field[]) => cloudUploader.fields(fieldConfig);
export const multiFieldCloudUploader = (fieldName: Field[] ) => {
  const multiFieldCloud = cloudUploader.fields(fieldName);
  return (req: Request, res: Response, next: NextFunction) => {
    multiFieldCloud(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
          switch (err.code) {
              case "LIMIT_PART_COUNT":
                  res.status(400).send({ message: "The number of uploaded files exceeds the limit." });
                  break;
              case "LIMIT_FILE_SIZE":
                  res.status(400).send({ message: "The uploaded file size exceeds the limit." });
                  break;
              case "LIMIT_FILE_COUNT":
                  res.status(400).send({ message: "The number of uploaded files exceeds the limit." });
                  break;
              case "LIMIT_FIELD_KEY":
                  res.status(400).send({ message: "The uploaded field key is invalid." });
                  break;
              case "LIMIT_FIELD_VALUE":
                  res.status(400).send({ message: "The uploaded field value is invalid." });
                  break;
              case "LIMIT_FIELD_COUNT":
                  res.status(400).send({ message: "The number of uploaded fields exceeds the limit." });
                  break;
              case "LIMIT_UNEXPECTED_FILE":
                      res.status(400).send({ message: "The uploaded file format is invalid." });
                  break;
              default:
                  res.status(500).send({ message: "An error occurred while uploading the file." });
          }
      } else if (err) {
          if (req.file?.mimetype !== "image/jpeg" && req.file?.mimetype !== "image/png" && req.file?.mimetype !== "image/jpg") {
            res.status(400).send({ message: "Only JPG, PNG, or JPEG files are allowed." });
          }
          return res.status(500).json({ error: 'Internal server error' });
      } else {
          next();
      }
  });
  };
}; 


export const singleUploader = (fieldName: string) => uploader.single(fieldName) as RequestHandler<AppParams>;
export const multiUploader = (fieldName: string, maxCount: number) => uploader.array(fieldName, maxCount);
export const multiFieldUploader = (fieldConfig: Field[]) => uploader.fields(fieldConfig);
