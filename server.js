const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));
// 此处粘贴完整sk密钥，前后无任何空格
const ZHIPU_API_KEY = "sk-5c107e2bbf3b4a70a9bbaf1db9c0aa37.IU6v0vwsKpFi8xyk";

// 生成菜谱
app.post("/api/getRecipe", async (req, res) => {
    const { prompt } = req.body;
    try {
        const result = await axios.post(
            "https://open.bigmodel.cn/api/paas/v4/chat/completions",
            {
                model: "glm-4-flash",
                messages: [{ role: "user", content: prompt }]
            },
            { headers: { Authorization: `Bearer ${ZHIPU_API_KEY}` } }
        );
        res.json({
            success: true,
            data: result.data.choices[0].message.content
        });
    } catch (err)
        const msg = err?.message || "接口异常";
        res.json({ success: false, msg: "AI生成失败：" + msg });
    }
});

// 文生图接口
app.post("/api/getImage", async (req, res) => {
    const { prompt } = req.body;
    try {
        const imgResult = await axios.post(
            "https://open.bigmodel.cn/api/paas/v4/images/generations",
            {
                model: "cogview-3-flash",
                prompt: `高清美食摄影，一盘${prompt}，家常实拍，自然光8k`
            },
            { headers: { Authorization: `Bearer ${ZHIPU_API_KEY}` } }
        );
        res.json({
            success: true,
            imgUrl: imgResult.data.data[0].url
        });
    } catch (err)
        res.json({ success: false, msg: "图片生成失败" });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    console.log("服务启动成功");
});
