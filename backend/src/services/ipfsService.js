const fs = require('fs').promises;
const ipfs = require('../config/ipfs');

class IPFSService {
  async uploadToIPFS(filePath) {
    try {
      // Read the file
      const fileData = await fs.readFile(filePath);

      // Upload to IPFS
      const result = await ipfs.add(fileData);

      console.log(`✅ File uploaded to IPFS: ${result.path}`);
      return result.path; // This is the CID
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload to IPFS');
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
    return `https://ipfs.io/ipfs/${cid}`;
  }
}

module.exports = new IPFSService();
