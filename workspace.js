'use strict';

const canvas = document.getElementById('iSnowie');
const ctx = canvas.getContext('2d');

const impulseRadius = 250;

let currentState = 0;

let escapedSnowies = 0;

let timeRemaining = 80;

let impulseCouldown = 0;

let isGameStarted = false;
let isPaused = false;

//let musicAudio = new Audio('Untitled.wav');

//musicAudio.loop = true;

function TakeImpulseCoultdown(value) {
	if(impulseCouldown > 0) {
		impulseCouldown -= value;
	}
}

function ReCalculateCanvasSize() {
    canvas.width = window.innerWidth - 500; // FIX: Resulution problems after adding console.
    canvas.height = window.innerHeight;
	
	snowLayer.resetAllFlakes();
	snowIdleLayer.resetAllFlakes();
	
	skinSelectionLayer.UpdatePosition();
}

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
	window.setTimeout(callback, 1000 / 60);
};

function RegisterTimers() {
	setInterval(() => {
		if(!isGameStarted) return;

		timeRemaining--;

		TakeImpulseCoultdown(1);

		if(timeRemaining <= 0) {
			escapedSnowies = 0;
			
			timeRemaining = 80;
			
			snowLayer.flakeCount = 15;
			
			impulseCouldown = 0;
			
			snowLayer.flakes = [];
			snowLayer.initFlakes();
			
			// Music reset.
			//musicAudio.currentTime = 0;
			//musicAudio.pause();
			
			isGameStarted = false;
			
			document.removeEventListener('click', ImpulseRun);
		}
	}, 1000);
}

window.requestAnimationFrame = requestAnimationFrame;

Number.prototype.clamp = function(min, max) {
	return Math.min(Math.max(this, min), max);
};

class Layer {
    Draw() {}
}

class TextLayer extends Layer {
    Draw() {
        DrawText('Escape Snowie!', 20, 20);
        DrawText('Copyright Node, 2024 (December LOL). All rights reserved.', 20, 60, 14);

        DrawText(`Snowies escaped: ${escapedSnowies}/${snowLayer.flakeCount} / Time Remaining: ${timeRemaining}`, 20, canvas.height - 34, 14);
		
		if(!isGameStarted || isPaused) return;
		
		if(impulseCouldown > 0)
			DrawText(`Impulse couldown: ${impulseCouldown}`, snowLayer.mouseX - 8, snowLayer.mouseY + 24, 14, '#696969');
		else
			DrawText(`Impulse ready to use.`, snowLayer.mouseX - 8, snowLayer.mouseY + 24, 14);
    }
}

// To store registered buttons.
let buttons = {};

function CanvasClickEventHandle(e) {
    const mousePosition = getMousePosition(e);
	
	if(isGameStarted) return;
	
	Object.values(buttons).forEach(button => {
		if(button.clickCallback) {
			button.clickPerformed(mousePosition.mouseX, mousePosition.mouseY);
		}
    });
}

document.addEventListener('click', e => CanvasClickEventHandle(e));

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
		
		buttons[this.buttonText] = this;
	}
	
	UpdatePosition(x, y) {
		this.x = x;
		this.y = y;
		
		this.UpdateBoundingBox();
	}
	
	UpdateBoundingBox() {
		this.buttonBoundingBox = { x: this.x, y: this.y, width: this.width, height: this.height };
	}
	
	clickPerformed(mouseX, mouseY) {
		if (this.isInsideBoundingBox(mouseX, mouseY)) {
			this.clickCallback();
		}
    }
	
	isInsideBoundingBox(mouseX, mouseY) {
        return mouseX >= this.buttonBoundingBox.x && mouseX <= this.buttonBoundingBox.x + this.buttonBoundingBox.width && mouseY >= this.buttonBoundingBox.y && mouseY <= this.buttonBoundingBox.y + this.buttonBoundingBox.height;
    }
	
	Draw() {
		ctx.fillStyle = '#878787';
		
		ctx.fillRect(this.x, this.y, this.width, this.height);
		
		DrawText(this.buttonText, this.x + 8, this.y + 5, 14);
	}
}

class SkinSelectionLayer extends Layer {
	rectWidth = 750;
	rectHeight = 500;
	
	x = 0;
	y = 0;
	
	title = 'Escape Snowie!';
	
	constructor() {
		super();
		
		this.button1 = new Button('Simple Button', this.x, this.y, 140, 30, () => {
			// Some code...
			//window.open('', '_blank');
		});
		
		this.button2 = new Button('Начать', this.x, this.y, 140, 30, () => {
			// Some code...
			isGameStarted = true;
			isPaused = false;
			RegisterGameEv();
			//musicAudio.play();
		});
		
		this.button3 = new Button('Настройки', this.x, this.y, 140, 30, () => {
			// Some code...
		});
	}
	
	UpdatePosition() {
		this.x = canvas.width / 2 - this.rectWidth / 2;
		this.y = canvas.height / 2 - this.rectHeight / 2;
		
		this.button1.UpdatePosition(this.x + 16, this.y + 16 + 14 + 16 + 30 + 14);
		this.button2.UpdatePosition(this.x + 16, this.y + 16 + 14 + 16 + 30);
		this.button3.UpdatePosition(this.x + 16, this.y + 16 + 14 + 16 + 30 + 30);
	}
	
	Draw() {
		ctx.fillStyle = '#141414';
		ctx.strokeStyle = '#282828';
		
		ctx.rect(this.x, this.y, this.rectWidth, this.rectHeight);
		
		ctx.fill();
		ctx.stroke();
		
		//DrawText(this.title, this.x + 16, this.y + 16, 14);
		
		DrawText('Game paused, just press Enter again to resume the game.', this.x + 14, this.y + 16 + 14 + 16 + 14, 14);
		
		//this.button1.Draw();
		//this.button2.Draw();
		//this.button3.Draw();
	}
}

class SnowIdleLayer extends Layer {
	flakes = [];
	flakeCount = 75; // По умолчанию: 75 - легкий снег.
	
	initFlakes() {
        for (let i = 0; i < this.flakeCount; i++) {
            this.flakes.push(this.createFlake());
        }
    }
	
	createFlake() {
        return {
            speed: Math.random() * 1 + 0.4,
            velY: Math.random() * 1 + 0.4,
            velX: 0,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            stepSize: Math.random() / 48,
            step: 0,
            opacity: Math.random() * 0.1 + 0.3,
            textureId: Math.floor(Math.random() * 3) + 1
        };
    }
	
	resetFlake(flake) {
        Object.assign(flake, this.createFlake());
		
        flake.y = 0;
    }
	
	resetAllFlakes() {
		this.flakes.forEach(flakeItem => {
			Object.assign(flakeItem, this.createFlake());
		});
	}
	
	Draw() {
        for (let flake of this.flakes) {
			flake.velX *= 0.98;
			flake.velX += Math.cos(flake.step += 0.05) * flake.stepSize;
			
			if (flake.velY <= flake.speed) {
				flake.velY = flake.speed;
			}
            
            flake.y += flake.velY;
            flake.x += flake.velX;

            if (flake.y >= canvas.height || flake.y <= 0 || flake.x >= canvas.width || flake.x <= 0) {
                this.resetFlake(flake);
            }
			
			DrawImage(`/assets/images/Snow/Snow_${flake.textureId}.png`, flake.x, flake.y, flake.opacity);
        }
    }
}

class SnowLayer extends Layer {
	flakes = [];
	flakeCount = 15;
	
	damping = 0.99;
	
	minDist = 250;
	
	//maxDetectDistance = this.minDist / 2;
	
	mouseX = -this.minDist;
	mouseY = -this.minDist;
	
	initFlakes() {
        for (let i = 0; i < this.flakeCount; i++) {
            this.flakes.push(this.createFlake());
        }
    }
	
	createFlake() {
        return {
            speed: 0,
            velY: 0,
            velX: 0,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            stepSize: Math.random() / 48,
            step: 0,
            opacity: Math.random() * 0.1 + 0.3,
            textureId: Math.floor(Math.random() * 3) + 1
        };
    }
	
	resetFlake(flake) {
		const flakeIndex = this.flakes.findIndex(item => item === flake);
		
		if(flakeIndex !== -1) this.flakes.splice(flakeIndex, 1);
		
		escapedSnowies++;
		
		TakeImpulseCoultdown(1);
		
		if(escapedSnowies >= this.flakeCount) {
			this.flakeCount += 20;
			
			timeRemaining += 20;
			
			escapedSnowies = 0;
			
			this.initFlakes();
		}
    }
	
	resetAllFlakes() {
		this.flakes.forEach(flakeItem => {
			Object.assign(flakeItem, this.createFlake());
		});
	}
	
	DrawNearestCircle(radius, centerX, centerY, distance) {
		const alpha = Math.max(0, Math.min(1, 1 - (distance / this.maxDetectDistance)));
		
		ctx.strokeStyle = `rgba(176, 229, 245, ${alpha})`;
		ctx.lineWidth = 2;

		ctx.beginPath();
		
		ctx.arc(centerX, centerY, radius.clamp(16, this.minDist), 0, Math.PI * 2);
		
		ctx.stroke();
	}
	
	DrawNearestLine(x1, y1, x2, y2) {
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
		ctx.lineWidth = 2;
		
		ctx.beginPath();
		
		ctx.moveTo(x1, y1);
		
		ctx.lineTo(x2, y2);
		
		ctx.stroke();
	}
	
	Draw() {
        const { flakes, minDist, mouseX, mouseY } = this;

        for (let flake of flakes) {
			const x2 = flake.x, y2 = flake.y;
			const dx = x2 - mouseX, dy = y2 - mouseY;
			
			const distSquared = dx * dx + dy * dy;
			const dist = Math.sqrt(distSquared);
			
			if (dist < minDist) {
				if(isPaused) return;
				
				const force = minDist / distSquared;
				const xcomp = -dx / dist, ycomp = -dy / dist;
				const deltaV = force * 1.2;
				
				flake.velX -= (deltaV * xcomp);
				flake.velY -= (deltaV * ycomp);
				
				this.DrawNearestCircle(dist, mouseX, mouseY, dist);
				this.DrawNearestLine(mouseX, mouseY, x2, y2);
			}
			
			flake.velX *= this.damping;
			flake.velY *= this.damping;
            
            flake.y += flake.velY;
            flake.x += flake.velX;

            if (flake.y >= canvas.height || flake.y <= 0 || flake.x >= canvas.width || flake.x <= 0) {
                this.resetFlake(flake);
            }
			
			DrawImage(`/assets/images/Snow/Snow_${flake.textureId}.png`, flake.x, flake.y, flake.opacity);
        }
    }
}

function ClearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// For image caching.
let resourceCache = {};

function DrawClearImage(imageItself, x, y, width, height, opacity) {
	ctx.globalAlpha = opacity;
	
	ctx.drawImage(imageItself, x, y, width, height);
	
	ctx.globalAlpha = 1;
}

// Update: Added opacity option.
function DrawImage(url, x, y, opacity = 1) {
    if(resourceCache[url]) {
        let cachedImage = resourceCache[url];
		
		DrawClearImage(cachedImage, x, y, cachedImage.width, cachedImage.height, opacity);

        return;
    }

    const imageElement = new Image();

    imageElement.onload = () => {
        resourceCache[url] = imageElement;
		
		DrawClearImage(imageElement, x, y, imageElement.width, imageElement.height, opacity);
    };

    imageElement.src = url;
}

function DrawText(text, x, y, fontSize = 20, textColor = '#fff') {
    ctx.font = `${fontSize}px Consolas`;
    ctx.fillStyle = textColor;

    ctx.fillText(text, x, y + fontSize)
}

const textLayer = new TextLayer();
const skinSelectionLayer = new SkinSelectionLayer();
const snowIdleLayer = new SnowIdleLayer();
const snowLayer = new SnowLayer();

snowIdleLayer.initFlakes();

function CanvasRender() {
    ClearCanvas();
	
	if(!isGameStarted) {
		snowIdleLayer.Draw();
		
		if(isPaused) skinSelectionLayer.Draw();
		
		DrawText('Escape Snowie!', 30, 30, 32);
		
		DrawText('Copyright Node, 2024. All rights reserved.', 24, canvas.height - 14 - 24, 14);
	} else {
		snowLayer.Draw();
		textLayer.Draw();
	}
	
	requestAnimationFrame(CanvasRender);
}

ReCalculateCanvasSize();

function getMousePosition(e) {
    let mouseX, mouseY;

    if(e instanceof TouchEvent) {
        // Removed.
    } else {
        mouseX = e.offsetX !== undefined ? e.offsetX ?? 0 : e.clientX - canvasRect.left;
        mouseY = e.offsetY !== undefined ? e.offsetY ?? 0 : e.clientY - canvasRect.top;
    }

    return { mouseX, mouseY };
}

document.addEventListener('DOMContentLoaded', () => {
	snowLayer.initFlakes();
	
	requestAnimationFrame(CanvasRender);
});

document.addEventListener('mousemove', e => {
	if(e instanceof MouseEvent) {
		const mousePosition = getMousePosition(e);
		
		snowLayer.mouseX = mousePosition.mouseX;
		snowLayer.mouseY = mousePosition.mouseY;
	}
});

const ImpulseRun = (event) => {
	let e = event;
	
	let mousePosition = getMousePosition(e);
	
	if(!isGameStarted) return;
	
	if(impulseCouldown > 0) return;
	
	impulseCouldown = 40;
	
	for (let flake of snowLayer.flakes) {
		const dx = flake.x - mousePosition.mouseX;
		const dy = flake.y - mousePosition.mouseY;
		const distSquared = dx * dx + dy * dy;

		if (distSquared < impulseRadius * impulseRadius) {
			const dist = Math.sqrt(distSquared);
			const force = 10;
			const xcomp = dx / dist, ycomp = dy / dist;

			flake.velX += (force * xcomp);
			flake.velY += (force * ycomp);
		}
	}
}

function RegisterGameEv() {
	document.addEventListener('click', ImpulseRun);
}

window.addEventListener('resize', () => ReCalculateCanvasSize());
