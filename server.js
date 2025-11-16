const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public')); // HTML置き場

app.post('/download', async (req, res) => {
    const url = req.body.url;
    if (!ytdl.validateURL(url)) {
        return res.status(400).send('無効なURL');
    }

    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(url, { format: 'mp4' }).pipe(res);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
