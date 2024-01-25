
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({extended:false}));

mongoose.connect('mongodb://127.0.0.1:27017/fileUploadDB');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define schema and model for file paths
const fileSchema = new mongoose.Schema({
    path: String
});
const File = mongoose.model('File', fileSchema);

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Route for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Save file path to MongoDB
        
        const filePath = req.file.path;
        const newFile = new File({ path: filePath });
        await newFile.save();
        res.status(201).send('File uploaded successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
