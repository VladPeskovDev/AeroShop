const express = require('express');
const multer = require('multer');
const path = require('path');
const { File } = require('../../db/models'); 

const fileRouter = express.Router();

// Настройка хранения файлов с помощью Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Пример: file-1234567890.jpg
  }
});

const upload = multer({ storage: storage });

fileRouter.post('/upload', upload.single('file'), async (req, res) => {
    try {
      console.log(req.file); // Проверка, что файл получен
  
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const { originalname, mimetype, size, filename } = req.file;
      const extension = path.extname(originalname);
  
      const newFile = await File.create({
        fileName: filename,
        extension: extension,
        mimeType: mimetype,
        size: size,
        uploadDate: new Date(),
      });
  
      res.status(201).json({
        message: 'File uploaded successfully',
        file: newFile,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });
  

module.exports = fileRouter;
