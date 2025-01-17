'use strict';

const GAME_TITLE = 'Escape Snowie!';
const GAME_COPYRIGHT = '© Node, 2024. All rights reserved.';

const LAST_RELEASE_DATE = 'January 7, 2025 y.';
const LAST_RELEASE_VERSION = '1.0.6';

const SHOP_ITEMS = [
    {
        Title: 'Default Textures',
        Price: 0,
        Callback: () => { selectedSnowieSkin = 0; localStorage.setItem('selectedSnowieSkin', 0); }
    },
    {
        Title: 'i_Woki Textures',
        Price: 0,
        Callback: () => { selectedSnowieSkin = 1; localStorage.setItem('selectedSnowieSkin', 1); }
    },
    {
        Title: 'Esherton Textures',
        Price: 0,
        Callback: () => { selectedSnowieSkin = 2; localStorage.setItem('selectedSnowieSkin', 2); }
    },
    {
        Title: 'Epic Fluffy Textures (Banned)',
        Price: 9999999999,
        Callback: () => { alert("Texture Pack banned.") }
    },
    {
        Title: 'NiNiTaDa Textures',
        Price: 0,
        Callback: () => { selectedSnowieSkin = 4; localStorage.setItem('selectedSnowieSkin', 4); }
    },
    {
        Title: 'amicus_l Textures',
        Price: 0,
        Callback: () => { selectedSnowieSkin = 5; localStorage.setItem('selectedSnowieSkin', 5); }
    },
    {
        Title: 'VodeezAku Textures',
        Price: 0,
        Callback: () => { selectedSnowieSkin = 6; localStorage.setItem('selectedSnowieSkin', 6); }
    },
    {
        Title: 'DrOtter Textures',
        Price: 0,
        Callback: () => { selectedSnowieSkin = 7; localStorage.setItem('selectedSnowieSkin', 7); }
    },
];

const SNOWIE_TEXTURE_NAMES = [
    'Snowie Default',
    'i_Woki (Gift Pack)',
    'Esherton (Gift Pack)',
    'NiNiTaDa (Gift Pack)',
    'amicus_l (Gift Pack)',
    'VodeezAku (Gift Pack)',
];

const SNOWIE_TEXTURE_PATHS = [
    [   // Default Textures
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/0/Snow_1.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/0/Snow_2.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/0/Snow_3.png?raw=true'
    ],
    [   // i_Woki Textures
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/1/Snow_1.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/1/Snow_2.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/1/Snow_3.png?raw=true'
    ],
    [   // Esherton Textures
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/2/Snow_1.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/2/Snow_1.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/2/Snow_1.png?raw=true'
    ],
    [   // Epic_Fluffy Textures
        //'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/3/Snow_1.png?raw=true',
        //'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/3/Snow_2.png?raw=true',
        //'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/3/Snow_3.png?raw=true'
    ],
    [   // NiNiTaDa Textures
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/4/Snow_1.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/4/Snow_1.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/4/Snow_1.png?raw=true'
    ],
    [   // amicus_l Textures
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/5/Snow_1.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/5/Snow_2.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/5/Snow_3.png?raw=true'
    ],
    [   // VodeezAku Textures
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/6/Snow_1.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/6/Snow_2.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/6/Snow_3.png?raw=true'
    ],
    [   // DrOtter Textures
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/7/Snow_1.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/7/Snow_2.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/7/Snow_3.png?raw=true'
    ],
    // You need to add HighCloudBuster textures for fun.
];

const texturePreview = document.getElementById('texturePreview');

// Audio System
let audioContext;
let audioSource;
let gainNode;
let lowPassFilter;

async function loadAudio(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    audioSource = audioContext.createBufferSource();
    audioSource.loop = true;
    audioSource.buffer = audioBuffer;
    audioSource.connect(lowPassFilter);
    lowPassFilter.connect(gainNode);
    gainNode.connect(audioContext.destination);
}

function applyBlurEffect(isPaused) {
    if (isPaused) {
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        lowPassFilter.frequency.linearRampToValueAtTime(2000, audioContext.currentTime);
    } else {
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
        lowPassFilter.frequency.linearRampToValueAtTime(24000, audioContext.currentTime);
    }
}

function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    lowPassFilter = audioContext.createBiquadFilter();
    lowPassFilter.type = 'lowpass';
    lowPassFilter.frequency.setValueAtTime(24000, audioContext.currentTime);

    loadAudio('Untitled.wav').then(() => {
        audioSource.start(0);
    });
}

// -- Audio System

const canvas = document.getElementById('iSnowie');
const ctx = canvas.getContext('2d');

let canvasRect = canvas.getBoundingClientRect();

let mouseX = 0, mouseY = 0;

let isGameInited = false;
let isGamePaused = false;

let currentLevel = 0;

let currentPoints = parseInt(localStorage.getItem('points')) || 0;

let selectedSnowieSkin = localStorage.getItem('selectedSnowieSkin') ?? 0; // 0
let savedSnowieSkin = 0;

let escapedSnowies = 0;
let escapedSnowiesTotal = 0;

let timeRemaining = 70;
let impulseCouldown = 40; // 0

let registedButtons = {};

let resourceCache = {};

// Adding `window.requestAnimationFrame()` support for most browsers.
const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

window.requestAnimationFrame = requestAnimationFrame;

function ClearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function ReCalculateCanvasSize() {
    ClearCanvas();
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    canvasRect = canvas.getBoundingClientRect();
    
    homeWindow_Layer.UpdatePosition();
    skinSelectionWindow_Layer.UpdatePosition();
    
    snowieDangerLayer.UpdatePosition();
}

function ReduceImpulseCouldown(value) {
    if(impulseCouldown > 0) {
        impulseCouldown -= value;
    }
}

function updatePoints(value) {
    currentPoints += value;
    document.getElementById('currentPointsBalance').innerText = `You have: ${currentPoints} Points`;
    localStorage.setItem('points', currentPoints);
}

function ResetGame() {
    escapedSnowies = 0;
    escapedSnowiesTotal = 0;
    
    timeRemaining = 70;
    impulseCouldown = 40;
    
    isGameInited = false;
    isGamePaused = false;
    
    currentLevel = 0;
    
    snowieLayer.flakes = [];
    snowieLayer.flakeCount = 15;
    
    snowieLayer.InitFlakes();
    
    audioSource.stop();
    
    // Fix
    document.getElementById('windows').classList.remove('d-none');
    
    document.getElementById('HomeWindow').classList.remove('isClosed');
}

function setTrueWithChance(chance) {
    const randomValue = Math.random();

    return randomValue < chance;
}

function RegisterTimers() {
    setInterval(() => {
        if(!isGameInited || isGamePaused) return;
        
        //timeRemaining--; // Disabled for Release.
        
        ReduceImpulseCouldown(1);
        
        if(timeRemaining <= 0) {
            ResetGame();
        }
    }, 1000);
}

class Layer {
    constructor() {
        if(this.constructor === Layer) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
    
    Draw() {
        throw new Error("Method `Layer.Draw()` must be implemented.");
    }
}

class Button {
    buttonText = 'Button';
    
    x = 0;
    y = 0;
    
    width = 0;
    height = 0;
    
    buttonBoundingBox = null;
    
    clickCallback = null;
    
    constructor(buttonText, x, y, width, height, clickCallback = null) {
        this.buttonText = buttonText;
        
        this.x = x;
        this.y = y;
        
        this.width = width;
        this.height = height;
        
        this.buttonBoundingBox = { x: this.x, y: this.y, width: this.width, height: this.height };
        
        this.clickCallback = clickCallback;
        
        registedButtons[this.buttonText] = this;
    }
    
    UpdatePosition(x, y) {
        this.x = x;
        this.y = y;
        
        this.UpdateBoundingBox();
    }
    
    UpdateBoundingBox() {
        this.buttonBoundingBox = { x: this.x, y: this.y, width: this.width, height: this.height };
    }
    
    Draw() {
        // Write a Draw() logic for button.
    }
    
    CheckForClick(mouseX, mouseY) {
        if(this.isInsideBoundingBox(mouseX, mouseY)) {
            this.clickCallback();
        }
    }
    
    isInsideBoundingBox(mouseX, mouseY) {
        return mouseX >= this.buttonBoundingBox.x && mouseX <= this.buttonBoundingBox.x + this.buttonBoundingBox.width && mouseY >= this.buttonBoundingBox.y && mouseY <= this.buttonBoundingBox.y + this.buttonBoundingBox.height;
    }
}

class ImpulseInfoLayer extends Layer {
    Draw() {
        if(!isGameInited || isGamePaused) return;
        
        if(impulseCouldown > 0) {
            DrawText(`Impulse couldown: ${impulseCouldown} sec.`, mouseX - 8, mouseY + 24, 14, 'Consolas', '#929292');
        } else {
            DrawText('Impulse ready to use.', mouseX - 8, mouseY + 24, 14);
        }
    }
}

class TextLayer extends Layer {
    Draw() {
        //DrawText(GAME_TITLE, 30, 30, 32);
        
        if(!isGameInited) {
            //DrawText(`Developers: Node & Minley. Latest release date: ${LAST_RELEASE_DATE} (v${LAST_RELEASE_VERSION})`, 30, 30 + 32 + 30, 14);
            //DrawText(GAME_COPYRIGHT, 24, canvas.height - 14 - 24, 14);
            
            return;
        }
        
        if(isGamePaused) {
            DrawText('Game paused.', 24, canvas.height - 14 - 24, 14);

            DrawText('Press Escape to resume.', 24, canvas.height - 14 - 24 - 14 - 24, 14, 'Consolas', '#929292');
            DrawText('Press Tab to select texture pack.', 24, canvas.height - 14 - 24 - 14 - 24 - 14 - 24, 14, 'Consolas', '#929292');
            DrawText('Press Enter to exit the game.', 24, canvas.height - 14 - 24 - 14 - 24 - 14 - 24, 14 - 24 - 14, 'Consolas', '#929292');
        }
        
        if(isGameInited && !isGamePaused) {
            //DrawText(`Snowies escaped: ${escapedSnowies}/${snowieLayer.flakeCount}, Time remaining: ${timeRemaining} sec.`, 24, canvas.height - 14 - 24, 14);
            DrawText(`Snowies escaped: ${escapedSnowies}/${snowieLayer.flakeCount}, Points balance: ${currentPoints}`, 24, canvas.height - 14 - 24, 14);
        }
    }
}

class EscapeCircleLayer extends Layer {
    initialRadius = 200;
    
    currentRadius = this.initialRadius;
    
    centerX;
    centerY;
    
    isUsed = false;
    
    InitCircle() {
        this.centerX = Math.random() * canvas.width;
        this.centerY = Math.random() * canvas.height;
        
        this.isUsed = true;
    }
    
    Draw() {
        if(!this.isUsed) return;
    }
    
    SnowieIn() {}
}

class SnowieDangerLayer extends Layer {
    startX = 0;
    startY = 0;
    
    endX = 0;
    endY = 0;
    
    rayLength = 250;
    
    Init() {
        this.UpdatePosition();
        
        this._angle = 0;
        
        setInterval(() => {
            if(isGameInited && !isGamePaused) {
                snowieLayer.SpawnFlakes();
            }
        }, 500);
    }
    
    UpdatePosition() {
        this.startX = canvas.width / 2;
        this.startY = canvas.height / 2;
    }
    
    Draw() {
        this._angle += 0.01;
        
        this.endX = this.startX + this.rayLength * Math.cos(this._angle);
        this.endY = this.startY + this.rayLength * Math.sin(this._angle);
        
        this.DrawCircleStroke();
        
        this.DrawLine();
    }
    
    DrawLine() {
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        
        ctx.stroke();
    }
    
    DrawCircleStroke() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        
        ctx.arc(this.startX, this.startY, this.rayLength, 0, Math.PI * 2);
        
        ctx.stroke();
    }
}

class SnowiePausedLayer extends Layer {
    flakes = [];
    flakeCount = 75; // By default: 75 - light snow.
    
    InitFlakes() {
        for(let i = 0; i < this.flakeCount; i++) {
            this.flakes.push(this.CreateFlake());
        }
    }
    
    CreateFlake() {
        return {
            speed: Math.random() * 1 + 0.4,
            velY: Math.random() * 1 + 0.4,
            velX: 0,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            stepSize: Math.random() / 48,
            step: 0,
            opacity: Math.random() * 0.05 + 0.4,
            textureId: Math.floor(Math.random() * 3)// + 1
        };
    }
    
    ResetFlake(flake) {
        Object.assign(flake, this.CreateFlake());
        
        flake.y = 0;
    }
    
    ResetAllFlakes() {
        this.flakes.forEach(flake => {
            Object.assign(flake, this.CreateFlake());
        });
    }
    
    Draw() {
        for(let flake of this.flakes) {
            flake.velX *= 0.98;
            flake.velX += Math.cos(flake.step += 0.05) * flake.stepSize;
            
            if(flake.velY <= flake.speed) {
                flake.velY = flake.speed;
            }
            
            flake.y += flake.velY;
            flake.x += flake.velX;
            
            if(flake.y >= canvas.height - 1 || flake.y <= 0 || flake.x >= canvas.width || flake.x <= 0) {
                this.ResetFlake(flake);
            }
            
            let texturePath = SNOWIE_TEXTURE_PATHS[selectedSnowieSkin][flake.textureId];
            
            //DrawImage(`/assets/images/Snowie/${selectedSnowieSkin}/Snow_${flake.textureId}.png`, flake.x - 4.5, flake.y - 4.5, flake.opacity);
            DrawImage(texturePath, flake.x - 4.5, flake.y - 4.5, flake.opacity);
        }
    }
}

class SnowieLayer extends Layer {
    flakes = [];
    flakeCount = 15;
    
    damping = 0.99;
    
    minDist = 250;
    maxDetectDistance = this.minDist / 2;
    
    spawnedFlakes = 0;
    
    InitFlakes() {
        //if(currentLevel >= 5) return;
        
        for(let i = 0; i < this.flakeCount; i++) {
            this.flakes.push(this.CreateFlake());
        }
    }
    
    CreateFlake() {
        return {
            specialSnowie: setTrueWithChance(0.03),
            speed: 0,
            velY: 0,
            velX: 0,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            stepSize: Math.random() / 48,
            step: 0,
            opacity: Math.random() * 0.05 + 0.4,
            textureId: Math.floor(Math.random() * 3)// + 1
        };
    }
    
    SpawnFlakes() {
        // Removed logic for Snowie Spawn Ray.
        //if(currentLevel < 5) return;
        
        if(this.spawnedFlakes >= this.flakeCount) return;
        
        let generatedFlakes = [];
        
        function SpawnCreateFlake() {
            return {
                specialSnowie: setTrueWithChance(0.03),
                speed: 0,
                velY: 0,
                velX: 0,
                x: snowieDangerLayer.endX,
                y: snowieDangerLayer.endY,
                stepSize: Math.random() / 48,
                step: 0,
                opacity: Math.random() * 0.05 + 0.4,
                textureId: Math.floor(Math.random() * 3)// + 1
            };
        }
        
        function GenerateDirection() {
            const angle = Math.random() * 2 * Math.PI;
            
            const dx = 250 * Math.cos(angle);
            const dy = 250 * Math.sin(angle);
            
            return { dx, dy };
        }
        
        function ApplyPhysicsToAll() {
            for(let flake of generatedFlakes) {
                const flakeDirection = GenerateDirection();
                
                const dx = flakeDirection.dx;
                const dy = flakeDirection.dy;
                
                const distSquared = dx * dx + dy * dy;
                
                const dist = Math.sqrt(distSquared);
                
                const xcomp = dx / dist, ycomp = dy / dist;
                
                flake.velX += 2.2 * xcomp;
                flake.velY += 2.2 * ycomp;
            }
        }
        
        let requiredFlakes = this.flakeCount;
        let spawnedFlakes = this.spawnedFlakes;
        
        let flakesToPush = Math.min(20, requiredFlakes - spawnedFlakes);
        
        for(let i = 0; i < flakesToPush; i++) {
            generatedFlakes.push(SpawnCreateFlake());
        }
        
        ApplyPhysicsToAll();
        
        snowieLayer.flakes.push(...generatedFlakes);
        
        this.spawnedFlakes += flakesToPush;
    }
    
    ResetFlake(flake) {
        const flakeIndex = this.flakes.findIndex(item => item === flake);
        
        if(flakeIndex !== -1) this.flakes.splice(flakeIndex, 1);
        
        escapedSnowies++;
        
        if(flake.specialSnowie) {
            updatePoints(1);
        }
        
        ReduceImpulseCouldown(1);
        
        if(escapedSnowies >= this.flakeCount) {
            escapedSnowiesTotal += escapedSnowies;
            
            escapedSnowies = 0;
            
            //currentLevel += 1;
            
            this.spawnedFlakes = 0;
            
            this.flakes = [];
            this.flakeCount += 20;
            
            timeRemaining += 20;
            
            this.InitFlakes();
        }
    }
    
    ResetAllFlakes() {
        this.flakes.forEach(flake => {
            Object.assign(flake, this.CreateFlake());
        });
    }
    
    Draw() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        
        ctx.rect(40, 40, canvas.width - 80, canvas.height - 80);
        
        ctx.stroke();
        
        if(!isGamePaused) {
            const { flakes, minDist, damping } = this;
            
            for(let flake of flakes) {
                const x2 = flake.x, y2 = flake.y;
                const dx = x2 - mouseX, dy = y2 - mouseY;
                
                const distSquared = dx * dx + dy * dy;
                const dist = Math.sqrt(distSquared);
                
                if(dist < minDist) {
                    const force = minDist / distSquared;
                    const xcomp = -dx / dist, ycomp = -dy / dist;
                    const deltaV = force * 1.2;
                    
                    flake.velX -= deltaV * xcomp;
                    flake.velY -= deltaV * ycomp;
                    
                    this.DrawNearestCircle(dist, mouseX, mouseY, dist);
                    this.DrawNearestLine(mouseX, mouseY, x2, y2);
                }
                
                flake.velX *= damping;
                flake.velY *= damping;
                
                flake.y += flake.velY;
                flake.x += flake.velX;
                
                if(flake.y >= canvas.height - 40 || flake.y <= 40 || flake.x >= canvas.width - 40 || flake.x <= 40) {
                    this.ResetFlake(flake);
                }
                
                let texturePath = SNOWIE_TEXTURE_PATHS[selectedSnowieSkin][flake.textureId];
                
                //DrawImage(`/assets/images/Snowie/${selectedSnowieSkin}/Snow_${flake.textureId}.png`, flake.x - 4.5, flake.y - 4.5, flake.opacity);
                DrawImage(texturePath, flake.x - 4.5, flake.y - 4.5, flake.opacity);
            }
        }
    }
    
    DrawNearestCircle(radius, centerX, centerY, distance) {
        const alpha = Math.max(0, Math.min(1, 1 - (distance / this.maxDetectDistance)));
        
        ctx.strokeStyle = `rgba(176, 229, 245, ${alpha})`;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        
        ctx.stroke();
    }
    
    DrawNearestLine(x1, y1, x2, y2) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        
        ctx.moveTo(x1, y1);
        
        ctx.lineTo(x2, y2);
        
        ctx.stroke();
    }
}

class Home_Window extends Layer {
    rectWidth = 750;
    rectHeight = 500;
    
    x = 0;
    y = 0;
    
    textLines = [
        'Change logs: Available in the Changes.txt',
        '',
        'Me on Discord: https://discord.com/LINK_IS_NOT_CREATED',
        'Me on Twicth: https://twitch.tv/node_off',
        'Me on Telegram: https://t.me/node_off',
        '',
        '♥ Thank you all, for everything!',
        '',
        'Press Tab to select texture pack.',
        'Press Space to start.'
    ];
    
    title = '';
    
    constructor() {
        super();
        
        this.UpdatePosition();
    }
    
    UpdatePosition() {
        this.x = canvas.width / 2 - this.rectWidth / 2;
        this.y = canvas.height / 2 - this.rectHeight / 2;
    }
    
    DrawWindowRect() {
        ctx.fillStyle = '#141414';
        
        ctx.strokeStyle = '#282828';
        ctx.lineWidth = 1;
        
        ctx.rect(this.x, this.y, this.rectWidth, this.rectHeight);
        
        ctx.fill();
        ctx.stroke();
    }
    
    Draw() {
        // Window
        this.DrawWindowRect();
        
        // Title
        DrawText(this.title, this.x + 16, this.y + 16, 14, 'Lucida Console');
        
        this.latestLineY = this.y + 48;
        
        this.textLines.forEach(textLine => {
            DrawText(textLine, this.x + 16, this.latestLineY, 14, 'Lucida Console');
            
            this.latestLineY += 20;
        });

        if(false) {
            this.latestLineY += 20;

            DrawText(`The game is over. You totally saved ${escapedSnowiesTotal} snowies.`, this.x + 32, this.latestLineY, 14, 'Lucida Console');
        }
        
        this.latestLineY = this.y + 48;
    }
}

class SkinSelection_Window extends Layer {
    rectWidth = 750;
    rectHeight = 500;
    
    x = 0;
    y = 0;
    
    title = '';
    
    isTextureSelection = false;
    
    constructor() {
        super();
        
        this.UpdatePosition();
    }
    
    UpdatePosition() {
        this.x = canvas.width / 2 - this.rectWidth / 2;
        this.y = canvas.height / 2 - this.rectHeight / 2;
    }
    
    DrawWindowRect() {
        ctx.fillStyle = '#141414';
        
        ctx.strokeStyle = '#282828';
        ctx.lineWidth = 1;
        
        ctx.rect(this.x, this.y, this.rectWidth, this.rectHeight);
        
        ctx.fill();
        ctx.stroke();
    }
    
    Draw() {
        // Window
        this.DrawWindowRect();
        
        // Title
        DrawText(this.title, this.x + 16, this.y + 16, 14, 'Lucida Console');
        
        this.latestLineY = this.y + 48;
        
        SNOWIE_TEXTURE_NAMES.forEach((textLine, i) => {
            this.DrawOptionLine(textLine, selectedSnowieSkin === i);
        });
        
        this.latestLineY += 20;
        
        DrawText('Press Enter to save and exit.', this.x + 16, this.latestLineY, 14, 'Lucida Console');
        
        this.latestLineY = this.y + 48;
    }
    
    DrawOptionLine(textValue, isSelected = false) {
        DrawText(isSelected ? `> ${textValue}` : `- ${textValue}`, this.x + 16, this.latestLineY, 14, 'Lucida Console', isSelected ? 'rgba(176, 229, 245, 1)' : '#fff');
        
        this.latestLineY += 20;
    }
}

class RenderLayer {
    Draw() {
        if(!isGameInited) {
            snowiePausedLayer.Draw();
            
            if(skinSelectionWindow_Layer.isTextureSelection) {
                //skinSelectionWindow_Layer.Draw();
                
                return;
            }
            
            //homeWindow_Layer.Draw();
            
            return;
        }
        
        DrawGridCrosses();
        
        //snowieDangerLayer.Draw(); // Removed.
        snowieLayer.Draw();
        
        if(skinSelectionWindow_Layer.isTextureSelection) {
            skinSelectionWindow_Layer.Draw();
        }
    }
}

const gridSize = 80;

function DrawGridCrosses() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    const startX = (0 % gridSize) - gridSize;
    const startY = (0 % gridSize) - gridSize;
    
    for (let x = startX; x < canvas.width + 16; x += gridSize) {
        for (let y = startY; y < canvas.height + 16; y += gridSize) {
            ctx.beginPath();
            
            ctx.moveTo(x, y - 8);
            ctx.lineTo(x, y + 8);
            ctx.moveTo(x - 8, y);
            ctx.lineTo(x + 8, y);
            
            ctx.stroke();
        }
    }
}

function DrawImage(url, x, y, opacity = 1) {
    if(resourceCache[url]) {
        let cachedImage = resourceCache[url];
        
        ctx.globalAlpha = opacity;
        
        ctx.drawImage(cachedImage, x, y, cachedImage.width, cachedImage.height);
        
        ctx.globalAlpha = 1;
        
        return;
    }
    
    const imageElement = new Image();
    
    imageElement.onload = () => {
        resourceCache[url] = imageElement;
    };
    
    imageElement.src = url;
}

function DrawText(text, x, y, fontSize = 20, fontName = 'Consolas', textColor = '#fff') {
    ctx.font = `${fontSize}px ${fontName}`;
    ctx.fillStyle = textColor;
    
    ctx.fillText(text, x, y + fontSize);
}

let impulseInfoLayer = new ImpulseInfoLayer();

let snowiePausedLayer = new SnowiePausedLayer();
let snowieLayer = new SnowieLayer();

let textLayer = new TextLayer();

let snowieDangerLayer = new SnowieDangerLayer();

let homeWindow_Layer = new Home_Window();

let skinSelectionWindow_Layer = new SkinSelection_Window();

const renderLayer = new RenderLayer();

function CanvasRender() {
    ClearCanvas();
    
    renderLayer.Draw();
    
    impulseInfoLayer.Draw();
    textLayer.Draw();
    
    requestAnimationFrame(CanvasRender);
}

ReCalculateCanvasSize();

function getMousePosition(e) {
    let mouseX, mouseY;
    
    if(e instanceof MouseEvent) {
        mouseX = e.offsetX || (e.clientX - canvasRect.left);
        mouseY = e.offsetY || (e.clientY - canvasRect.top);
    }
    
    return { mouseX, mouseY };
}

document.querySelectorAll('div.Item:not(.DisabledItem)').forEach(element => {
    element.addEventListener('click', () => {
        document.getElementById('actionWindow').classList.toggle('isOpen')
    });
});

document.addEventListener('DOMContentLoaded', () => {
    RegisterTimers();
    
    document.getElementById('currentPointsBalance').innerText = `You have: ${currentPoints} Points`;
    document.getElementById('releaseData').innerText = `Latest release date: ${LAST_RELEASE_DATE} (v${LAST_RELEASE_VERSION})`;
    
    snowiePausedLayer.InitFlakes();
    snowieLayer.InitFlakes();
    
    //snowieDangerLayer.Init(); // Removed.
    
    requestAnimationFrame(CanvasRender);
});

document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('click', e => {
    setTimeout(() => {
        if(!isGameInited || isGamePaused) return;
        
        if(impulseCouldown > 0) return;
        
        impulseCouldown = 40;
        
        for(let flake of snowieLayer.flakes) {
            const dx = flake.x - mouseX;
            const dy = flake.y - mouseY;
            
            const distSquared = dx * dx + dy * dy;
            
            if(distSquared < 250 * 250) {
                const dist = Math.sqrt(distSquared);
                
                const xcomp = dx / dist, ycomp = dy / dist;
                
                flake.velX += 10 * xcomp;
                flake.velY += 10 * ycomp;
            }
        }
    }, 100);
});

document.addEventListener('mousemove', e => {
    if(e instanceof MouseEvent) {
        const mousePosition = getMousePosition(e);
        
        mouseX = mousePosition.mouseX;
        mouseY = mousePosition.mouseY;
    }
});

document.addEventListener('keydown', e => {
    if(e.code === 'Escape') {
        e.preventDefault();
        
        if(isGameInited) isGamePaused = !isGamePaused;
        
        if(isGameInited) applyBlurEffect(isGamePaused);
        
        //skinSelectionWindow_Layer.isTextureSelection = false;
        //selectedSnowieSkin = savedSnowieSkin;
        
        if(isGameInited)
            document.getElementById('windows').classList.add('d-none');
        else
            document.getElementById('HomeWindow').classList.remove('isClosed');
        
        document.getElementById('PerkSelection').classList.remove('isOpen');
        document.getElementById('actionWindow').classList.remove('isOpen');
    }
    
    if(e.code === 'Space') {
        e.preventDefault();
        
        if(!isGameInited) isGameInited = true;
    }
    
    if(e.code === 'ArrowUp') {
        if(skinSelectionWindow_Layer.isTextureSelection) {
            e.preventDefault();
            
            if(selectedSnowieSkin > 0) selectedSnowieSkin--;
        }
    }
    
    if(e.code === 'ArrowDown') {
        if(skinSelectionWindow_Layer.isTextureSelection) {
            e.preventDefault();
            
            if(selectedSnowieSkin < SNOWIE_TEXTURE_PATHS.length - 1) selectedSnowieSkin++;
        }
    }
    
    if(e.code === 'Enter') {
        if(isGameInited && isGamePaused && !skinSelectionWindow_Layer.isTextureSelection) {
            e.preventDefault();
            
            ResetGame();
            
            return;
        }
        
        if(skinSelectionWindow_Layer.isTextureSelection) {
            e.preventDefault();
            
            skinSelectionWindow_Layer.isTextureSelection = false;
            savedSnowieSkin = selectedSnowieSkin;
        }
    }
    
    if(e.code === 'Tab') {
        e.preventDefault();
        
        if(!isGameInited || isGameInited && isGamePaused) {
            document.getElementById('windows').classList.toggle('d-none');
            document.getElementById('PerkSelection').classList.toggle('isOpen');
        }
    }
});

window.addEventListener('resize', () => {
    ReCalculateCanvasSize();
    
    snowiePausedLayer.ResetAllFlakes();
});

// New

function openShop() {
    document.getElementById('HomeWindow').classList.add('isClosed');
    document.getElementById('PerkSelection').classList.add('isOpen');
}

function Play() {
    document.getElementById('windows').classList.add('d-none');
    
    document.getElementById('HomeWindow').classList.add('isClosed');
    document.getElementById('PerkSelection').classList.remove('isOpen');
    document.getElementById('actionWindow').classList.remove('isOpen');
    
    initAudio();
    
    if(!isGameInited) isGameInited = true;
}

const itemList = document.getElementById('itemList');
const ActionDo_Button = document.getElementById('ActionDo_Button');

let lastActionSelected = 'NULL';

function addToItemList(title, price, callback) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'Item';

    const titleElement = document.createElement('h2');
    titleElement.textContent = title;

    const priceElement = document.createElement('p');
    priceElement.textContent = `Price: ${price === 0 ? 'Free' : price + ' Points'}`;
    
    itemDiv.onclick = () => {
        //document.getElementById('ActionTitle').innerText = title;
        //document.getElementById('actionWindow').classList.add('isOpen');
        
        if(lastActionSelected === title) {
            document.getElementById('actionWindow').classList.toggle('isOpen');
        } else {
            document.getElementById('actionWindow').classList.add('isOpen');
        }
        
        lastActionSelected = title;
        
        document.getElementById('ActionTitle').innerText = title;
        
        ActionDo_Button.onclick = callback;
    };

    itemDiv.appendChild(titleElement);
    itemDiv.appendChild(priceElement);
    
    itemList.appendChild(itemDiv);
}

SHOP_ITEMS.forEach(item => {
    addToItemList(item.Title, item.Price, item.Callback);
});
