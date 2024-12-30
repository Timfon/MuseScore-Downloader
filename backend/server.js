// server.js
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Directory to store downloaded files
const DOWNLOADS_DIR = path.join(__dirname, 'downloads');

// Ensure downloads directory exists
(async () => {
  try {
    await fs.access(DOWNLOADS_DIR);
  } catch {
    await fs.mkdir(DOWNLOADS_DIR, { recursive: true });
  }
})();

app.post('/api/download', async (req, res) => {
  const { url, format } = req.body;
  
  if (!url || !format) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Generate unique filename
    const timestamp = Date.now();
    const outputPath = path.join(DOWNLOADS_DIR, `${timestamp}`);
    
    // Execute dl-librescore command
    const command = `npx dl-librescore@latest "${url}" -f ${format} -o "${outputPath}"`;
    
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error('Execution error:', error);
        return res.status(500).json({ error: 'Download failed', details: error.message });
      }

      try {
        // Find the downloaded file
        const files = await fs.readdir(outputPath);
        const downloadedFile = files.find(file => file.endsWith(format));
        
        if (!downloadedFile) {
          return res.status(404).json({ error: 'Downloaded file not found' });
        }

        const filePath = path.join(outputPath, downloadedFile);
        
        // Stream the file to client
        res.download(filePath, downloadedFile, async (err) => {
          if (err) {
            console.error('Download error:', err);
          }
          
          // Cleanup: Delete the temporary files after download
          try {
            await fs.rm(outputPath, { recursive: true, force: true });
          } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
          }
        });
      } catch (fsError) {
        console.error('File system error:', fsError);
        res.status(500).json({ error: 'File system error', details: fsError.message });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
