// Mock IPFS client for development without credentials
// In production, use ipfs-http-client or Helia

const ipfs = {
  async add(data) {
    // Mock implementation - generates a fake CID
    const mockCID = 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log('📦 Mock IPFS: Generated CID:', mockCID);
    return { path: mockCID, cid: mockCID };
  },
  
  pin: {
    async add(cid) {
      console.log('📌 Mock IPFS: Pinned', cid);
      return true;
    },
    async rm(cid) {
      console.log('📌 Mock IPFS: Unpinned', cid);
      return true;
    }
  }
};

// Uncomment below and install dependencies for real IPFS
/*
const { create } = require('ipfs-http-client');
const ipfs = create({
  host: process.env.IPFS_HOST || 'ipfs.infura.io',
  port: process.env.IPFS_PORT || 5001,
  protocol: process.env.IPFS_PROTOCOL || 'https',
  headers: {
    authorization: process.env.IPFS_PROJECT_ID
      ? `Basic ${Buffer.from(
          `${process.env.IPFS_PROJECT_ID}:${process.env.IPFS_PROJECT_SECRET}`
        ).toString('base64')}`
      : undefined,
  },
});
*/

module.exports = ipfs;
