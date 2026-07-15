const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

// 托管静态页面，解决404
app.use(express.static(__dirname));

// 这里替换你自己的智谱API密钥
const ZHIPU_API_KEY = "sk-5c107e2bbf3b4a70a9bbaf1db9c0aa37.IU6v0vwsKpFi8xyk";

// AI生成菜谱接口
app.post("/api/getRecipe", async (req, res) => {
  const { prompt } = req.body;
  try {
    const resp = await axios.post(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        model: "glm-4-flash",
        messages: [{ role: "user", content: prompt }]
      },
      { headers: { Authorization: `Bearer ${ZHIPU_API_KEY}` } }
    );
    res.json({ success: true, data: resp.data.choices[0].message.content });
  } catch (err)
    res.json({ success: false, msg: "AI生成失败：" + err.message });
  }
});

// 访问根域名直接打开index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => console.log("服务启动成功"));
