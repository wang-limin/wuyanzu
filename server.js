const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

// 填入你的智谱完整sk密钥
const ZHIPU_API_KEY = "sk-5c107e2bbf3b4a70a9bbaf1db9c0aa37.IU6v0vwsKpFi8xyk";

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
    } catch (err) {
        // 全部代码放进{}内部，修复语法报错
        const msg = err?.message || "接口请求异常，请检查API密钥";
        res.json({
            success: false,
            msg: "AI生成失败：" + msg
        });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    console.log("服务启动成功");
});
