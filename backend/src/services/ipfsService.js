const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const ipfs = require('../config/ipfs');

class IPFSService {
  async uploadToIPFS(dirPath) {
    let zipFile = null;
    try {
      console.log('📂 Processing path:', dirPath);
      
      // Check if path exists
      try {
        await fs.access(dirPath);
        console.log('✅ Path exists');
      } catch (error) {
        throw new Error(`Path does not exist: ${dirPath}`);
      }

      // Get stats to check if it's a file or directory
      const stats = await fs.stat(dirPath);
      
      if (stats.isFile()) {
        console.log('📄 Processing single file');
        const fileData = await fs.readFile(dirPath);
        console.log(`📊 File size: ${(fileData.length / 1024 / 1024).toFixed(2)} MB`);
        console.log('📤 Uploading file to IPFS...');
        const result = await ipfs.add(fileData);
        console.log(`✅ File uploaded to IPFS: ${result.path}`);
        return result.path;
      }

      console.log('📁 Processing directory');
      
      // Create a temporary zip file in the same directory
      zipFile = path.join(path.dirname(dirPath), `${path.basename(dirPath)}-${Date.now()}.zip`);
      console.log(`📦 Creating zip file: ${zipFile}`);
      
      // Import archiver here to avoid global import
      const archiver = require('archiver');
      
      // Create zip file with better error handling
      await new Promise((resolve, reject) => {
        const output = fsSync.createWriteStream(zipFile);
        const archive = archiver('zip', {
          zlib: { level: 9 }
        });

        output.on('close', () => {
          console.log(`📊 Zip file size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
          resolve();
        });

        archive.on('warning', (err) => {
          if (err.code === 'ENOENT') {
            console.warn('⚠️ Archive warning:', err);
          } else {
            reject(err);
          }
        });

        archive.on('error', reject);

        archive.pipe(output);
        archive.directory(dirPath, false);
        archive.finalize();
      });

      console.log('✅ Zip file created successfully');

      // Upload zip file to IPFS
      console.log('📤 Uploading zip to IPFS...');
      const zipData = await fs.readFile(zipFile);
      const result = await ipfs.add(zipData);
      console.log(`✅ Directory uploaded to IPFS: ${result.path}`);
      
      return result.path;
    } catch (error) {
      console.error('🚨 Upload error:', error);
      throw new Error(`Failed to upload to IPFS: ${error.message}`);
    } finally {
      // Clean up zip file if it exists
      if (zipFile) {
        try {
          await fs.unlink(zipFile);
          console.log('🗑️ Cleaned up temporary zip file');
        } catch (cleanupError) {
          console.error('⚠️ Failed to clean up zip file:', cleanupError);
        }
      }
    }
  }

  async pinToIPFS(cid) {
    try {
      await ipfs.pin.add(cid);
      console.log(`📌 Content pinned: ${cid}`);
      return true;
    } catch (error) {
      console.error('IPFS pin error:', error);
      throw new Error('Failed to pin content');
    }
  }

  async unpinFromIPFS(cid) {
    try {
      await ipfs.pin.rm(cid);
      console.log(`📌 Content unpinned: ${cid}`);
      return true;
    } catch (error) {
      console.error('IPFS unpin error:', error);
      return false;
    }
  }

  getIPFSUrl(cid) {
    const gateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs';
    return `${gateway}/${cid}`;
  }
}

module.exports = new IPFSService();