const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

// 这里粘贴你智谱里名称为【菜谱】的完整sk密钥
const ZHIPU_API_KEY = "sk-5c107e2bbf3b4a70a9bbaf1db9c0aa37.IU6v0vwsKpFi8xyk";

// 生成菜谱文字接口
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
        const msg = err?.message || "接口请求异常";
        res.json({ success: false, msg: "AI生成失败：" + msg });
    }
});

// 新增文生图接口（前端调用这个，密钥藏后端，安全）
app.post("/api/getImage", async (req, res) => {
    const { prompt } = req.body;
    try {
        const imgResult = await axios.post(
            "https://open.bigmodel.cn/api/paas/v4/images/generations",
            {
                model: "cogview-3-flash",
                prompt: `高清美食摄影，一盘${prompt}，色泽诱人，家常白瓷盘，柔和自然光，8k超清，美食实拍`
            },
            { headers: { Authorization: `Bearer ${ZHIPU_API_KEY}` } }
        );
        res.json({
            success: true,
            imgUrl: imgResult.data.data[0].url
        });
    } catch (err)
        res.json({ success: false, msg: "菜品图生成失败" });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    console.log("服务启动成功");
});
