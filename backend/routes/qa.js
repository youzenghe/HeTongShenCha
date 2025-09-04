const express = require('express');
const router = express.Router();
const db = require('../database');
const axios = require('axios');


const DEEPSEEK_API_KEY = '';

router.get('/history', async (req, res) => {
    try {
        const history = await db('qa_history').orderBy('created_at', 'asc');
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve Q&A history.' });
    }
});

router.post('/ask', async (req, res) => {
    const { question, sessionId } = req.body;
    if (!question) {
        return res.status(400).json({ error: 'Question is required.' });
    }

    try {
        // 把用户的问题存到数据库，小心翼翼保存哦~ (≧◡≦) ♡
        await db('qa_history').insert({
            session_id: sessionId,
            role: 'user',
            content: question,
        });

        // 组装给 DeepSeek 的请求数据～(灬º‿º灬)♡
        const prompt = `你是一个专业的法律合同AI助手。请回答用户的问题。\n用户问题: ${question}`;

        // 调用 DEEPSEEK API 啦，记得看你们官方的文档确认参数哈~~
        const deepseekResponse = await axios.post('https://api.deepseek.ai/v1/chat/completions', {
            model: "deepseek-chat",  // 这里用你们实际的模型名字替换哦~
            messages: [
                { role: "system", content: "你是一个专业的法律合同AI助手。" },
                { role: "user", content: question }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        // 小心翼翼地拿到回答啦(*≧ω≦)
        const aiResponse = deepseekResponse.data.choices[0].message.content;

        // 保存 AI 的回答到数据库，不能忘了亲亲~(˘ ³˘)❤
        await db('qa_history').insert({
            session_id: sessionId,
            role: 'assistant',
            content: aiResponse,
        });

        res.json({ answer: aiResponse });

    } catch (error) {
        console.error("Error in /ask endpoint:", error.message);
        res.status(500).json({ error: 'Failed to process question.' });
    }
});

module.exports = router;
