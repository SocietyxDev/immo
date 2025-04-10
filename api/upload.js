const { put } = require('@vercel/blob');

module.exports = async (req, res) => {
    try {
        // Verify admin status
        const user = JSON.parse(req.headers['x-user-data'] || '{}');
        const adminIds = process.env.ADMIN_IDS.split(',');
        
        if (!adminIds.includes(user.id)) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        // Process file upload (example using Vercel Blob)
        const formData = await req.formData();
        const file = formData.get('file');
        
        const { url } = await put(`videos/${Date.now()}-${file.name}`, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN
        });

        res.status(200).json({
            url,
            thumbnailUrl: url.replace(/\.\w+$/, '.jpg') // Example thumbnail URL
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
