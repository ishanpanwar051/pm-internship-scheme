const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Storage configuration with unique timestamp filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, `${basename}_${uniqueSuffix}${ext}`);
  },
});

// File filter supporting PDF documents and image files
const fileFilter = (req, file, cb) => {
  const allowedDocMimes = ['application/pdf'];
  const allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

  if (
    allowedDocMimes.includes(file.mimetype) ||
    allowedImageMimes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only PDF documents and standard images (JPEG, PNG, WebP) are accepted.'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter,
});

module.exports = upload;
