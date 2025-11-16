const express = require('express');
const { Innertube } = require('youtubei.js');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/download', async (req, res) => {
    const url = req.body.url;

    try {
        const yt = await Innertube.create();
        const video = await yt.getVideo(url);

        // 適切なフォーマットを取得（mp4 / highest quality）
        const format = video.engagement.formats.find(f => f.container === 'mp4' && f.quality_label);

        if (!format) return res.status(400).send('ダウンロード可能な動画が見つかりません');

        const stream = await video.download(format.itag);

        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        stream.pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send('ダウンロード失敗');
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
