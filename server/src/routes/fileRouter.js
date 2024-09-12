const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { File } = require('../../db/models'); 
const { verifyAccessToken } = require('../middlewares/verifyTokens');

const fileRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension); 
  }
});

const upload = multer({ storage: storage });

fileRouter.post('/upload', verifyAccessToken, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      console.log(req.user);
  
      const { originalname, mimetype, size, filename, path: filePath } = req.file;
      const extension = path.extname(originalname);
  
      if (!req.user || !req.user.id) {
        return res.status(400).json({ error: 'User ID not found' });
      }
  
      const newFile = await File.create({
        user_id: req.user.id,      
        file_name: filename,       
        extension: extension,      
        mime_type: mimetype,       
        size: size,                
        upload_date: new Date(),   
        file_path: filePath,       
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
  
  
  
  fileRouter.get('/list', verifyAccessToken, async (req, res) => {
    try {
      const listSize = parseInt(req.query.list_size) || 10; 
      const page = parseInt(req.query.page) || 1; 
      
      const offset = (page - 1) * listSize;
  
      const files = await File.findAndCountAll({
        limit: listSize,
        offset: offset,
        order: [['upload_date', 'DESC']], 
      });
  
      res.json({
        totalItems: files.count,
        totalPages: Math.ceil(files.count / listSize),
        currentPage: page,
        files: files.rows,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve files' });
    }
  });

  fileRouter.delete('/delete/:id', verifyAccessToken, async (req, res) => {
    const fileId = req.params.id;
  
    try {
      
      console.log('User performing delete:', req.user);
  
      const file = await File.findByPk(fileId);
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      if (file.user_id !== req.user.id && req.user.id !== 1) {
        return res.status(403).json({ error: 'Access denied. You can only delete your own files or must be an admin.' });
      }
  
      const filePath = path.resolve(file.file_path);
  
      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error(`Error deleting file: ${err.message}`);
          return res.status(500).json({ error: 'Failed to delete file from storage' });
        }
  
        await File.destroy({ where: { id: fileId } });
  
        res.status(200).json({ message: 'File deleted successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  });

  fileRouter.get('/:id', async (req, res) => {
    const fileId = req.params.id;
  
    try {
      const file = await File.findByPk(fileId);
  
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      res.status(200).json({
        id: file.id,
        file_name: file.file_name,
        extension: file.extension,
        mime_type: file.mime_type,
        size: file.size,
        upload_date: file.upload_date,
        file_path: file.file_path,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve file information' });
    }
  });

  fileRouter.put('/update/:id', verifyAccessToken, upload.single('file'), async (req, res) => {
    const fileId = req.params.id;
  
    try {
    
      const existingFile = await File.findByPk(fileId);
  
      if (!existingFile) {
        return res.status(404).json({ error: 'файл не найден' });
      }
  
      
      if (existingFile.user_id !== req.user.id && req.user.id !== 1) {
        return res.status(403).json({ error: 'Access запрещен' });
      }
  
     
      const oldFilePath = path.resolve(existingFile.file_path);
  
      
      fs.unlink(oldFilePath, async (err) => {
        if (err) {
          console.error(`Error deleting old file: ${err.message}`);
          return res.status(500).json({ error: 'Failed to delete old file' });
        }
  
        
        const { originalname, mimetype, size, filename, path: newFilePath } = req.file;
        const extension = path.extname(originalname);
  
        
        await File.update(
          {
            file_name: filename,      
            extension: extension,     
            mime_type: mimetype,      
            size: size,               
            upload_date: new Date(),  
            file_path: newFilePath    
          },
          { where: { id: fileId } }
        );
  
        res.status(200).json({ message: 'File updated successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update file' });
    }
  });

  fileRouter.get('/download/:id', async (req, res) => {
    const fileId = req.params.id;
  
    try {
      
      const file = await File.findByPk(fileId);
  
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      
      const filePath = path.resolve(file.file_path);
  
      
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error(`File not found on disk: ${err.message}`);
          return res.status(404).json({ error: 'File not found on disk' });
        }
  
       
        res.download(filePath, file.file_name, (err) => {
          if (err) {
            console.error(`Error during file download: ${err.message}`);
            return res.status(500).json({ error: 'Failed to download file' });
          }
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve file for download' });
    }
  });
  
  


module.exports = fileRouter;
