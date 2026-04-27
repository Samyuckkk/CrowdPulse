const axios = require("axios")
const zoneModel = require("../models/zone.model")
const connectionModel = require("../models/connections.model")

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

async function getLLMAction(zoneCode, riskLevel, eventId){
    try{

        const zones = await zoneModel.find({eventId}).lean()

        const connections = await connectionModel.find({ eventId })
            .populate('from', 'code')
            .populate('to', 'code')
            .lean()

        const simplifiedZones = zones.map(z => ({
            code: z.code,
            type: z.type
        }));

        const simplifiedConnections = connections.map(c => ({
            from: c.from.code,
            to: c.to.code,
            distance: c.distance
        }));

        const prompt = `
        You are a crowd safety system.

        Zones: ${JSON.stringify(simplifiedZones)}

        Connections: ${JSON.stringify(simplifiedConnections)}
        
        Situation:
        - Risk Level : ${riskLevel}
        - Affected Zone : ${zoneCode}

        Give ONLY ONE short action (max 8 words).

        Examples:
        Open exit z3
        Close entry z1
        Redirect crowd to z5

        Only output the action. No explanation.
        `

        const response = await axios.post(OPENROUTER_URL,
            {
                model: "meta-llama/llama-3-8b-instruct",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 20,
                temperature: 0.3     // lower temp -> focused, consistent answer ; high temp -> creative, varied answer
            },
            {
                headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000", // optional but recommended
                "X-Title": "Crowd Management System"
                }
            }
        )

        let action = response.data.choices[0].message.content.trim();

        const validZones = zones.map((z) => z.code.toLowerCase());
        const words = action.toLowerCase().split(" ");

        const isValid = validZones.some((z) => words.includes(z));

        if (!isValid) {
        action = "Monitor situation";
        }

        return action;
    } catch(err) {
        console.error("OpenRouter Error: ", err.response?.data || err.message);
        return "Monitor Situation"
    }
}

module.exports = {
    getLLMAction
}