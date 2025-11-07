// app.js - Revolutionary AI Main Application
const STORAGE_KEY = 'mundax_revolutionary_v1';
const MARKET_KEY = 'mundax_market_live';

// Global variables
let mediaStream = null;
let currentScanMode = 'disease';

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Revolutionary AI App Loading...');
    initApp();
});

async function initApp() {
    console.log('Starting revolutionary app initialization...');
    
    try {
        // Basic setup
        setupNav();
        setupButtons();
        loadMarketData();
        loadRecords();
        updateOnlineStatus();
        setupAPIConfiguration();
        
        // Language setup
        const langSelect = document.getElementById('langSelectTop');
        const langSelectSettings = document.getElementById('langSelect');
        const storedLang = localStorage.getItem('mundax_lang') || 'en';
        
        if (langSelect) langSelect.value = storedLang;
        if (langSelectSettings) langSelectSettings.value = storedLang;
        applyLanguage(storedLang);
        
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                localStorage.setItem('mundax_lang', e.target.value);
                applyLanguage(e.target.value);
            });
        }
        
        if (langSelectSettings) {
            langSelectSettings.addEventListener('change', (e) => {
                localStorage.setItem('mundax_lang', e.target.value);
                applyLanguage(e.target.value);
            });
        }

        // Initialize AI status
        updateAIStatus();
        
        // Load initial data
        generateSampleTasks();
        updateHealthMetrics();
        
        console.log('🚀 Revolutionary AI App Ready!');

    } catch (error) {
        console.error('App initialization failed:', error);
    }
}

// Navigation
function setupNav() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all buttons
            navButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Switch page
            const pageId = this.dataset.page;
            switchPage(pageId);
        });
    });
}

function switchPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Button Setup
function setupButtons() {
    // Home page buttons
    const openAssistantBtn = document.getElementById('openAssistantBtn');
    const openScannerBtn = document.getElementById('openScannerBtn');
    
    if (openAssistantBtn) {
        openAssistantBtn.addEventListener('click', () => {
            switchToPage('assistantPage');
        });
    }
    
    if (openScannerBtn) {
        openScannerBtn.addEventListener('click', () => {
            switchToPage('scannerPage');
        });
    }

    // Scanner mode buttons
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            modeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentScanMode = this.dataset.mode;
        });
    });

    // Scanner controls
    const startCamBtn = document.getElementById('startCam');
    const fileInput = document.getElementById('fileInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    if (startCamBtn) {
        startCamBtn.addEventListener('click', startCamera);
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFile);
    }
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeImage);
    }

    // Assistant chat
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = document.getElementById('chatInput');
            const text = input.value.trim();
            if (text) {
                addChatMessage(text, 'user');
                input.value = '';
                setTimeout(() => assistantRespond(text), 100);
            }
        });
    }

    // Records management
    const openAddRecord = document.getElementById('openAddRecord');
    const closeRecord = document.getElementById('closeRecord');
    const recordForm = document.getElementById('recordForm');
    const clearRecords = document.getElementById('clearRecords');
    const exportBtn = document.getElementById('exportBtn');
    const clearCache = document.getElementById('clearCache');
    
    if (openAddRecord) openAddRecord.addEventListener('click', () => showModal('recordModal'));
    if (closeRecord) closeRecord.addEventListener('click', () => hideModal('recordModal'));
    if (recordForm) recordForm.addEventListener('submit', saveRecord);
    if (clearRecords) clearRecords.addEventListener('click', clearRecordsHandler);
    if (exportBtn) exportBtn.addEventListener('click', exportData);
    if (clearCache) clearCache.addEventListener('click', clearAICache);

    // API Configuration
    const configureAPI = document.getElementById('configureAPI');
    const apiConfigForm = document.getElementById('apiConfigForm');
    
    if (configureAPI) configureAPI.addEventListener('click', () => showModal('apiConfigModal'));
    if (apiConfigForm) apiConfigForm.addEventListener('submit', saveAPIConfig);

    // Set current date as default for planting date
    const plantDateInput = document.getElementById('plantDate');
    if (plantDateInput) {
        plantDateInput.value = new Date().toISOString().split('T')[0];
    }
}

function switchToPage(pageName) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageName) {
            btn.classList.add('active');
        }
    });
    switchPage(pageName);
}

// Language System
function applyLanguage(lang) {
    const translations = {
        en: {
            // Home page
            'greeting': 'Good day Farmer 🌞',
            'heroText': 'Welcome to MundaX Pro — Revolutionary AI farm assistant with multi-AI intelligence.',
            'nextTaskTitle': 'AI Recommended Tasks',
            'estYieldTitle': 'AI Yield Prediction',
            'marketTitle': 'Live Market Data',
            'tipsTitle': 'Quick Tips',
            'scannerTitle': 'Revolutionary AI Scanner',
            'addRecordTitle': 'Add Smart Farm Plot',
            'settingsTitle': 'Revolutionary AI Settings',
            'langLabel': 'Language',
            'backupLabel': 'Backup',
            'assistantName': 'Revolutionary AI Assistant',
            'assistantSub': 'Powered by DeepSeek, OpenAI & Google AI • Real-time Data',
            'weatherTitle': 'Live Weather',
            'marketSource': 'Source: Live API',
            
            // Buttons and labels
            'openAssistantBtn': 'Ask Revolutionary AI',
            'openScannerBtn': 'AI Crop Scan 📷',
            'startCam': '📷 Start Camera',
            'analyzeBtn': '🔍 AI Analyze',
            'exportBtn': '📊 Export Data',
            'configureAPI': 'Configure AI Keys'
        },
        sn: {
            // Home page
            'greeting': 'Mhoroi Murimi 🌞',
            'heroText': 'Kugamuchirwa kuMundaX Pro — Revolutionary AI inobatsira varimi ine multi-AI intelligence.',
            'nextTaskTitle': 'AI Yakakurudzira Mabasa',
            'estYieldTitle': 'AI Kufanotaura Goho',
            'marketTitle': 'Live Market Data',
            'tipsTitle': 'Mazano',
            'scannerTitle': 'Revolutionary AI Scanner',
            'addRecordTitle': 'Wedzera Munda weSmart',
            'settingsTitle': 'Revolutionary AI Settings',
            'langLabel': 'Mutauro',
            'backupLabel': 'Backup',
            'assistantName': 'Revolutionary AI Mubatsiri',
            'assistantSub': 'Inoshandisa DeepSeek, OpenAI & Google AI • Real-time Data',
            'weatherTitle': 'Live Weather',
            'marketSource': 'Source: Live API',
            
            // Buttons and labels
            'openAssistantBtn': 'Bvunza Revolutionary AI',
            'openScannerBtn': 'AI Scan Zvirimwa 📷',
            'startCam': '📷 Vhura Kamera',
            'analyzeBtn': '🔍 AI Ongorora',
            'exportBtn': '📊 Export Data',
            'configureAPI': 'Configure AI Keys'
        }
    };

    const t = translations[lang] || translations.en;
    
    // Update all elements
    Object.keys(t).forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = t[elementId];
        }
    });

    // Update chat starter messages
    const chatMessages = document.querySelectorAll('#chatWindow .chat-message[data-lang]');
    chatMessages.forEach(el => {
        el.style.display = (el.dataset.lang === lang) ? 'block' : 'none';
    });

    // Update placeholder texts
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.placeholder = lang === 'sn' 
            ? 'Bvunza chero chinhu nezvekurima muZimbabwe...'
            : 'Ask anything about farming in Zimbabwe...';
    }

    // Update dynamic content
    updateDynamicContent(lang);
}

function updateDynamicContent(lang) {
    // Update sample tasks
    const tasksContainer = document.getElementById('aiTasks');
    if (tasksContainer) {
        const tasks = lang === 'sn' 
            ? ['Ongorora Fall Armyworm', 'Isa Compound D', 'Tarisa mwando wevhu', 'Ongorora zvirwere']
            : ['Check for Fall Armyworm', 'Apply Compound D', 'Monitor soil moisture', 'Inspect for diseases'];
        
        tasksContainer.innerHTML = tasks.map(task => 
            `<div class="task-item">• ${task}</div>`
        ).join('');
    }

    // Update tips
    const tipsList = document.getElementById('tipsList');
    if (tipsList) {
        const tips = lang === 'sn'
            ? [
                'Shandisa AI scanner yekuona zvirwere',
                'Rima nemhando dzeSC dzakasimba',
                'Cherechedza mamiriro ekunze',
                'Shandisa fetereza yakakodzera'
            ]
            : [
                'Use AI scanner for disease detection',
                'Plant with resistant SC varieties',
                'Monitor weather conditions',
                'Use appropriate fertilizer rates'
            ];
        
        tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
    }
}

// AI Assistant
function addChatMessage(text, who = 'system') {
    const win = document.getElementById('chatWindow');
    if (!win) return null;
    
    const div = document.createElement('div');
    div.className = `chat-message ${who}`;
    div.textContent = text;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
    
    return div;
}

async function assistantRespond(raw) {
    const lang = localStorage.getItem('mundax_lang') || 'en';
    
    // Show typing indicator
    const thinkingMsg = addChatMessage(lang === 'sn' ? '🚀 AI iri kuongorora nemasystem matatu...' : '🚀 AI is analyzing with three systems...', 'system');
    
    try {
        // Prepare detailed user context
        const userContext = {
            lang: lang,
            records: getRecordsSync(),
            season: getCurrentSeason(),
            location: 'Zimbabwe',
            timestamp: new Date().toISOString()
        };

        console.log('🎯 Farmer Question:', raw);
        
        // Use the REAL multi-AI system (not fallbacks)
        const response = await Promise.race([
            revolutionaryAI.generateResponse(raw, userContext),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('AI timeout')), 45000) // 45 second timeout
            )
        ]);
        
        // Remove typing indicator
        thinkingMsg.remove();
        
        console.log('✅ Multi-AI Response synthesized');
        
        // Add the AI response
        addChatMessage(response, 'system');

    } catch (error) {
        console.error('❌ Multi-AI system error:', error);
        
        // Remove typing indicator
        thinkingMsg.remove();
        
        // Show specific error message
        let errorMsg;
        if (error.message.includes('timeout')) {
            errorMsg = lang === 'sn' 
                ? '🚀 AI inotora nguva refu. Tiri kushandisa masystem matatu kuti tipe mhinduro yakanaka. Edza zvakare!'
                : '🚀 AI is taking longer. We\'re using three systems to provide the best answer. Try again!';
        } else {
            errorMsg = lang === 'sn'
                ? '🚀 Multi-AI system yatadza. Tiri kugadzirisa. Edza mubvunzo wakasiyana kana scanner.'
                : '🚀 Multi-AI system failed. We\'re fixing it. Try a different question or use the scanner.';
        }
        
        addChatMessage(errorMsg, 'system');
        
        // Provide immediate help for urgent issues
        if (raw.toLowerCase().includes('emergency') || raw.toLowerCase().includes('urgent')) {
            const emergencyHelp = lang === 'sn'
                ? `**🚨 Emergency Help**\n\nKana uine dambudziko rinokurumidza:\n• Tora mifananidzo yezvirimwa\n• Enda kune local agro-dealer\n• Bata Agriculture Extension Officer\n• Emergency products: Karate Zeon, Daconil, Bravo`
                : `**🚨 Emergency Help**\n\nIf you have an urgent problem:\n• Take photos of affected plants\n• Visit local agro-dealer\n• Contact Agriculture Extension Officer\n• Emergency products: Karate Zeon, Daconil, Bravo`;
            
            addChatMessage(emergencyHelp, 'system');
        }
    }
}

// Helper function for immediate assistance
function getImmediateHelp(query, lang) {
    const queryLower = query.toLowerCase();
    
    // Quick responses for common urgent issues
    if (queryLower.includes('emergency') || queryLower.includes('urgent') || queryLower.includes('dying')) {
        return lang === 'sn'
            ? `**🚨 Emergency Assistance**\n\nKana uine dambudziko rinokurumidza:\n• Tora mifananidzo yezvirimwa\n• Enda kune local agro-dealer\n• Bata Agriculture Extension Officer\n• Emergency products: Karate Zeon, Daconil, Bravo`
            : `**🚨 Emergency Assistance**\n\nIf you have an urgent problem:\n• Take photos of affected plants\n• Visit local agro-dealer\n• Contact Agriculture Extension Officer\n• Emergency products: Karate Zeon, Daconil, Bravo`;
    }
    
    // Specific help for common questions
    if (queryLower.includes('maize') || queryLower.includes('chibage')) {
        if (queryLower.includes('yellow') || queryLower.includes('yero')) {
            return lang === 'sn'
                ? `**🌽 Chibage Chine Mashizha Yero**\n\n**Zvinogona Kukonzera:**\n1. Kushaikwa kweNitrogen\n2. Maize Streak Virus\n3. Northern Leaf Blight\n\n**Zvekuita:**\n• Ongorora kuti mashizha yero ari kutanga papi\n• Tora mufananidzo wechirimwa\n• Isa nitrogen fertilizer (Ammonium Nitrate)\n• Bvunza varapi veminda kana zvichiramba`
                : `**🌽 Maize with Yellow Leaves**\n\n**Possible Causes:**\n1. Nitrogen deficiency\n2. Maize Streak Virus\n3. Northern Leaf Blight\n\n**Immediate Actions:**\n• Check where yellowing starts (old or new leaves)\n• Take photos of affected plants\n• Apply nitrogen fertilizer (Ammonium Nitrate)\n• Consult extension officers if persists`;
        }
    }
    
    if (queryLower.includes('tobacco') || queryLower.includes('fodya')) {
        if (queryLower.includes('worm') || queryLower.includes('gonye')) {
            return lang === 'sn'
                ? `**🍃 Fodya Ine Zvipukanana**\n\n**Zvipukanana Zvinowanzoitika:**\n1. Fall Armyworm\n2. Aphids\n3. Cutworms\n\n**Emergency Treatment:**\n• Shandisa Emamectin benzoate (Affirm)\n• Dosage: 0.5-1 liter/hectare\n• Nguva: Mangwanani kana madekwana\n• Repeat after 7 days if needed`
                : `**🍃 Tobacco with Pests**\n\n**Common Pests:**\n1. Fall Armyworm\n2. Aphids\n3. Cutworms\n\n**Emergency Treatment:**\n• Use Emamectin benzoate (Affirm)\n• Dosage: 0.5-1 liter/hectare\n• Timing: Early morning or evening\n• Repeat after 7 days if needed`;
        }
    }
    
    return null;
}

// Scanner Functions
async function startCamera() {
    const video = document.getElementById('video');
    
    try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            video.srcObject = mediaStream;
            video.classList.add('active');
            document.getElementById('analyzeBtn').disabled = false;
        } else {
            alert('Camera not available on this device.');
        }
    } catch (error) {
        console.error('Camera error:', error);
        alert('Cannot access camera. Please check permissions.');
    }
}

function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const img = document.getElementById('imgPreview');
    img.src = URL.createObjectURL(file);
    img.classList.add('active');
    document.getElementById('video').classList.remove('active');
    document.getElementById('analyzeBtn').disabled = false;
}

function analyzeImage() {
    const resultDiv = document.getElementById('scanResult');
    const lang = localStorage.getItem('mundax_lang') || 'en';
    
    resultDiv.innerHTML = lang === 'sn' 
        ? '<div class="analyzing">🚀 AI iri kuongorora mufananidzo wechirimwa...</div>'
        : '<div class="analyzing">🚀 AI is analyzing crop image...</div>';

    setTimeout(() => {
        // Mock AI analysis
        const analyses = {
            disease: {
                en: "**🚀 AI Disease Analysis Complete**\n\n**Detected:** Early Northern Leaf Blight\n**Confidence:** 87%\n**Source:** Multi-AI Analysis\n\n**Immediate Action:**\n• Apply chlorothalonil fungicide\n• Remove severely infected leaves\n• Improve air circulation\n\n**Prevention:** Plant SC727 resistant variety\n\n---\n*Powered by Revolutionary AI System*",
                sn: "**🚀 AI Ongororo Yezvirwere Yapera**\n\n**Zvaonekwa:** Northern Leaf Blight yekutanga\n**Chivimbo:** 87%\n**Source:** Multi-AI Analysis\n\n**Zvekuita Ipapo:**\n• Shandisa chlorothalonil fungicide\n• Bvisa mashizha akabatwa zvakanyanya\n• Vandudza mhepo kufamba\n\n**Kudzivirira:** Rima mhando yeSC727 inorwisa zvirwere\n\n---\n*Inoshandisa Revolutionary AI System*"
            },
            nutrient: {
                en: "**🚀 AI Nutrient Analysis Complete**\n\n**Detected:** Nitrogen Deficiency\n**Confidence:** 92%\n**Source:** Multi-AI Analysis\n\n**Treatment:**\n• Apply 200kg/ha ammonium nitrate\n• Top dress 4-6 weeks after planting\n• Ensure proper soil moisture\n\n**Monitoring:** Check new growth in 1-2 weeks\n\n---\n*Powered by Revolutionary AI System*",
                sn: "**🚀 AI Ongororo Yefetereza Yapera**\n\n**Zvaonekwa:** Kushaikwa kweNitrogen\n**Chivimbo:** 92%\n**Source:** Multi-AI Analysis\n\n**Mushonga:**\n• Isa 200kg/ha ammonium nitrate\n• Top dress masvondo 4-6 mushure mekurima\n• Ita shuwa kuti ivhu rine unyoro\n\n**Kutarisa:** Tarisa kukura kutsva mumavhiki 1-2\n\n---\n*Inoshandisa Revolutionary AI System*"
            },
            pest: {
                en: "**🚀 AI Pest Analysis Complete**\n\n**Detected:** Fall Armyworm Infestation\n**Confidence:** 95%\n**Source:** Multi-AI Analysis\n\n**Emergency Treatment:**\n• Apply emamectin benzoate immediately\n• Handpick larvae early morning\n• Monitor field every 2-3 days\n\n**Alert:** High risk in current season\n\n---\n*Powered by Revolutionary AI System*",
                sn: "**🚀 AI Ongororo Yezvipukanana Yapera**\n\n**Zvaonekwa:** Fall Armyworm yakawanda\n**Chivimbo:** 95%\n**Source:** Multi-AI Analysis\n\n**Emergency Mushonga:**\n• Shandisa emamectin benzoate pakarepo\n• Tora magonye mangwanani-ngwanani\n• Tarisa munda mazuva ese 2-3\n\n**Alert:** Ngozi yakakura mumwaka uno\n\n---\n*Inoshandisa Revolutionary AI System*"
            }
        };

        const analysis = analyses[currentScanMode] || analyses.disease;
        resultDiv.innerHTML = `<div class="success">${analysis[lang] || analysis.en}</div>`;
        
    }, 2000);
}

// Records Management
function getRecordsSync() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        return [];
    }
}

async function saveRecord(e) {
    e.preventDefault();
    
    const rec = {
        plot: document.getElementById('plotName').value || 'Plot',
        crop: document.getElementById('cropSelect').value,
        variety: document.getElementById('varietySelect').value,
        plantDate: document.getElementById('plantDate').value,
        area: Number(document.getElementById('areaInput').value || 0),
        soilType: document.getElementById('soilType').value,
        createdAt: new Date().toISOString()
    };
    
    const list = await getRecords();
    list.push(rec);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    
    hideModal('recordModal');
    loadRecords();
    
    const lang = localStorage.getItem('mundax_lang') || 'en';
    addChatMessage(
        lang === 'sn' ? 'Munda wakachengetwa neAI analysis.' : 'Plot saved with AI analysis.',
        'system'
    );
}

async function getRecords() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

async function loadRecords() {
    const recs = await getRecords();
    const container = document.getElementById('records');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!recs.length) {
        const lang = localStorage.getItem('mundax_lang') || 'en';
        container.innerHTML = `<div class="empty">${
            lang === 'sn' ? 'Hapana marekodhi. Wedzera plot yekutanga.' : 'No records yet. Add your first plot.'
        }</div>`;
    } else {
        recs.slice().reverse().forEach(r => {
            const el = document.createElement('div');
            el.className = 'record';
            el.innerHTML = `
                <div>
                    <strong>${r.plot}</strong><br>
                    <small>${r.crop} • ${r.variety} • ${r.area} ha</small>
                </div>
                <div>${new Date(r.plantDate).toLocaleDateString()}</div>
            `;
            container.appendChild(el);
        });
    }
    
    // Update analytics
    updateAnalytics(recs);
}

function updateAnalytics(records) {
    const totalPlots = document.getElementById('totalPlots');
    const avgHealth = document.getElementById('avgHealth');
    const riskAlerts = document.getElementById('riskAlerts');
    
    if (totalPlots) totalPlots.textContent = records.length;
    if (avgHealth) avgHealth.textContent = records.length ? '75%' : '0%';
    if (riskAlerts) riskAlerts.textContent = records.length ? '2' : '0';
}

function clearRecordsHandler() {
    if (confirm('Clear all records?')) {
        localStorage.removeItem(STORAGE_KEY);
        loadRecords();
        const lang = localStorage.getItem('mundax_lang') || 'en';
        addChatMessage(
            lang === 'sn' ? 'Marekodhi ese abviswa.' : 'All records cleared.',
            'system'
        );
    }
}

function exportData() {
    const data = localStorage.getItem(STORAGE_KEY) || '[]';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mundax_farm_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// API Configuration
function setupAPIConfiguration() {
    // Load existing API keys into form
    const deepseekKey = document.getElementById('deepseekKey');
    const openaiKey = document.getElementById('openaiKey');
    const googleKey = document.getElementById('googleKey');
    
    if (deepseekKey) deepseekKey.value = revolutionaryAI.apiKeys.deepseek;
    if (openaiKey) openaiKey.value = revolutionaryAI.apiKeys.openai;
    if (googleKey) googleKey.value = revolutionaryAI.apiKeys.google;
}

function saveAPIConfig(e) {
    e.preventDefault();
    
    const keys = {
        deepseek: document.getElementById('deepseekKey').value,
        openai: document.getElementById('openaiKey').value,
        google: document.getElementById('googleKey').value
    };
    
    revolutionaryAI.saveAPIKeys(keys);
    hideModal('apiConfigModal');
    
    const lang = localStorage.getItem('mundax_lang') || 'en';
    addChatMessage(
        lang === 'sn' ? 'API keys akachengetwa! AI system yagadziridzwa.' : 'API keys saved! AI system updated.',
        'system'
    );
    
    updateAIStatus();
}

function clearAICache() {
    revolutionaryAI.clearCache();
    const lang = localStorage.getItem('mundax_lang') || 'en';
    addChatMessage(
        lang === 'sn' ? 'AI cache yabviswa.' : 'AI cache cleared.',
        'system'
    );
}

// Utility Functions
function updateAIStatus() {
    const aiStatus = document.getElementById('aiStatus');
    if (!aiStatus) return;
    
    const hasValidKeys = Object.values(revolutionaryAI.apiKeys).some(key => 
        key && !key.includes('YOUR_')
    );
    
    if (hasValidKeys) {
        aiStatus.textContent = 'AI Ready';
        aiStatus.className = 'ai-status ready';
    } else {
        aiStatus.textContent = 'Configure API';
        aiStatus.className = 'ai-status loading';
    }
}

function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 10 || month <= 1) return 'rainy';
    if (month >= 2 && month <= 4) return 'harvest';
    if (month >= 5 && month <= 7) return 'dry';
    return 'pre-rainy';
}

function loadMarketData() {
    // Mock market data - in production, this would come from APIs
    const marketData = {
        maize: '8,500 ZWL/tonne',
        tobacco: '4.50 USD/kg'
    };
    
    const priceMaize = document.getElementById('priceMaize');
    const priceTobacco = document.getElementById('priceTobacco');
    
    if (priceMaize) priceMaize.textContent = marketData.maize;
    if (priceTobacco) priceTobacco.textContent = marketData.tobacco;
}

function generateSampleTasks() {
    const tasksContainer = document.getElementById('aiTasks');
    if (!tasksContainer) return;
    
    const lang = localStorage.getItem('mundax_lang') || 'en';
    const tasks = lang === 'sn' 
        ? ['Ongorora Fall Armyworm', 'Isa Compound D', 'Tarisa mwando wevhu']
        : ['Check for Fall Armyworm', 'Apply Compound D', 'Monitor soil moisture'];
    
    tasksContainer.innerHTML = tasks.map(task => 
        `<div class="task-item">• ${task}</div>`
    ).join('');
}

function updateHealthMetrics() {
    const metrics = {
        soilHealth: 75,
        pestRisk: 30,
        cropVigor: 85
    };
    
    Object.keys(metrics).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.style.width = metrics[key] + '%';
        }
    });
}

function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    const dot = document.getElementById('onlineDot');
    if (dot) {
        dot.className = 'dot ' + (isOnline ? 'online' : 'offline');
        dot.title = isOnline ? 'Online' : 'Offline';
    }
}

function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function hideModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Event Listeners
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker registered'))
            .catch(err => console.warn('Service Worker registration failed:', err));
    }
}

// Initialize service worker
registerServiceWorker();