const express = require('express');
const session = require('express-session');
const zlib = require('zlib');
const app = express();
const port = 3000;

// Set up session middleware
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(express.json());

app.post('/upload', (req, res) => {
    let gunzip = zlib.createGunzip();
    let chunks = [];

    req.pipe(gunzip)
        .on('data', (chunk) => chunks.push(chunk))
        .on('end', () => {
            const buffer = Buffer.concat(chunks);
            // Store the decompressed data in the session
            req.session.decompressedData = buffer.toString();

            // Send the decompressed data as a response
            res.send(req.session.decompressedData);

            // Clear the session data after sending the response
            req.session.destroy(err => {
                if (err) {
                    console.error('Failed to destroy session:', err);
                }
            });
        })
        .on('error', (err) => {
            res.status(500).send('Error decompressing file');
        });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 
