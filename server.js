const express = require('express');
const zlib = require('zlib');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/upload', (req, res) => {
    let gunzip = zlib.createGunzip();
    let chunks = [];

    req.pipe(gunzip)
        .on('data', (chunk) => chunks.push(chunk))
        .on('end', () => {
            const buffer = Buffer.concat(chunks);
            res.send(buffer.toString());
        })
        .on('error', (err) => {
            res.status(500).send('Error decompressing file');
        });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 