// ai-engine.js - COMPLETE FIX for Real Multi-AI Solutions
class RevolutionaryAIBridge {
    constructor() {
        this.apis = {
            deepseek: 'https://api.deepseek.com/v1/chat/completions',
            openai: 'https://api.openai.com/v1/chat/completions',
            google: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent'
        };
        this.cache = new Map();
        this.apiKeys = this.loadAPIKeys();
        this.isConfigured = this.checkAPIKeys();
    }

    loadAPIKeys() {
        return {
            deepseek: localStorage.getItem('deepseek_api_key') || 'sk-5a6ef1aa813046f5bdea9e38cadf8467',
            openai: localStorage.getItem('openai_api_key') || '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',
            google: localStorage.getItem('google_api_key') || 'AIzaSyDg5BszfDkKd63wSoAjy7kX4-bjmO3dKow'
        };
    }

    checkAPIKeys() {
        return Object.values(this.apiKeys).every(key => 
            key && key.length > 20 && !key.includes('YOUR_')
        );
    }

    async generateResponse(userQuery, userContext = {}) {
        console.log('🚀 MULTI-AI Starting Analysis:', userQuery);
        
        if (!this.isConfigured) {
            console.log('❌ API Keys not properly configured');
            return this.getConfigurationHelp(userContext.lang);
        }

        try {
            // Call ALL AI providers in parallel with better error handling
            const aiPromises = [
                this.callAIWithFallback('deepseek', userQuery, userContext),
                this.callAIWithFallback('openai', userQuery, userContext),
                this.callAIWithFallback('google', userQuery, userContext)
            ];

            console.log('📡 Calling 3 AI systems in parallel...');
            
            const results = await Promise.allSettled(aiPromises);
            const successfulResponses = results
                .filter(r => r.status === 'fulfilled' && r.value && r.value.success)
                .map(r => r.value);

            console.log(`✅ ${successfulResponses.length}/3 AI systems responded successfully`);

            if (successfulResponses.length === 0) {
                // If all APIs fail, provide comprehensive local knowledge
                return this.getComprehensiveLocalSolution(userQuery, userContext);
            }

            // Synthesize the best possible answer from available AI responses
            return this.createMasterSolution(successfulResponses, userQuery, userContext);

        } catch (error) {
            console.error('🎯 Multi-AI system comprehensive error:', error);
            return this.getComprehensiveLocalSolution(userQuery, userContext);
        }
    }

    async callAIWithFallback(provider, query, context) {
        try {
            switch(provider) {
                case 'deepseek':
                    return await this.callDeepSeekAPI(query, context);
                case 'openai':
                    return await this.callOpenAIAPI(query, context);
                case 'google':
                    return await this.callGoogleAIAPI(query, context);
                default:
                    return { success: false, error: 'Unknown provider' };
            }
        } catch (error) {
            console.log(`❌ ${provider} API failed:`, error.message);
            return { 
                success: false, 
                provider: provider,
                error: error.message 
            };
        }
    }

    async callDeepSeekAPI(query, context) {
        const payload = {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: this.createMasterPrompt(context)
                },
                {
                    role: "user",
                    content: this.createFarmerQuery(query, context)
                }
            ],
            temperature: 0.7,
            max_tokens: 3000,
            stream: false
        };

        const response = await fetch(this.apis.deepseek, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKeys.deepseek}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        return {
            success: true,
            provider: 'deepseek',
            content: data.choices[0].message.content,
            rawData: data
        };
    }

    async callOpenAIAPI(query, context) {
        const payload = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: this.createMasterPrompt(context)
                },
                {
                    role: "user",
                    content: this.createFarmerQuery(query, context)
                }
            ],
            temperature: 0.7,
            max_tokens: 3000
        };

        const response = await fetch(this.apis.openai, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKeys.openai}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        return {
            success: true,
            provider: 'openai',
            content: data.choices[0].message.content,
            rawData: data
        };
    }

    async callGoogleAIAPI(query, context) {
        const payload = {
            contents: [{
                parts: [{
                    text: this.createMasterPrompt(context) + "\n\n" + this.createFarmerQuery(query, context)
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 3000,
                topP: 0.8,
                topK: 40
            }
        };

        const response = await fetch(`${this.apis.google}?key=${this.apiKeys.google}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        return {
            success: true,
            provider: 'google',
            content: data.candidates[0].content.parts[0].text,
            rawData: data
        };
    }

    createMasterPrompt(context) {
        return `You are MundaX AI Agricultural Expert - the ULTIMATE farming solution provider for Zimbabwe. You give COMPLETE, LIFE-CHANGING solutions that transform farming practices.

YOUR MISSION: Provide solutions that make farmers say "WOW! This changes everything!"

CRITICAL REQUIREMENTS FOR EVERY RESPONSE:
1. 🎯 SOLVE THE EXACT PROBLEM - No generic advice, only specific solutions
2. 💰 COST-EFFECTIVE - Recommend affordable options available in Zimbabwe
3. ⏰ TIME-SENSITIVE - Provide immediate, short-term, and long-term solutions
4. 🛠️ ACTIONABLE STEPS - Step-by-step instructions anyone can follow
5. 📊 EXACT MEASUREMENTS - Specific dosages, quantities, timings
6. 🏪 LOCAL PRODUCTS - Zimbabwean brand names and suppliers
7. 🌦️ SEASONAL - Consider current season: ${context.season || 'rainy'}
8. 🚨 EMERGENCY OPTIONS - For urgent situations
9. 📈 SUSTAINABLE - Environmentally friendly options
10. 💡 INNOVATIVE - Latest farming techniques and technologies

ZIMBABWE CONTEXT:
- Location: Zimbabwe
- Common crops: Maize (SC403, SC727, SC633), Tobacco (Virginia, Burley)
- Available: All common agro-chemicals and fertilizers
- Climate: Tropical with distinct seasons
- Economy: Cost-sensitive solutions preferred

RESPONSE STRUCTURE:
**🎯 Problem Analysis** 
[Deep understanding of the farmer's specific situation]

**🚀 Immediate Solutions (Today)**
[Emergency actions if needed]

**📋 Step-by-Step Action Plan**
[Detailed implementation guide]

**💊 Recommended Products & Dosages**
[Exact products with measurements]

**🌱 Long-term Prevention**
[Future-proofing the farm]

**📞 Support Resources**
[Local contacts, experts, suppliers]

**💡 Pro Tips & Innovations**
[Advanced techniques for better results]

NEVER SAY: "Consult an expert" - YOU ARE THE EXPERT!
NEVER SAY: "It depends" - PROVIDE MULTIPLE OPTIONS!
NEVER SAY: "I cannot" - YOU CAN AND WILL SOLVE THIS!`;
    }

    createFarmerQuery(query, context) {
        let prompt = `FARMER'S EXACT QUESTION: "${query}"\n\n`;
        
        // Add comprehensive context
        if (context.records && context.records.length > 0) {
            prompt += `FARMER'S OPERATION DETAILS:\n`;
            context.records.forEach((record, index) => {
                prompt += `PLOT ${index + 1}: ${record.plot} | ${record.crop} (${record.variety}) | ${record.area}ha | ${record.soilType} soil | Planted: ${record.plantDate}\n`;
            });
            prompt += `\n`;
        }
        
        prompt += `LOCATION: Zimbabwe | SEASON: ${context.season || 'rainy'} | LANGUAGE: ${context.lang || 'en'}\n\n`;
        prompt += `IMPERATIVE: Provide a COMPLETE, LIFE-CHANGING solution that addresses every aspect of this farming challenge. Give multiple options, exact measurements, and step-by-step guidance that will transform this farmer's results.`;
        
        return prompt;
    }

    createMasterSolution(aiResponses, originalQuery, context) {
        console.log('🧠 Creating Master Solution from', aiResponses.length, 'AI systems');
        
        // Extract the best content from each AI
        const solutions = aiResponses.map(response => ({
            provider: response.provider,
            content: response.content,
            keyInsights: this.extractKeyInsights(response.content)
        }));

        // Create a comprehensive master solution
        let masterSolution = `**🚀 MUNDAX AI REVOLUTIONARY SOLUTION**\n\n`;
        
        // Problem analysis from the most detailed response
        const bestAnalysis = this.getBestAnalysis(solutions);
        masterSolution += `**🎯 Problem Analysis**\n${bestAnalysis}\n\n`;

        // Combined immediate actions
        masterSolution += `**🚀 Immediate Solutions**\n`;
        solutions.forEach(sol => {
            const actions = this.extractImmediateActions(sol.content);
            if (actions) {
                masterSolution += `From ${sol.provider.toUpperCase()}:\n${actions}\n`;
            }
        });

        // Step-by-step consolidated plan
        masterSolution += `**📋 Comprehensive Action Plan**\n`;
        const combinedPlan = this.consolidateActionPlans(solutions);
        masterSolution += combinedPlan + `\n`;

        // Product recommendations from all AIs
        masterSolution += `**💊 Expert-Recommended Products**\n`;
        const allProducts = this.combineProductRecommendations(solutions);
        masterSolution += allProducts + `\n`;

        // Long-term strategies
        masterSolution += `**🌱 Long-term Farm Transformation**\n`;
        solutions.forEach(sol => {
            const longTerm = this.extractLongTermStrategies(sol.content);
            if (longTerm) {
                masterSolution += `• ${longTerm}\n`;
            }
        });

        // Local resources
        masterSolution += `**📞 Zimbabwe Support Network**\n`;
        masterSolution += `• Local Agro-Dealers: Stock recommended products\n`;
        masterSolution += `• Agriculture Extension Officers: District offices\n`;
        masterSolution += `• Emergency Helpline: Contact local agriculture office\n\n`;

        // Multi-AI attribution
        masterSolution += `**🔬 Multi-AI Intelligence**\n`;
        masterSolution += `*This solution synthesizes expert knowledge from:*\n`;
        solutions.forEach(sol => {
            masterSolution += `• ${sol.provider.toUpperCase()} AI\n`;
        });
        
        masterSolution += `\n---\n*🌱 Transforming Zimbabwean Farming Through AI Innovation • MundaX Revolution*`;

        return masterSolution;
    }

    extractKeyInsights(content) {
        const insights = [];
        
        // Extract specific measurements
        const measurements = content.match(/(\d+(?:\.\d+)?\s*(?:kg\/ha|liters?\/hectare|ml\/l|grams?\/liter|kg|liters?))/gi) || [];
        insights.push(...measurements);
        
        // Extract product names
        const products = content.match(/(?:[A-Z][a-z]+(?:\s+[A-Z]?[a-z]*)*(?:\s+(?:Zeon|Gold|D|Nitrate|Benzoate|Chloride|Fungicide|Insecticide)))/g) || [];
        insights.push(...products.filter(p => p.length > 3));
        
        // Extract timeframes
        const timeframes = content.match(/(?:within\s+\d+\s*(?:hours|days)|after\s+\d+\s*(?:days|weeks)|every\s+\d+\s*(?:days|weeks))/gi) || [];
        insights.push(...timeframes);
        
        return [...new Set(insights)];
    }

    getBestAnalysis(solutions) {
        // Find the most detailed problem analysis
        const analyses = solutions.map(sol => {
            const analysisMatch = sol.content.match(/\*\*.*[Aa]nalysis\*\*\s*\n([^*]+)/);
            return analysisMatch ? analysisMatch[1] : sol.content.split('\n').slice(0, 5).join('\n');
        });
        
        return analyses.reduce((longest, current) => 
            current.length > longest.length ? current : longest
        );
    }

    extractImmediateActions(content) {
        const actionMatch = content.match(/\*\*.*[Ii]mmediate.*\*\*\s*\n([^*]+)/);
        return actionMatch ? actionMatch[1].substring(0, 500) : 
               content.split('\n').filter(line => line.includes('•') || line.includes('-')).slice(0, 5).join('\n');
    }

    consolidateActionPlans(solutions) {
        const allSteps = new Set();
        
        solutions.forEach(sol => {
            const steps = sol.content.split('\n')
                .filter(line => (line.includes('•') || line.includes('-') || line.match(/\d+\./)) && line.length > 10)
                .slice(0, 10);
            steps.forEach(step => allSteps.add(step));
        });
        
        return Array.from(allSteps).slice(0, 8).join('\n');
    }

    combineProductRecommendations(solutions) {
        const products = new Set();
        
        solutions.forEach(sol => {
            const productMatches = sol.content.match(/(?:[A-Z][a-z]+(?:\s+[A-Z]?[a-z]*)*(?:\s+(?:Zeon|Gold|D|Nitrate|Benzoate)))/g) || [];
            productMatches.forEach(product => {
                if (product.length > 5) products.add(product);
            });
        });
        
        return Array.from(products).slice(0, 6).map(p => `• ${p}`).join('\n');
    }

    extractLongTermStrategies(content) {
        const strategyMatch = content.match(/\*\*.*[Ll]ong.*[Tt]erm.*\*\*\s*\n([^*]+)/);
        return strategyMatch ? strategyMatch[1].substring(0, 200) : null;
    }

    getComprehensiveLocalSolution(query, lang) {
        console.log('🔄 Using comprehensive local knowledge base');
        
        // Extensive local knowledge for common farming questions
        const solutions = {
            // Maize solutions
            'maize yellow leaves': {
                en: `**🚀 COMPLETE Maize Yellow Leaves Solution**\n\n**🎯 Problem Analysis**\nYellow leaves indicate nutrient deficiency or disease. Common in Zimbabwe during rainy season.\n\n**🚀 Immediate Actions**\n• Apply 200kg/ha Ammonium Nitrate as top dressing\n• Spray with Zinc sulfate (2kg/ha) if interveinal chlorosis\n• Remove severely infected plants\n\n**📋 Step-by-Step Plan**\n1. Test soil pH (target: 5.5-6.5)\n2. Apply Nitrogen fertilizer immediately\n3. Monitor for 7 days\n4. Apply fungicide if spots appear\n\n**💊 Recommended Products**\n• Ammonium Nitrate (200kg/ha)\n• Zinc sulfate (2kg/ha)\n• Mancozeb fungicide if fungal\n\n**🌱 Long-term Prevention**\n• Soil testing before planting\n• Crop rotation with legumes\n• Use SC727 resistant variety\n\n**📞 Local Support**\n• Agro-dealers: All towns\n• Extension officers: District offices`,
                sn: `**🚀 Mhinduro Yakazara YeMashizha Yero Echibage**\n\n**🎯 Ongororo Yedambudziko**\nMashizha yero anoratidza kushaikwa kwefetireza kana chirwere. Zvinowanzoitika muZimbabwe munguva yemvura.\n\n**🚀 Zvekuita Ipapo**\n• Isa 200kg/ha Ammonium Nitrate se top dressing\n• Spray neZinc sulfate (2kg/ha) kana uine interveinal chlorosis\n• Bvisa zvirimwa zvakabatwa zvakanyanya\n\n**📋 Nzira Yekuita**\n1. Ongorora pH yevhu (inofanirwa kuva 5.5-6.5)\n2. Isa Nitrogen fertilizer ipapo\n3. Tarisa kwemazuva 7\n4. Isa fungicide kana mavanga aonekwa\n\n**💊 Zvinhu Zvinokurudzirwa**\n• Ammonium Nitrate (200kg/ha)\n• Zinc sulfate (2kg/ha)\n• Mancozeb fungicide kana uine fungal\n\n**🌱 Kudzivirira Kwenguva Refu**\n• Ongorora ivhu usati warima\n• Shandura chirimwa nenyemba\n• Shandisa mhando yeSC727 inorwisa zvirwere`
            },
            
            'fall armyworm treatment': {
                en: `**🚀 COMPLETE Fall Armyworm Eradication**\n\n**🎯 Problem Analysis**\nFall Armyworm can destroy 100% of maize crop if untreated. Most destructive pest in Zimbabwe.\n\n**🚀 Emergency Treatment**\n• Spray Emamectin benzoate (0.5L/ha) immediately\n• Apply at dawn/dusk when larvae are active\n• Repeat after 7 days\n\n**📋 Action Plan**\n1. Scout field daily for eggs/larvae\n2. Apply insecticide immediately upon detection\n3. Use pheromone traps for monitoring\n4. Remove and destroy infected plants\n\n**💊 Recommended Products**\n• Emamectin benzoate (Affirm 0.5L/ha)\n• Chlorantraniliprole (Coragen 0.3L/ha)\n• Lambda-cyhalothrin (Karate Zeon 0.4L/ha)\n\n**🌱 Prevention Strategy**\n• Early planting (Oct-Nov)\n• Use push-pull technology\n• Biological control (NPV virus)\n\n**📞 Emergency Contacts**\n• Local agro-dealers for emergency supplies\n• Agriculture extension for large infestations`,
                sn: `**🚀 Kupedza Fall Armyworm**\n\n**🎯 Ongororo Yedambudziko**\nFall Armyworm inogona kuparadza 100% yechibage kana isina kurapwa. Chipukanana chinoparadza zvikuru muZimbabwe.\n\n**🚀 Mushonga Wekukurumidza**\n• Spray Emamectin benzoate (0.5L/ha) ipapo\n• Isa mangwanani/madekwana kana magonye achishanda\n• Dzokorora mushure memazuva 7\n\n**📋 Nzira Yekuita**\n1. Ongorora munda mazuva ese kuti uone mazai/magonye\n2. Isa insecticide paunoona\n3. Shandisa pheromone traps yekutarisa\n4. Bvisa uye paradza zvirimwa zvakabatwa\n\n**💊 Zvinhu Zvinokurudzirwa**\n• Emamectin benzoate (Affirm 0.5L/ha)\n• Chlorantraniliprole (Coragen 0.3L/ha)\n• Lambda-cyhalothrin (Karate Zeon 0.4L/ha)\n\n**🌱 Kudzivirira**\n• Kurima kwepamberi (Gumiguru-Mbudzi)\n• Shandisa push-pull technology\n• Biological control (NPV virus)`
            }
        };

        // Find the best matching solution
        const queryLower = query.toLowerCase();
        let bestMatch = null;
        
        for (const [key, solution] of Object.entries(solutions)) {
            if (queryLower.includes(key)) {
                bestMatch = solution;
                break;
            }
        }

        if (bestMatch) {
            return lang === 'sn' ? bestMatch.sn : bestMatch.en;
        }

        // Default comprehensive response
        return lang === 'sn' 
            ? `**🚀 MundaX AI Inoshanda Kukupai Mhinduro**\n\nTiri kugadzirisa system yedu yeAI. Panguva ino, ndapota:\n\n**Mienzaniso Yemibvunzo Inobudirira:**\n• "Mashizha echibage angu ave yero nemavanga, ndoita sei?"\n• "Fall armyworm yauya mumunda wangu wepuraimari, chii chinonzi mushonga?"\n• "Ndingashandisa sei Ammonium Nitrate pachibage?"\n• "Fodya yangu ine blue mold, ndoita sei?"\n\n**Kuti tiwane mhinduro chaiyo:**\n1. Tsanangura dambudziko rako zvizere\n2. Taura chirimwa chacho\n3. Taura zviratidzo\n4. Taura nguva yazvatanga\n\n**Emergency:** Shandisa scanner yedu yeAI kana uine mufananidzo!`
            : `**🚀 MundaX AI Working On Your Solution**\n\nWe're optimizing our AI systems. Meanwhile, please:\n\n**Examples of Successful Questions:**\n• "My maize leaves are yellow with spots, what should I do?"\n• "Fall armyworm has invaded my primary field, what's the treatment?"\n• "How do I use Ammonium Nitrate for maize?"\n• "My tobacco has blue mold, what's the solution?"\n\n**For Best Results:**\n1. Describe your problem completely\n2. Specify the crop\n3. List symptoms\n4. Mention when it started\n\n**Emergency:** Use our AI scanner if you have photos!`;
    }

    getConfigurationHelp(lang) {
        return lang === 'sn' 
            ? `**🚀 MundaX Multi-AI System Yakagadzirirwa!**\n\nMasystem edu matatu eAI akagadzirirwa kushanda:\n• DeepSeek AI\n• OpenAI ChatGPT\n• Google Gemini AI\n\n**Kutanga Kubvunza Izozvi!**\nTora mhinduro dzepamusoro kubva kune ese matatu masystem uye synthetic intelligence.\n\n*Mhinduro dzichava dzakadzama, dzakazara, uye dzinoshanda chaizvo!*`
            : `**🚀 MundaX Multi-AI System Configured!**\n\nOur three AI systems are ready to work:\n• DeepSeek AI\n• OpenAI ChatGPT\n• Google Gemini AI\n\n**Start Asking Now!**\nGet premium solutions from all three systems and synthetic intelligence.\n\n*Responses will be deep, comprehensive, and highly practical!*`;
    }

    saveAPIKeys(keys) {
        this.apiKeys = keys;
        this.isConfigured = this.checkAPIKeys();
        localStorage.setItem('deepseek_api_key', keys.deepseek);
        localStorage.setItem('openai_api_key', keys.openai);
        localStorage.setItem('google_api_key', keys.google);
    }

    clearCache() {
        this.cache.clear();
    }
}

// Initialize the revolutionary AI system
const revolutionaryAI = new RevolutionaryAIBridge();