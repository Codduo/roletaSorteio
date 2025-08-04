// 🏢 Base de dados dos colaboradores BMZ
const employees = [
    { name: "Adriano Kolitski", photo: "colaboradores/ADRIANO KOLITSKI.jpg" },
    { name: "Eduardo Sochodolak", photo: "colaboradores/EDUARDO SOCHODOLAK.jpg" },
    { name: "Leonardo Marconato", photo: "" },
    { name: "Alexander Nicolas Costa", photo: "colaboradores/ALEXANDER NICOLAS COSTA.jpg"},
    { name: "Bruna Aparecida Lukaski", photo: "colaboradores/BRUNA APARECIDA LUKASKI.jpg" },
    { name: "Camile Nunes", photo: "colaboradores/CAMILE NUNES.jpg" },
    { name: "Rafael boa pergunta", photo: "semfoto" },
    { name: "Gabriely Holodivski", photo: "colaboradores/GABRIELY HOLODIVSKI.jpg" },
    { name: "Henrique Gerei", photo: "semfoto" },
    { name: "Hevilin Vitória Machado", photo: "colaboradores/HEVILIN VITÓRIA MACHADO.jpg" },
    { name: "Jaqueline Papirniak", photo: "colaboradores/JAQUELINE PAPIRNIAK.jpg" },
    { name: "Liedson 30tou", photo: "semfoto" },
    { name: "Karen Sochodolak", photo: "colaboradores/KAREN SOCHODOLAK.jpg" },
    { name: "Maisa Bail", photo: "colaboradores/MAISA BAIL.jpg" },
    { name: "Margarete Dorak", photo: "colaboradores/MARGARETE DORAK.jpg" },
    { name: "Rodrigo Garbachevski", photo: "colaboradores/RODRIGO GARBACHEVSKI.jpg" },
    { name: "Henrique Leite", photo: "colaboradores/HENRIQUE LEITE.jpg" },
    { name: "Thamires Andrade", photo: "colaboradores/THAMIRES ANDRADE.jpg" },
    { name: "Jamille C. Scheidt", photo: "colaboradores/JAMILLE C. SCHEIDT.jpg" },
    { name: "Jéssica Riffel", photo: "colaboradores/JESSICA RIFFEL.png" },
    { name: "Gisele Saplak", photo: "colaboradores/GISELE SAPLAK.jpg" },
    { name: "Delia Ochoa", photo: "colaboradores/DELIA OCHOA.jpg" },
    { name: "Kélita Schulz", photo: "colaboradores/KÉLITA SCHULZ.jpg" },
    { name: "Maria Leticia", photo: "colaboradores/MARIA LETICIA.png" },
    { name: "Lucas Racelli", photo: "colaboradores/LUCAS RACELLI.jpg" }
];

let selectedEmployees = [];
let prizes = [];
let participants = [];
let isSpinning = false;
let currentRotation = 0;
let prizeHistory = [];

// 🔐 CONFIGURAÇÃO SEGURA DO WEBHOOK
let discordWebhookURL = localStorage.getItem('discordWebhook') || '';

function configureDiscordWebhook() {
    const webhook = prompt('🔐 Cole a URL do webhook do Discord:\n(Esta informação ficará salva localmente no seu navegador)', discordWebhookURL);
    
    if (webhook && webhook.trim()) {
        if (webhook.includes('discord.com/api/webhooks/')) {
            discordWebhookURL = webhook.trim();
            localStorage.setItem('discordWebhook', discordWebhookURL);
            alert('✅ Webhook configurado com sucesso!');
            updateDiscordButton();
        } else {
            alert('❌ URL inválida! Deve ser um webhook do Discord.');
        }
    }
}

function updateDiscordButton() {
    const btn = document.getElementById('discordBtn');
    if (discordWebhookURL) {
        btn.textContent = '📤 Exportar para Discord';
        btn.disabled = false;
        btn.title = 'Webhook configurado';
    } else {
        btn.textContent = '🔧 Configurar Discord';
        btn.disabled = false;
        btn.title = 'Clique para configurar o webhook';
    }
}

// Cores minimalistas elegantes
const colors = [
    '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
    '#1ABC9C', '#E67E22', '#34495E', '#F1C40F', '#E91E63',
    '#8E44AD', '#16A085', '#D35400', '#2980B9', '#27AE60'
];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const fullscreenCanvas = document.getElementById('fullscreenCanvas');
const fullscreenCtx = fullscreenCanvas.getContext('2d');

// 🔊 SISTEMA DE ÁUDIO SHOW DO MILHÃO COM MP3
let audioContext;
let soundEnabled = true;
let spinAudio = null;

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // 🎵 Carregar o áudio do Show do Milhão
        spinAudio = new Audio('show-do-milhao.mp3'); // Coloque o arquivo na pasta do projeto
        spinAudio.volume = 0.7; // Volume ajustável
        spinAudio.preload = 'auto';
        
        // Fallback caso o arquivo não carregue
        spinAudio.addEventListener('error', () => {
            console.log('❌ Não foi possível carregar show-do-milhao.mp3');
            console.log('🔄 Usando áudio sintético como fallback');
            spinAudio = null;
        });
        
    } catch (e) {
        console.log('Áudio não suportado neste navegador');
    }
}

function playSpinSound() {
    if (!soundEnabled) return;
    
    // 🎵 TOCAR MP3 DO SHOW DO MILHÃO
    if (spinAudio) {
        try {
            spinAudio.currentTime = 0; // Resetar para o início
            spinAudio.play().catch(error => {
                console.log('Erro ao reproduzir áudio:', error);
                playFallbackSpinSound(); // Usar som sintético como backup
            });
        } catch (error) {
            console.log('Erro no áudio MP3:', error);
            playFallbackSpinSound();
        }
    } else {
        playFallbackSpinSound();
    }
}

// 🔄 ÁUDIO SINTÉTICO COMO FALLBACK
function playFallbackSpinSound() {
    if (!soundEnabled || !audioContext) return;
    
    console.log('🔄 Usando áudio sintético (fallback)');
    
    // Som dramático de suspense sintético
    let tickCount = 0;
    const totalTicks = 100; // Mais ticks para 10 segundos
    
    // Som de fundo tensão crescente
    const backgroundOsc = audioContext.createOscillator();
    const backgroundGain = audioContext.createGain();
    
    backgroundOsc.connect(backgroundGain);
    backgroundGain.connect(audioContext.destination);
    
    backgroundOsc.frequency.setValueAtTime(55, audioContext.currentTime);
    backgroundOsc.frequency.linearRampToValueAtTime(110, audioContext.currentTime + 10);
    backgroundGain.gain.setValueAtTime(0.02, audioContext.currentTime);
    backgroundGain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 8);
    backgroundGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 10);
    
    backgroundOsc.type = 'sawtooth';
    backgroundOsc.start(audioContext.currentTime);
    backgroundOsc.stop(audioContext.currentTime + 10);
    
    function createDramaticTick() {
        if (tickCount >= totalTicks) return;
        
        // Tick de suspense crescente
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Frequência que aumenta com a tensão
        const progress = tickCount / totalTicks;
        const baseFreq = 600 + (progress * 600); // 600Hz a 1200Hz
        
        oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, audioContext.currentTime + 0.08);
        
        // Filtro para dar brilho
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(300, audioContext.currentTime);
        
        // Volume que cresce com a tensão
        const volume = 0.02 + (progress * 0.03);
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
        
        oscillator.type = 'square';
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.08);
        
        tickCount++;
        
        // Intervalo que diminui criando aceleração dramática (10 segundos total)
        let interval;
        if (progress < 0.4) {
            interval = 120 - (progress * 40); // 120ms para 80ms
        } else if (progress < 0.8) {
            interval = 80 - ((progress - 0.4) * 50); // 80ms para 30ms
        } else {
            // Final super rápido
            const finalProgress = (progress - 0.8) / 0.2;
            interval = 30 - (finalProgress * 20); // 30ms para 10ms
        }
        
        setTimeout(createDramaticTick, interval);
    }
    
    // Começar após pequeno delay
    setTimeout(createDramaticTick, 300);
}

function playWinSound() {
    if (!soundEnabled || !audioContext) return;
    
    // 🏆 FANFARRA ÉPICA DE VITÓRIA (Show do Milhão style)
    const fanfareNotes = [
        {freq: 523.25, time: 0, duration: 0.3},     // Dó
        {freq: 659.25, time: 0.1, duration: 0.3},   // Mi
        {freq: 783.99, time: 0.2, duration: 0.4},   // Sol
        {freq: 1046.50, time: 0.3, duration: 0.5},  // Dó agudo
        {freq: 1318.51, time: 0.4, duration: 0.6}   // Mi agudo
    ];
    
    fanfareNotes.forEach(note => {
        setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(note.freq, audioContext.currentTime);
            
            // Filtro passa-baixa para suavizar
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(note.freq * 2, audioContext.currentTime);
            
            gain.gain.setValueAtTime(0.15, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + note.duration);
            
            osc.type = 'triangle';
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + note.duration);
        }, note.time * 1000);
    });
    
    // Bateria de fundo para dar impacto
    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const noise = audioContext.createBufferSource();
                const gain = audioContext.createGain();
                const filter = audioContext.createBiquadFilter();
                
                // Criar ruído branco para simular bateria
                const bufferSize = audioContext.sampleRate * 0.1;
                const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
                const data = buffer.getChannelData(0);
                
                for (let j = 0; j < bufferSize; j++) {
                    data[j] = (Math.random() * 2 - 1) * 0.5;
                }
                
                noise.buffer = buffer;
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(100, audioContext.currentTime);
                
                noise.connect(filter);
                filter.connect(gain);
                gain.connect(audioContext.destination);
                
                gain.gain.setValueAtTime(0.1, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
                
                noise.start(audioContext.currentTime);
            }, i * 150);
        }
    }, 500);
}

function playConfettiSound() {
    if (!soundEnabled || !audioContext) return;
    
    // 🎊 Som de confetti com sparkles mágicos
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            // Frequências aleatórias agudas para sparkle
            const freq = 1000 + Math.random() * 2000;
            osc.frequency.setValueAtTime(freq, audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioContext.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0.02, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            osc.type = 'sine';
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.1);
        }, i * 30 + Math.random() * 100);
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('soundToggle');
    btn.textContent = soundEnabled ? '🔊' : '🔇';
    btn.classList.toggle('muted', !soundEnabled);
    
    // Parar áudio se desligou o som
    if (!soundEnabled && spinAudio && !spinAudio.paused) {
        spinAudio.pause();
    }
}

// 🔊 CONTROLE DE VOLUME
function adjustVolume(value) {
    const volume = value / 100;
    
    // Atualizar display
    document.getElementById('volumeDisplay').textContent = value + '%';
    
    // Aplicar volume no áudio MP3
    if (spinAudio) {
        spinAudio.volume = volume;
    }
    
    // Salvar preferência do usuário
    localStorage.setItem('audioVolume', value);
}

// Carregar volume salvo na inicialização
function loadSavedVolume() {
    const savedVolume = localStorage.getItem('audioVolume') || '70';
    document.getElementById('volumeSlider').value = savedVolume;
    adjustVolume(savedVolume);
}

// 🎬 CONTROLE DE TELA CHEIA
function openFullscreen() {
    const overlay = document.getElementById('fullscreenOverlay');
    overlay.classList.add('show');
    
    // Inicializar áudio se necessário
    if (!audioContext) {
        initAudio();
    }
    
    // Desenhar roleta na tela cheia
    drawFullscreenWheel();
}

function closeFullscreen() {
    const overlay = document.getElementById('fullscreenOverlay');
    const result = document.getElementById('fullscreenResult');
    const title = document.getElementById('fullscreenTitle');
    
    overlay.classList.remove('show');
    result.classList.remove('show');
    title.textContent = '🎯 ROLETA BMZ 🎯';
}

function drawFullscreenWheel() {
    const centerX = fullscreenCanvas.width / 2;
    const centerY = fullscreenCanvas.height / 2;
    const radius = 230;

    fullscreenCtx.clearRect(0, 0, fullscreenCanvas.width, fullscreenCanvas.height);

    if (participants.length === 0) return;

    const segmentAngle = (2 * Math.PI) / participants.length;

    participants.forEach((participant, index) => {
        const startAngle = index * segmentAngle + currentRotation;
        const endAngle = startAngle + segmentAngle;

        fullscreenCtx.beginPath();
        fullscreenCtx.moveTo(centerX, centerY);
        fullscreenCtx.arc(centerX, centerY, radius, startAngle, endAngle);
        fullscreenCtx.closePath();
        
        const gradient = fullscreenCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, colors[index % colors.length]);
        gradient.addColorStop(1, colors[index % colors.length] + 'cc');
        fullscreenCtx.fillStyle = gradient;
        fullscreenCtx.fill();
        
        fullscreenCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        fullscreenCtx.lineWidth = 3;
        fullscreenCtx.stroke();

        const textAngle = startAngle + segmentAngle / 2;
        const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
        const textY = centerY + Math.sin(textAngle) * (radius * 0.7);
        
        fullscreenCtx.save();
        fullscreenCtx.translate(textX, textY);
        fullscreenCtx.rotate(textAngle + Math.PI / 2);
        
        fullscreenCtx.fillStyle = '#e2e8f0';
        fullscreenCtx.font = 'bold 16px Segoe UI';
        fullscreenCtx.textAlign = 'center';
        fullscreenCtx.shadowColor = 'rgba(0,0,0,0.8)';
        fullscreenCtx.shadowBlur = 3;
        
        const firstName = participant.employee.name.split(' ')[0];
        fullscreenCtx.fillText(firstName, 0, -8);
        
        fullscreenCtx.font = 'bold 12px Segoe UI';
        let prize = participant.prize;
        if (prize.length > 15) prize = prize.substring(0, 15) + '...';
        fullscreenCtx.fillText(prize, 0, 12);
        
        fullscreenCtx.restore();
    });

    fullscreenCtx.beginPath();
    fullscreenCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    fullscreenCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    fullscreenCtx.lineWidth = 8;
    fullscreenCtx.stroke();
}

function showFullscreenResult(winner) {
    const result = document.getElementById('fullscreenResult');
    const photo = document.getElementById('fullscreenWinnerPhoto');
    const name = document.getElementById('fullscreenWinnerName');
    const prize = document.getElementById('fullscreenWinnerPrize');
    
    photo.src = winner.employee.photo;
    name.textContent = winner.employee.name;
    prize.textContent = `🎁 ${winner.prize}`;
    
    result.classList.add('show');
    
    // Sons de vitória
    setTimeout(() => playWinSound(), 500);
    setTimeout(() => playConfettiSound(), 1000);
}

// 🚀 Inicialização
function init() {
    loadEmployees();
    updatePrizesList();
    updateDisplay();
    updateDiscordButton(); // Verificar se webhook já está configurado
    loadSavedVolume(); // Carregar volume salvo
    console.log('🎯 Roleta BMZ inicializada');
}

// 📋 Gerenciamento de abas
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
}

// 👥 Carregamento de colaboradores
function loadEmployees() {
    const grid = document.getElementById('employeeGrid');
    grid.innerHTML = '';
    
    employees.forEach((employee, index) => {
        const card = document.createElement('div');
        card.className = 'employee-card';
        card.onclick = () => toggleEmployee(index);
        
        card.innerHTML = `
            <img src="${employee.photo}" alt="${employee.name}" class="employee-photo">
            <div class="employee-name">${employee.name}</div>
        `;
        
        grid.appendChild(card);
    });
}

// ✅ Seleção de colaboradores
function toggleEmployee(index) {
    const card = document.querySelectorAll('.employee-card')[index];
    
    if (selectedEmployees.includes(index)) {
        selectedEmployees = selectedEmployees.filter(i => i !== index);
        card.classList.remove('selected');
    } else {
        selectedEmployees.push(index);
        card.classList.add('selected');
    }
    
    updateParticipants();
}

// 🎁 Gerenciamento de prêmios
function addPrize() {
    const input = document.getElementById('prizeInput');
    const prize = input.value.trim();
    
    if (prize && !prizes.includes(prize)) {
        prizes.push(prize);
        input.value = '';
        updatePrizesList();
        updateParticipants();
        
        input.style.transform = 'scale(1.05)';
        setTimeout(() => input.style.transform = 'scale(1)', 200);
    } else if (prizes.includes(prize)) {
        alert('Este prêmio já foi adicionado!');
    }
}

function removePrize(index) {
    prizes.splice(index, 1);
    updatePrizesList();
    updateParticipants();
}

function clearPrizes() {
    if (prizes.length > 0 && confirm('Limpar todos os prêmios?')) {
        prizes = [];
        updatePrizesList();
        updateParticipants();
    }
}

function importJSON() {
    document.getElementById('jsonFileInput').click();
}

// Função para processar o arquivo JSON selecionado
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            
            // Verificar se é um array de strings
            if (Array.isArray(jsonData)) {
                let importedCount = 0;
                
                jsonData.forEach(item => {
                    // Converter para string se não for
                    const prizeText = typeof item === 'string' ? item : String(item);
                    
                    // Verificar se o prêmio já existe
                    if (prizeText.trim() && !prizes.includes(prizeText.trim())) {
                        prizes.push(prizeText.trim());
                        importedCount++;
                    }
                });
                
                if (importedCount > 0) {
                    updatePrizesList();
                    updateParticipants();
                    alert(`✅ ${importedCount} prêmio(s) importado(s) com sucesso!`);
                } else {
                    alert('ℹ️ Nenhum prêmio novo foi encontrado no arquivo.');
                }
            } else {
                // Se for um objeto, tentar extrair uma propriedade que contenha array
                const possibleArrays = Object.values(jsonData).filter(value => Array.isArray(value));
                
                if (possibleArrays.length > 0) {
                    const firstArray = possibleArrays[0];
                    let importedCount = 0;
                    
                    firstArray.forEach(item => {
                        const prizeText = typeof item === 'string' ? item : String(item);
                        
                        if (prizeText.trim() && !prizes.includes(prizeText.trim())) {
                            prizes.push(prizeText.trim());
                            importedCount++;
                        }
                    });
                    
                    if (importedCount > 0) {
                        updatePrizesList();
                        updateParticipants();
                        alert(`✅ ${importedCount} prêmio(s) importado(s) com sucesso!`);
                    } else {
                        alert('ℹ️ Nenhum prêmio novo foi encontrado no arquivo.');
                    }
                } else {
                    alert('❌ Formato JSON inválido. O arquivo deve conter um array de prêmios.');
                }
            }
            
        } catch (error) {
            alert('❌ Erro ao ler o arquivo JSON. Verifique se o formato está correto.');
            console.error('Erro ao processar JSON:', error);
        }
        
        // Limpar o input para permitir reimportar o mesmo arquivo
        event.target.value = '';
    };
    
    reader.readAsText(file);
}

function updatePrizesList() {
    const list = document.getElementById('prizesList');
    
    if (prizes.length === 0) {
        list.innerHTML = '<div class="empty-state">Nenhum prêmio adicionado</div>';
        return;
    }
    
    list.innerHTML = prizes.map((prize, index) => `
        <div class="prize-item">
            <span>🎁 ${prize}</span>
            <button class="remove-btn" onclick="removePrize(${index})">×</button>
        </div>
    `).join('');
}

// 🎯 Criação de participantes
function updateParticipants() {
    participants = [];
    
    selectedEmployees.forEach(empIndex => {
        prizes.forEach(prize => {
            participants.push({
                employee: employees[empIndex],
                prize: prize
            });
        });
    });
    
    updateDisplay();
}

function removeParticipant(index) {
    const participant = participants[index];
    const empIndex = employees.findIndex(emp => emp.name === participant.employee.name);
    
    const sameEmployeeCount = participants.filter(p => p.employee.name === participant.employee.name).length;
    if (sameEmployeeCount === 1) {
        selectedEmployees = selectedEmployees.filter(i => i !== empIndex);
        document.querySelectorAll('.employee-card')[empIndex].classList.remove('selected');
    }
    
    updateParticipants();
}

// 🎨 Atualização visual
function updateDisplay() {
    drawWheel();
    updatePrizeHistoryDisplay();
    updateSpinButton();
}

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 160;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (participants.length === 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, '#2d3748');
        gradient.addColorStop(1, '#1a202c');
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.fillStyle = '#718096';
        ctx.font = 'bold 16px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('Selecione colaboradores', centerX, centerY - 10);
        ctx.fillText('e adicione prêmios!', centerX, centerY + 15);
        return;
    }

    const segmentAngle = (2 * Math.PI) / participants.length;

    participants.forEach((participant, index) => {
        const startAngle = index * segmentAngle + currentRotation;
        const endAngle = startAngle + segmentAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, colors[index % colors.length]);
        gradient.addColorStop(1, colors[index % colors.length] + 'cc');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        const textAngle = startAngle + segmentAngle / 2;
        const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
        const textY = centerY + Math.sin(textAngle) * (radius * 0.7);
        
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(textAngle + Math.PI / 2);
        
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 11px Segoe UI';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 2;
        
        const firstName = participant.employee.name.split(' ')[0];
        ctx.fillText(firstName, 0, -5);
        
        ctx.font = 'bold 9px Segoe UI';
        let prize = participant.prize;
        if (prize.length > 12) prize = prize.substring(0, 12) + '...';
        ctx.fillText(prize, 0, 8);
        
        ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 6;
    ctx.stroke();
}

function updateParticipantsList() {
    const list = document.getElementById('participantsList');
    const count = document.getElementById('participantCount');
    
    count.textContent = participants.length;
    
    if (participants.length === 0) {
        list.innerHTML = '<div class="empty-state">Selecione colaboradores e adicione prêmios para começar!</div>';
        return;
    }
    
    list.innerHTML = participants.map((participant, index) => `
        <div class="participant-item">
            <div class="participant-info">
                <img src="${participant.employee.photo}" class="participant-photo" alt="${participant.employee.name}">
                <div class="participant-details">
                    <div class="participant-name">${participant.employee.name}</div>
                    <div class="participant-prize">🎁 ${participant.prize}</div>
                </div>
            </div>
            <button class="remove-btn" onclick="removeParticipant(${index})">×</button>
        </div>
    `).join('');
}

// 🔧 CORREÇÃO: Agora verifica PRÊMIOS ao invés de participantes
function updateSpinButton() {
    const btn = document.getElementById('spinBtn');
    const hasEmployees = selectedEmployees.length > 0;
    const hasPrizes = prizes.length >= 2; // 🎯 CORRIGIDO: Pelo menos 2 prêmios
    
    btn.disabled = !hasEmployees || !hasPrizes || isSpinning;
    
    if (!hasEmployees) {
        btn.textContent = '🎯 SELECIONE PELO MENOS 1 COLABORADOR';
    } else if (!hasPrizes) {
        btn.textContent = '🎯 ADICIONE PELO MENOS 2 PRÊMIOS'; // 🎯 CORRIGIDO
    } else if (isSpinning) {
        btn.textContent = '🌀 GIRANDO...';
    } else {
        btn.textContent = '🎯 GIRAR ROLETA';
    }
}

// 🎪 Animação da roleta (10 SEGUNDOS)
function spinWheel() {
    const hasEmployees = selectedEmployees.length > 0;
    const hasPrizes = prizes.length >= 2;
    
    if (!hasEmployees || !hasPrizes || isSpinning) return;
    
    isSpinning = true;
    hideResult();
    updateSpinButton();
    
    // Abrir tela cheia
    openFullscreen();
    
    // Adicionar classe de animação
    const overlay = document.getElementById('fullscreenOverlay');
    overlay.classList.add('spinning');
    
    // 🎵 Tocar som do Show do Milhão (início imediato)
    playSpinSound();
    
    const minSpins = 8;  // Mais voltas para 10 segundos
    const maxSpins = 12;
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const finalAngle = Math.random() * 2 * Math.PI;
    const totalRotation = spins * 2 * Math.PI + finalAngle;
    
    const duration = 10000; // 🎯 EXATAMENTE 10 SEGUNDOS
    const startTime = Date.now();
    const startRotation = currentRotation;
    
    // Atualizar título durante o giro
    const title = document.getElementById('fullscreenTitle');
    title.textContent = '🌪️ RODANDO 🌪️';
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 🎯 Curva de animação mais suave para 10 segundos
        const easeProgress = 1 - Math.pow(1 - progress, 2.5); // Curva mais suave
        
        currentRotation = startRotation + totalRotation * easeProgress;
        drawWheel();
        drawFullscreenWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            updateSpinButton();
            
            // 🎵 Parar o áudio caso ainda esteja tocando
            if (spinAudio) {
                spinAudio.pause();
                spinAudio.currentTime = 0;
            }
            
            // Remover classe de animação
            overlay.classList.remove('spinning');
            
            // Calcular vencedor
            const segmentAngle = (2 * Math.PI) / participants.length;
            const pointerPosition = -Math.PI / 2;
            const currentAngleAtPointer = pointerPosition - currentRotation;
            const normalizedAngle = ((currentAngleAtPointer % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
            const winnerIndex = Math.floor(normalizedAngle / segmentAngle);
            const winner = participants[winnerIndex];
            
            console.log('🏆 Vencedor:', winner);
            
            // Atualizar título
            title.textContent = '🎯 E O VENCEDOR É... 🎯';
            
            // Mostrar resultado após um delay dramático
            setTimeout(() => {
                showResult(winner);
                showFullscreenResult(winner);
                createFireworks();
            }, 1500);
        }
    }
    
    animate();
}

// 🏆 Resultado
function showResult(winner) {
    const result = document.getElementById('result');
    const photo = document.getElementById('winnerPhoto');
    const name = document.getElementById('winnerName');
    const prize = document.getElementById('winnerPrize');
    
    photo.src = winner.employee.photo;
    photo.classList.add('show');
    name.textContent = winner.employee.name;
    prize.textContent = `🎁 ${winner.prize}`;
    
    // Adicionar ao histórico
    prizeHistory.push({
        name: winner.employee.name,
        photo: winner.employee.photo,
        prize: winner.prize
    });
    
    // 🎯 Remover o prêmio da lista automaticamente
    const prizeIndex = prizes.indexOf(winner.prize);
    if (prizeIndex !== -1) {
        prizes.splice(prizeIndex, 1);
        console.log(`🎁 Prêmio "${winner.prize}" removido da lista`);
        
        // Atualizar as listas e participantes
        updatePrizesList();
        updateParticipants();
    }
    
    updatePrizeHistoryDisplay();
    result.classList.add('show');
    createConfetti();
}

function hideResult() {
    const result = document.getElementById('result');
    const photo = document.getElementById('winnerPhoto');
    result.classList.remove('show');
    photo.classList.remove('show');
}

// 🎊 Confetti elegante
function createConfetti() {
    const confettiColors = ['#4a5568', '#2d3748', '#e2e8f0', '#cbd5e0'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -10px;
                width: 8px;
                height: 8px;
                background: ${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
                pointer-events: none;
                border-radius: 50%;
                animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
                z-index: 1000;
            `;
            
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }, i * 100);
    }
}

// 🎆 FOGOS DE ARTIFÍCIO ESPETACULARES
function createFireworks() {
    const fireworkColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#a29bfe'];
    
    for (let burst = 0; burst < 5; burst++) {
        setTimeout(() => {
            const centerX = Math.random() * window.innerWidth;
            const centerY = Math.random() * window.innerHeight * 0.7;
            
            for (let i = 0; i < 20; i++) {
                const angle = (Math.PI * 2 * i) / 20;
                const velocity = 100 + Math.random() * 150;
                
                const firework = document.createElement('div');
                firework.style.cssText = `
                    position: fixed;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    width: 8px;
                    height: 8px;
                    background: ${fireworkColors[Math.floor(Math.random() * fireworkColors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    box-shadow: 0 0 20px currentColor;
                    z-index: 1001;
                `;
                
                const dx = Math.cos(angle) * velocity;
                const dy = Math.sin(angle) * velocity;
                
                firework.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 1000 + Math.random() * 500,
                    easing: 'ease-out'
                }).onfinish = () => firework.remove();
                
                document.body.appendChild(firework);
            }
        }, burst * 200);
    }
}

// Event listeners
document.getElementById('prizeInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addPrize();
});

function updatePrizeHistoryDisplay() {
    const list = document.getElementById('prizeHistoryList');
    if (prizeHistory.length === 0) {
        list.innerHTML = '<div class="empty-state">Nenhum prêmio foi sorteado ainda.</div>';
        return;
    }

    list.innerHTML = prizeHistory.map(entry => `
        <div class="participant-item">
            <div class="participant-info">
                <img src="${entry.photo}" class="participant-photo" alt="${entry.name}">
                <div class="participant-details">
                    <div class="participant-name">${entry.name}</div>
                    <div class="participant-prize">🎁 ${entry.prize}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// 📥 FUNÇÃO PARA BAIXAR RELATÓRIO TXT
function downloadReport() {
    if (prizeHistory.length === 0) {
        alert("📋 Nenhum prêmio para exportar no relatório.");
        return;
    }

    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const timeString = currentDate.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    let reportContent = '';
    reportContent += '═══════════════════════════════════════════════════════════\n';
    reportContent += '🏆               RELATÓRIO OFICIAL BMZ                🏆\n';
    reportContent += '                   SORTEIO DE PRÊMIOS                     \n';
    reportContent += '═══════════════════════════════════════════════════════════\n\n';
    
    reportContent += `📅 DATA: ${dateString}\n`;
    reportContent += `🕐 HORÁRIO: ${timeString}\n`;
    reportContent += `🎯 TOTAL DE PRÊMIOS SORTEADOS: ${prizeHistory.length}\n\n`;
    
    reportContent += '───────────────────────────────────────────────────────────\n';
    reportContent += '🎁                    RESULTADOS                     🎁\n';
    reportContent += '───────────────────────────────────────────────────────────\n\n';
    
    prizeHistory.forEach((entry, index) => {
        reportContent += `${(index + 1).toString().padStart(2, '0')}º LUGAR\n`;
        reportContent += `👤 COLABORADOR: ${entry.name}\n`;
        reportContent += `🎁 PRÊMIO: ${entry.prize}\n\n`;
    });
    
    // Estatísticas
    const uniqueWinners = [...new Set(prizeHistory.map(entry => entry.name))];
    reportContent += '───────────────────────────────────────────────────────────\n';
    reportContent += '📊                  ESTATÍSTICAS                    📊\n';
    reportContent += '───────────────────────────────────────────────────────────\n\n';
    reportContent += `👥 PESSOAS CONTEMPLADAS: ${uniqueWinners.length}\n`;
    reportContent += `🎁 TOTAL DE PRÊMIOS: ${prizeHistory.length}\n`;
    reportContent += `✅ SORTEIO REALIZADO COM SUCESSO!\n\n`;
    
    reportContent += '═══════════════════════════════════════════════════════════\n';
    reportContent += '              Gerado pelo Sistema BMZ                     \n';
    reportContent += '               🎯 ROLETA DE SORTEIOS 🎯                   \n';
    reportContent += '═══════════════════════════════════════════════════════════\n';

    // Criar e baixar arquivo
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const fileName = `BMZ_Sorteio_${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}_${currentDate.getHours().toString().padStart(2, '0')}h${currentDate.getMinutes().toString().padStart(2, '0')}.txt`;
    
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert(`📄 Relatório baixado: ${fileName}`);
}

// 🔄 FUNÇÃO SEGURA PARA DISCORD (SEM WEBHOOK EXPOSTO)
function exportarParaDiscord() {
    if (!discordWebhookURL) {
        configureDiscordWebhook();
        return;
    }
    
    if (prizeHistory.length === 0) {
        alert("📋 Nenhum prêmio para exportar.");
        return;
    }

    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const timeString = currentDate.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    // 🎯 Formatação rica para Discord
    const embed = {
        title: "🏆 Sorteio BMZ - Resultados Oficiais",
        description: `📅 **Data:** ${dateString}\n🕐 **Horário:** ${timeString}\n\n🎯 **Total de prêmios sorteados:** ${prizeHistory.length}`,
        color: 0x4a5568, // Cor azul-acinzentado elegante
        thumbnail: {
            url: "https://cdn-icons-png.flaticon.com/512/9028/9028011.png" // Ícone de troféu
        },
        fields: [],
        footer: {
            text: "Sistema de Sorteios BMZ • Operacional",
            icon_url: "https://cdn-icons-png.flaticon.com/512/2995/2995463.png"
        },
        timestamp: new Date().toISOString()
    };

    // Adicionar cada vencedor como um field
    prizeHistory.forEach((entry, index) => {
        embed.fields.push({
            name: `${index + 1}º Lugar 🥇`,
            value: `👤 **${entry.name}**\n🎁 *${entry.prize}*`,
            inline: true
        });
    });

    // Se houver muitos prêmios, fazer uma versão condensada
    if (prizeHistory.length > 10) {
        embed.fields = []; // Limpar fields
        
        let winners = "";
        prizeHistory.forEach((entry, index) => {
            winners += `**${index + 1}.** ${entry.name} → *${entry.prize}*\n`;
        });

        embed.fields.push({
            name: "🎊 Lista Completa de Vencedores",
            value: winners,
            inline: false
        });
    }

    // Adicionar estatísticas
    const uniqueWinners = [...new Set(prizeHistory.map(entry => entry.name))];
    embed.fields.push({
        name: "📊 Estatísticas",
        value: `👥 **Pessoas contempladas:** ${uniqueWinners.length}\n🎁 **Total de prêmios:** ${prizeHistory.length}\n🎯 **Sorteio realizado com sucesso!**`,
        inline: false
    });

    const payload = {
        username: "Roleta BMZ 🎯",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/2006/2006249.png",
        embeds: [embed]
    };

    fetch(discordWebhookURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            alert("✅ Histórico enviado para o Discord com sucesso!\n🎊 Confira o canal para ver os resultados formatados.");
        } else {
            alert("❌ Erro ao enviar para o Discord. Verifique o webhook.");
        }
    })
    .catch(error => {
        console.error("Erro ao enviar webhook:", error);
        alert("🔌 Falha na conexão com o Discord.");
    });
}

// CSS dinâmico
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    /* Animações adicionais para tela cheia */
    .fullscreen-overlay canvas {
        filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.3));
    }
    
    .fullscreen-overlay.spinning canvas {
        animation: wheelSpinGlow 4s ease-out;
    }
    
    @keyframes wheelSpinGlow {
        0% { filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.3)); }
        50% { filter: drop-shadow(0 0 60px rgba(74, 85, 104, 0.8)); }
        100% { filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.3)); }
    }
`;
document.head.appendChild(style);

// Inicializar

init();
