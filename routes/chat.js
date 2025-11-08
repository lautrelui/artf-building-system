const express = require('express');
const router = express.Router();
const axios = require('axios');

// System prompt for DeepSeek
const SYSTEM_PROMPT = `You are a technical assistant for the ARTF (Autorité de Régulation des Transferts de Fonds du Congo) building project. 
You have access to the complete technical documentation about:

1. NOC (Network Operations Center) and Data Center setup on the 3rd floor
2. CTI (Centre de Traitement et d'Intégration) repatriation
3. Smart Building management system
4. Connectivity architecture (Internet, Government network, Backbone)
5. Energy and continuity systems
6. Equipment specifications and planning

Always respond in French. Be precise and technical in your answers. If you don't know something, say so rather than making up information.

Key technical specifications:
- NOC and Data Center on 3rd floor, Tier III equivalent
- CTI becoming hot standby site with TLS 1.3 VPN connections
- Smart Building with GTB/BMS systems
- Dual fiber backbone (East/West) with Roof POP
- Redundant power (G1/G2 generators + solar)
- Equipment planning with specific protocols (SNMP, MODBUS, BACnet, etc.)`;

async function getDeepSeekResponse(question) {
    try {
        const response = await axios.post(
            process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT
                    },
                    {
                        role: "user",
                        content: question
                    }
                ],
                max_tokens: 1000,
                temperature: 0.3
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('DeepSeek API Error:', error.response?.data || error.message);
        
        // Fallback responses if API fails
        const fallbackResponses = {
            "noc": "Le NOC (Network Operations Center) sera situé au 3ème étage avec un mur d'écrans et des postes opérateurs 24/7, conforme aux standards Tier III.",
            "datacenter": "Le Data Center respecte les standards Tier III avec redondance N+1, climatisation ASHRAE TC9.9, et détection incendie VESDA.",
            "cti": "Le CTI actuel à Brazza Mall deviendra un site secondaire actif (Hot Standby) avec synchronisation bidirectionnelle des données FinTraX.",
            "smart building": "Le système de gestion intelligente supervise énergie, climatisation, sécurité et infrastructure IT via le Centre de Contrôle Centralisé.",
            "énergie": "L'alimentation est redondante avec deux groupes électrogènes (G1 250kVA, G2 60-80kVA), UPS modulaires, et panneaux solaires sur le Roof POP.",
            "réseau": "Connectivité redondante avec deux FAI indépendants, réseau gouvernemental privé, et backbone fibre optique Est/Ouest.",
            "équipement": "Les équipements doivent supporter les protocoles SNMP, MODBUS, BACnet, ou MQTT pour l'intégration avec le système FBB.",
            "default": "Je peux vous aider avec des informations techniques sur le bâtiment ARTF, incluant le NOC, Data Center, CTI, Smart Building, et l'infrastructure réseau."
        };

        const lowerQuestion = question.toLowerCase();
        for (const [key, value] of Object.entries(fallbackResponses)) {
            if (lowerQuestion.includes(key)) {
                return value + " (Réponse de secours - API temporairement indisponible)";
            }
        }
        
        return fallbackResponses.default + " (Réponse de secours - API temporairement indisponible)";
    }
}

router.post('/ask', async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        if (!process.env.DEEPSEEK_API_KEY) {
            return res.status(500).json({ 
                error: 'DeepSeek API key not configured',
                answer: "Le service d'assistant IA n'est pas configuré. Veuillez contacter l'administrateur système."
            });
        }

        const response = await getDeepSeekResponse(question);
        
        // Save to database (optional)
        // await saveChatMessage(question, response);

        res.json({
            question,
            answer: response,
            timestamp: new Date().toISOString(),
            source: 'deepseek'
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            answer: "Désolé, une erreur s'est produite. Veuillez réessayer."
        });
    }
});

// Optional: Save chat history to database
async function saveChatMessage(question, answer) {
    // Implementation for saving to MySQL would go here
    // using the chat_messages table we created
}

module.exports = router;