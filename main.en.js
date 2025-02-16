'use strict';

const GAME_TITLE = 'Escape Snowie!';
const GAME_COPYRIGHT = '© Node, 2024–2025. All rights reserved.';

const LAST_RELEASE_DATE = 'February 16, 2025 y.';
const LAST_RELEASE_VERSION = '1.0.8';

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
        Title: 'Epic Fluffy Textures',
        Price: 0,
        Callback: () => { selectedSnowieSkin = 3; localStorage.setItem('selectedSnowieSkin', 3); }
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
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/3/Snow_1.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/3/Snow_2.png?raw=true',
        'https://github.com/node-official/EscapeSnowie_Textures/blob/main/Snowie/3/Snow_3.png?raw=true'
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
        if(isGamePaused) {
            DrawText('Game paused.', 24, canvas.height - 14 - 24, 14);

            DrawText('Press Escape to resume.', 24, canvas.height - 14 - 24 - 14 - 24, 14, 'Consolas', '#929292');
            DrawText('Press Tab to select texture pack.', 24, canvas.height - 14 - 24 - 14 - 24 - 14 - 24, 14, 'Consolas', '#929292');
            DrawText('Press Enter to exit the game.', 24, canvas.height - 14 - 24 - 14 - 24 - 14 - 24, 14 - 24 - 14, 'Consolas', '#929292');
        }
        
        if(isGameInited && !isGamePaused) {
            DrawText(`Snowies escaped: ${escapedSnowies}/${snowieLayer.flakeCount}, Points balance: ${currentPoints}`, 24, canvas.height - 14 - 24, 14);
        }
    }
}

class SnowiePausedLayer extends Layer {
    flakes = [];
    flakeCount = 75;
    
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
            textureId: Math.floor(Math.random() * 3)
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
            textureId: Math.floor(Math.random() * 3)
        };
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

class RenderLayer {
    Draw() {
        if(!isGameInited) {
            snowiePausedLayer.Draw();
            
            return;
        }
        
        DrawGridCrosses();
        
        snowieLayer.Draw();
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
        
        if(isGameInited)
            document.getElementById('windows').classList.add('d-none');
        else
            document.getElementById('HomeWindow').classList.remove('isClosed');
        
        document.getElementById('PerkSelection').classList.remove('isOpen');
        document.getElementById('actionWindow').classList.remove('isOpen');
    }
    
    if(e.code === 'Enter') {
        if(isGameInited && isGamePaused) {
            e.preventDefault();
            
            ResetGame();
            
            return;
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
