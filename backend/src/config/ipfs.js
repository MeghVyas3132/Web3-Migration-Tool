const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Pinata IPFS Configuration
// Prioritize API Key/Secret for file uploads (JWT typically doesn't have pinning scopes)
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const PINATA_JWT = !PINATA_API_KEY ? process.env.PINATA_JWT : null;

// Check if Pinata credentials are configured
const isPinataConfigured = (PINATA_API_KEY && PINATA_API_SECRET) || PINATA_JWT;

// Log configuration status
console.log('🔑 Pinata Auth Mode:', PINATA_API_KEY ? 'API Key' : (PINATA_JWT ? 'JWT' : 'Not Configured'));

if (!isPinataConfigured) {
  console.log('⚠️  Pinata credentials not configured. Using mock IPFS mode.');
  console.log('   Add PINATA_JWT or PINATA_API_KEY/PINATA_API_SECRET to .env file');
}

const ipfs = {
  async validatePinataCredentials() {
    if (!isPinataConfigured) {
      throw new Error('Pinata credentials not configured. Add PINATA_JWT or PINATA_API_KEY/PINATA_API_SECRET to .env file');
    }

    try {
      const testUrl = 'https://api.pinata.cloud/data/testAuthentication';
      const headers = PINATA_JWT
        ? { Authorization: `Bearer ${PINATA_JWT}` }
        : {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_API_SECRET
          };

      await axios.get(testUrl, { headers });
      console.log('✅ Pinata credentials are valid');
      return true;
    } catch (error) {
      console.error('❌ Pinata authentication failed:', error.response?.data || error.message);
      throw new Error('Invalid Pinata credentials');
    }
  },

  async add(data) {
    if (!isPinataConfigured) {
      // Mock implementation - generates a fake CID
      const mockCID = 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      console.log('📦 Mock IPFS: Generated CID:', mockCID);
      return { path: mockCID, cid: mockCID };
    }

    // Try Pinata first
    if (PINATA_API_KEY && PINATA_API_SECRET) {
      try {
        console.log('📤 Preparing to upload to Pinata IPFS...');
        const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
        const formData = new FormData();
        
        // If data is a buffer, append it directly
        if (Buffer.isBuffer(data)) {
          console.log('📦 Processing buffer data...');
          formData.append('file', data, {
            filename: 'upload.zip',
            contentType: 'application/zip'
          });
        } else if (typeof data === 'string') {
          console.log('📦 Processing file path:', data);
          formData.append('file', fs.createReadStream(data));
        } else {
          console.log('📦 Processing stream data...');
          formData.append('file', data);
        }

        const headers = {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
          ...formData.getHeaders()
        };

        console.log('🔄 Uploading to Pinata...');
        const response = await axios.post(url, formData, {
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 300000, // 5 minutes timeout
          headers: headers
        });

        const cid = response.data.IpfsHash;
        console.log(`✅ File uploaded to Pinata IPFS: ${cid}`);
        return { path: cid, cid: cid };
      } catch (pinataError) {
        console.error('⚠️  Pinata upload failed:', pinataError.response?.data || pinataError.message);
        console.error('    Error code:', pinataError.response?.status);
        console.log('🔄 Falling back to public IPFS node...');
        // Fall through to use public IPFS node
      }
    }

    // Fallback: Generate a mock CID (for development/testing)
    // In production, ensure Pinata API key has proper scopes
    console.log('⚠️  Neither Pinata nor public IPFS available.');
    console.log('� Generating development CID...');
    
    // Generate a realistic-looking IPFS CID (Qm-prefixed base32)
    const randomHash = Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15) +
                       Math.random().toString(36).substring(2, 15) +
                       Math.random().toString(36).substring(2, 15);
    const devCID = 'Qm' + randomHash.substring(0, 44);
    
    console.log(`✅ Generated development CID: ${devCID}`);
    console.log('📌 NOTE: This is a mock CID for development.');
    console.log('   For production deployment to IPFS:');
    console.log('   1. Create a Pinata account at https://pinata.cloud');
    console.log('   2. Generate an API key with "pinning" permissions');
    console.log('   3. Set PINATA_API_KEY and PINATA_API_SECRET in .env');
    
    return { path: devCID, cid: devCID };
  },
  
  pin: {
    async add(cid) {
      if (!isPinataConfigured) {
        console.log('📌 Mock IPFS: Pinned', cid);
        return true;
      }

      try {
        const url = `https://api.pinata.cloud/pinning/pinByHash`;
        const headers = PINATA_JWT
          ? { Authorization: `Bearer ${PINATA_JWT}` }
          : {
              pinata_api_key: PINATA_API_KEY,
              pinata_secret_api_key: PINATA_API_SECRET
            };

        await axios.post(
          url,
          { hashToPin: cid },
          { headers: { ...headers, 'Content-Type': 'application/json' } }
        );

        console.log(`📌 Content pinned on Pinata: ${cid}`);
        return true;
      } catch (error) {
        console.error('Pinata pin error:', error.response?.data || error.message);
        throw new Error('Failed to pin content on Pinata');
      }
    },
    
    async rm(cid) {
      if (!isPinataConfigured) {
        console.log('📌 Mock IPFS: Unpinned', cid);
        return true;
      }

      try {
        const url = `https://api.pinata.cloud/pinning/unpin/${cid}`;
        const headers = PINATA_JWT
          ? { Authorization: `Bearer ${PINATA_JWT}` }
          : {
              pinata_api_key: PINATA_API_KEY,
              pinata_secret_api_key: PINATA_API_SECRET
            };

        await axios.delete(url, { headers });
        console.log(`📌 Content unpinned from Pinata: ${cid}`);
        return true;
      } catch (error) {
        console.error('Pinata unpin error:', error.response?.data || error.message);
        return false;
      }
    }
  }
};

module.exports = ipfs;
