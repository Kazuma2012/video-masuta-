const express = require('express');
const ytdl = require('@distube/ytdl-core');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/download', async (req, res) => {
    const url = req.body.url;

    if (!ytdl.validateURL(url)) return res.status(400).send('無効なURL');

    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });

        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        ytdl(url, { format }).pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send('ダウンロード失敗');
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
