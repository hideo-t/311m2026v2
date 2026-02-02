/**
 * 3.11 メモリークエスト：COLOR & VOICE（#9）
 * メインゲームロジック
 */

// ===================================
// グローバル状態管理
// ===================================
const state = {
    scene: 0,
    selectedColor: null,
    scores: {
        memory: 0,
        hope: 0,
        link: 0
    },
    foundArtists: [],
    resonanceCount: 0,
    audioContext: null,
    audioInitialized: false
};

// 出演者リスト（21名）
const ARTISTS = [
    'テルG',
    '高橋迷人',
    '加藤漢太',
    '岡田純子',
    '橋本妙子',
    '清水兼一',
    '伊藤和哉',
    'マヒロスターズフラチーム',
    '大槻いくを',
    '原田雪見',
    'KUSANO',
    'アベマンセイ',
    '相良裕成',
    '"~ing',
    'Lumiere',
    'mone',
    '大督',
    '芦原会館',
    '福島スポーツアカデミー（FSAダンススクール）',
    'STUDIO DANCE HEAD',
    '空先拓海'
];

// 色設定
const COLORS = {
    yellow: { hex: '#FFD700', name: 'YELLOW', type: 'HOPE RUNNER' },
    green: { hex: '#7FFF00', name: 'GREEN', type: 'HARMONY MAKER' },
    cyan: { hex: '#00FFFF', name: 'CYAN', type: 'MEMORY CARRIER' },
    purple: { hex: '#DA70D6', name: 'PURPLE', type: 'VOICE KEEPER' }
};

// 波形アイコン
const WAVE_ICONS = ['🎤', '💃', '🎸', '👦'];

// アニメーション用変数
let waveIcons = [];
let particles = [];
let mapParticles = [];
let animationId = null;

// ===================================
// 初期化
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 3.11 メモリークエスト 起動');
    
    // イベントリスナー登録
    initEventListeners();
    
    // 初期表示
    updateGauges();
    
    console.log('準備完了');
});

// ===================================
// イベントリスナー初期化
// ===================================
function initEventListeners() {
    // Scene 0: STARTボタン
    document.getElementById('startButton').addEventListener('click', () => {
        initAudio();
        playSound('start');
        changeScene(1);
    });
    
    // Scene 1: カラー選択
    document.querySelectorAll('.color-block').forEach(block => {
        block.addEventListener('click', (e) => {
            const color = e.currentTarget.dataset.color;
            selectColor(color);
        });
    });
    
    // Scene 3: 次へボタン
    document.getElementById('scene3NextButton').addEventListener('click', () => {
        playSound('transition');
        changeScene(4);
    });
    
    // Scene 4: FINISHボタン
    document.getElementById('scene4NextButton').addEventListener('click', () => {
        playSound('transition');
        changeScene(5);
    });
    
    // Scene 5: シェア・リスタートボタン
    document.getElementById('shareButton').addEventListener('click', shareResult);
    document.getElementById('restartButton').addEventListener('click', restartGame);
}

// ===================================
// Audio Context 初期化（iOS対策）
// ===================================
function initAudio() {
    if (!state.audioInitialized) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            state.audioContext = new AudioContext();
            state.audioInitialized = true;
            console.log('Audio initialized');
        } catch (e) {
            console.warn('Audio not supported:', e);
        }
    }
}

// ===================================
// サウンド再生（WebAudio）
// ===================================
function playSound(type) {
    if (!state.audioContext) return;
    
    const ctx = state.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    switch (type) {
        case 'start':
            oscillator.frequency.value = 523.25; // C5
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.3);
            break;
        
        case 'select':
            oscillator.frequency.value = 659.25; // E5
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.2);
            break;
        
        case 'resonance':
            oscillator.frequency.value = 784; // G5
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.3);
            break;
        
        case 'complete':
            [523.25, 659.25, 783.99].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3);
                osc.start(ctx.currentTime + i * 0.1);
                osc.stop(ctx.currentTime + i * 0.1 + 0.3);
            });
            break;
        
        case 'transition':
            oscillator.frequency.value = 440; // A4
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.1);
            break;
    }
}

// ===================================
// Scene 遷移
// ===================================
function changeScene(sceneNum) {
    console.log('Scene', sceneNum, 'へ遷移');
    
    // 現在のSceneを非表示
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    
    // 次のSceneを表示
    const nextScene = document.getElementById('scene' + sceneNum);
    if (nextScene) {
        nextScene.classList.add('active');
        state.scene = sceneNum;
        
        // Scene別の初期化処理
        switch (sceneNum) {
            case 1:
                initScene1();
                break;
            case 2:
                initScene2();
                break;
            case 3:
                initScene3();
                break;
            case 4:
                initScene4();
                break;
            case 5:
                initScene5();
                break;
        }
    }
    
    window.scrollTo(0, 0);
}

// ===================================
// スコアゲージ更新
// ===================================
function updateGauges() {
    const clamp = (val) => Math.min(100, Math.max(0, val));
    
    document.getElementById('memoryGauge').style.width = clamp(state.scores.memory) + '%';
    document.getElementById('hopeGauge').style.width = clamp(state.scores.hope) + '%';
    document.getElementById('linkGauge').style.width = clamp(state.scores.link) + '%';
}

// ===================================
// Scene 1: カラー選択
// ===================================
function initScene1() {
    console.log('Scene 1: カラー選択 初期化');
}

function selectColor(color) {
    console.log('色選択:', color);
    
    initAudio();
    playSound('select');
    
    state.selectedColor = color;
    state.scores.memory += 10;
    updateGauges();
    
    // パーティクル生成
    const canvas = document.getElementById('particleCanvas1');
    const block = document.querySelector(`.color-block.${color}`);
    const rect = block.getBoundingClientRect();
    
    createParticles(canvas, rect.left + rect.width / 2, rect.top + rect.height / 2, COLORS[color].hex);
    
    // Scene 2へ遷移
    setTimeout(() => {
        changeScene(2);
    }, 800);
}

// ===================================
// Scene 2: 波形マッチ
// ===================================
function initScene2() {
    console.log('Scene 2: 波形マッチ 初期化');
    
    // 背景色を選択した色に変更
    const scene = document.getElementById('scene2');
    const colorHex = COLORS[state.selectedColor].hex;
    scene.style.background = `radial-gradient(circle at center, ${colorHex}22, var(--bg-game))`;
    
    // 波形アイコン生成を開始
    state.resonanceCount = 0;
    document.getElementById('resonanceCount').textContent = '0';
    waveIcons = [];
    
    // 定期的に波形アイコンを生成
    const waveInterval = setInterval(() => {
        if (state.scene !== 2 || state.resonanceCount >= 5) {
            clearInterval(waveInterval);
            return;
        }
        createWaveIcon();
    }, 1500);
    
    // アニメーションループ開始
    animateWaves();
}

function createWaveIcon() {
    const container = document.getElementById('waveContainer');
    const icon = document.createElement('div');
    icon.className = 'wave-icon';
    icon.textContent = WAVE_ICONS[Math.floor(Math.random() * WAVE_ICONS.length)];
    icon.style.left = Math.random() * 80 + 10 + '%';
    icon.style.bottom = '-60px';
    
    const waveData = {
        element: icon,
        y: -60,
        speed: 2 + Math.random() * 1.5,
        clicked: false
    };
    
    waveIcons.push(waveData);
    container.appendChild(icon);
    
    // タップイベント
    icon.addEventListener('click', () => {
        if (waveData.clicked) return;
        
        // 共鳴ゾーンの範囲チェック
        const zoneTop = window.innerHeight * 0.4;
        const zoneBottom = zoneTop + 80;
        const iconTop = window.innerHeight - waveData.y - 60;
        
        if (iconTop >= zoneTop && iconTop <= zoneBottom) {
            // 共鳴成功
            waveData.clicked = true;
            icon.style.opacity = '0';
            
            playSound('resonance');
            state.resonanceCount++;
            state.scores.hope += 10;
            updateGauges();
            
            document.getElementById('resonanceCount').textContent = state.resonanceCount;
            
            // パーティクル生成
            const canvas = document.getElementById('particleCanvas2');
            const rect = icon.getBoundingClientRect();
            createParticles(canvas, rect.left + rect.width / 2, rect.top + rect.height / 2, COLORS[state.selectedColor].hex);
            
            // 5回達成でScene 3へ
            if (state.resonanceCount >= 5) {
                playSound('complete');
                state.scores.hope += 20; // ボーナス
                updateGauges();
                
                setTimeout(() => {
                    changeScene(3);
                }, 1000);
            }
        }
    });
}

function animateWaves() {
    if (state.scene !== 2) {
        waveIcons.forEach(wave => {
            if (wave.element.parentNode) {
                wave.element.parentNode.removeChild(wave.element);
            }
        });
        waveIcons = [];
        return;
    }
    
    waveIcons.forEach((wave, index) => {
        wave.y += wave.speed;
        wave.element.style.bottom = wave.y + 'px';
        
        // 画面外に出たら削除
        if (wave.y > window.innerHeight + 60) {
            if (wave.element.parentNode) {
                wave.element.parentNode.removeChild(wave.element);
            }
            waveIcons.splice(index, 1);
        }
    });
    
    animationId = requestAnimationFrame(animateWaves);
}

// ===================================
// Scene 3: 出演者発見
// ===================================
function initScene3() {
    console.log('Scene 3: 出演者発見 初期化');
    
    // 21名からランダムに5名選択（重複なし）
    const shuffled = [...ARTISTS].sort(() => Math.random() - 0.5);
    state.foundArtists = shuffled.slice(0, 5);
    
    // カード表示
    const container = document.getElementById('artistCards');
    container.innerHTML = '';
    
    state.foundArtists.forEach((artist, index) => {
        setTimeout(() => {
            const card = createArtistCard(artist);
            container.appendChild(card);
        }, index * 300);
    });
    
    state.scores.memory += 15;
    updateGauges();
}

function createArtistCard(artistName) {
    const card = document.createElement('div');
    card.className = 'artist-card';
    
    const name = document.createElement('div');
    name.className = 'artist-name';
    name.textContent = artistName;
    
    const comment = document.createElement('div');
    comment.className = 'artist-comment';
    comment.textContent = getArtistComment();
    
    card.appendChild(name);
    card.appendChild(comment);
    
    // タップでコメント表示
    card.addEventListener('click', () => {
        playSound('select');
        card.classList.toggle('revealed');
    });
    
    return card;
}

function getArtistComment() {
    const comments = [
        '今日の音の色：' + COLORS[state.selectedColor].name,
        'この日を忘れない',
        '心に響く声',
        '共鳴する想い',
        'つながる記憶',
        '希望の音',
        'あの日から、これから'
    ];
    return comments[Math.floor(Math.random() * comments.length)];
}

// ===================================
// Scene 4: 共鳴マップ
// ===================================
function initScene4() {
    console.log('Scene 4: 共鳴マップ 初期化');
    
    const canvas = document.getElementById('mapCanvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // 粒子生成
    mapParticles = [];
    const colorHex = COLORS[state.selectedColor].hex;
    
    for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 150;
        
        mapParticles.push({
            x: canvas.width / 2 + Math.cos(angle) * distance,
            y: canvas.height / 2 + Math.sin(angle) * distance,
            targetX: canvas.width / 2,
            targetY: canvas.height / 2,
            color: colorHex,
            size: 3 + Math.random() * 5,
            speed: 0.02 + Math.random() * 0.02
        });
    }
    
    // アニメーション開始
    animateMapParticles(canvas);
    
    state.scores.memory += 25;
    updateGauges();
}

function animateMapParticles(canvas) {
    if (state.scene !== 4) {
        return;
    }
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    mapParticles.forEach(particle => {
        // 中央に向かって移動
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            particle.x += dx * particle.speed;
            particle.y += dy * particle.speed;
        }
        
        // 描画
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // グロー効果
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    
    requestAnimationFrame(() => animateMapParticles(canvas));
}

// ===================================
// Scene 5: 結果画面
// ===================================
function initScene5() {
    console.log('Scene 5: 結果画面 初期化');
    
    const colorData = COLORS[state.selectedColor];
    
    // 色表示
    const colorDisplay = document.getElementById('colorDisplay');
    colorDisplay.style.background = colorData.hex;
    colorDisplay.style.boxShadow = `0 0 40px ${colorData.hex}`;
    
    document.getElementById('colorName').textContent = colorData.name;
    document.getElementById('resultType').textContent = colorData.type;
    
    // 合言葉コード生成
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const code = `311-KORIYAMA-${colorData.name}-${random}`;
    document.getElementById('codeDisplay').textContent = code;
    
    // 最終スコア表示
    document.getElementById('finalMemory').textContent = Math.floor(state.scores.memory);
    document.getElementById('finalHope').textContent = Math.floor(state.scores.hope);
    document.getElementById('finalLink').textContent = Math.floor(state.scores.link);
    
    playSound('complete');
}

// ===================================
// パーティクル生成
// ===================================
function createParticles(canvas, x, y, color) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // 20個の粒子を生成
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.0,
            size: 3 + Math.random() * 5
        });
    }
    
    // アニメーション
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let alive = false;
        
        particles.forEach(p => {
            if (p.life <= 0) return;
            
            alive = true;
            
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // 重力
            p.life -= 0.02;
            
            ctx.globalAlpha = p.life;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.globalAlpha = 1.0;
        
        if (alive) {
            requestAnimationFrame(animateParticles);
        }
    }
    
    animateParticles();
}

// ===================================
// シェア機能
// ===================================
function shareResult() {
    playSound('select');
    
    const colorData = COLORS[state.selectedColor];
    const code = document.getElementById('codeDisplay').textContent;
    const text = `3.11メモリークエスト：COLOR & VOICE（#9）\n` +
                 `私の色：${colorData.name}\n` +
                 `TYPE：${colorData.type}\n` +
                 `合言葉：${code}\n` +
                 `3月8日（日）12:00〜 Koriyama #9で会いましょう！\n` +
                 `#3_11 #福島の子供たちのために #あの日を忘れない`;
    
    // Web Share API対応チェック
    if (navigator.share) {
        navigator.share({
            title: '3.11メモリークエスト',
            text: text
        }).then(() => {
            console.log('共有成功');
            state.scores.link += 50;
            updateGauges();
        }).catch(err => {
            console.log('共有キャンセル', err);
        });
    } else {
        // クリップボードにコピー
        navigator.clipboard.writeText(text).then(() => {
            alert('メッセージをコピーしました！SNSで共有してください。');
            state.scores.link += 50;
            updateGauges();
        }).catch(err => {
            console.error('コピー失敗', err);
            alert(text);
        });
    }
}

// ===================================
// リスタート
// ===================================
function restartGame() {
    playSound('start');
    
    // 状態リセット
    state.scene = 0;
    state.selectedColor = null;
    state.scores = { memory: 0, hope: 0, link: 0 };
    state.foundArtists = [];
    state.resonanceCount = 0;
    
    // アニメーション停止
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    // ゲージリセット
    updateGauges();
    
    // Scene 0へ
    changeScene(0);
}

// ===================================
// デバッグ用
// ===================================
window.gameState = state;
console.log('デバッグ: window.gameState でステート確認可能');
