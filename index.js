const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const port = 3000;

app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadedFile = req.files.file;
  const allowedExtensions = ['mp3', 'mp4', 'gif', 'png', 'jpg'];

  if (!allowedExtensions.includes(uploadedFile.name.split('.').pop())) {
    return res.status(400).send('Invalid file type.');
  }

  if (uploadedFile.size > 50 * 1024 * 1024) {
    return res.status(400).send('File size exceeds the limit (50MB).');
  }

  const fileName = `${Date.now()}_${uploadedFile.name}`;
  uploadedFile.mv(path.join(__dirname, 'uploaded_files', fileName), (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send(`File uploaded successfully. You can access it <a href="/uploads/${fileName}">here</a>`);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
