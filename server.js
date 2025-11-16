<!-- server.js -->
<script type="text/plain">
const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // HTMLを読む

app.post('/download', async (req, res) => {
    const url = req.body.url;
    if (!ytdl.validateURL(url)) {
        return res.status(400).send('無効なURL');
    }

    try {
        const tempFile = path.join(__dirname, 'temp_video.mp4');
        await fs.remove(tempFile); // 古いファイル削除（安全のため）

        const videoStream = ytdl(url, { quality: 'highestvideo' });
        const writeStream = fs.createWriteStream(tempFile);

        videoStream.pipe(writeStream);

        writeStream.on('finish', () => {
            res.download(tempFile, 'video.mp4', async () => {
                await fs.remove(tempFile);
            });
        });

        writeStream.on('error', (err) => {
            console.error(err);
            res.status(500).send('保存中にエラー');
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('処理中にエラー');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
</script>
