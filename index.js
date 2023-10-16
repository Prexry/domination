const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

app.use(fileUpload());

app.use(express.static(path.join(__dirname, 'public')));

function generateRandomText(length) {
  return crypto.randomBytes(length).toString('hex');
}

const allowedExtensions = ['mp3', 'mp4', 'txt', 'png', 'jpg', 'webm', 'webp', 'ico'];

function isAllowedExtension(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  return allowedExtensions.includes(extension);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadedFile = req.files.file;

  if (uploadedFile) {
    const originalFileName = uploadedFile.name;
    const extension = originalFileName.split('.').pop().toLowerCase();

    if (!isAllowedExtension(originalFileName)) {
      return res.status(400).send('Invalid file type. Allowed file types: mp3, mp4, txt, png, jpg, webm, webp, ico');
    }

    if (uploadedFile.data.length > 50 * 1024 * 1024) {
      return res.status(400).send('File size exceeds the limit (50MB).');
    }

    const randomText = generateRandomText(8); // Adjust the length as needed
    const newFileName = `${randomText}_${originalFileName}`;

    // Save the uploaded file with the new filename to the "public/uploads" directory
    uploadedFile.mv(path.join(__dirname, 'public', 'uploads', newFileName), (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      // Generate a link to the uploaded file
      const fileLink = `/uploads/${newFileName}`;

      // Provide the link as a response
      res.send(`File uploaded successfully. You can access it <a href="${fileLink}">here</a>`);
    });
  } else {
    res.status(400).send('Invalid file.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
