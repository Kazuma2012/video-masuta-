const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/download', async (req, res) => {
    const url = req.body.url;
    if (!url || !url.startsWith('http')) {
        return res.status(400).send('無効なURL');
    }

    try {
        const tempFile = path.join(__dirname, 'temp_video.mp4');
        await fs.remove(tempFile); // 古いファイル削除

        // yt-dlp コマンドで動画をダウンロード
        const cmd = `yt-dlp -f best -o "${tempFile}" "${url}"`;
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error('yt-dlp error:', stderr);
                return res.status(500).send('ダウンロード中にエラー');
            }
            res.download(tempFile, 'video.mp4', async () => {
                await fs.remove(tempFile);
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('処理中にエラー');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
