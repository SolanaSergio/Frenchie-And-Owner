/**
 * Texture Generator for Park Scene
 * 
 * This script generates procedural textures for the park scene
 * using node-canvas to create PBR texture sets.
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Generate a random number between min and max
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Generate noise
function generateNoise(canvas, ctx, scale = 1, octaves = 4, persistence = 0.5, lacunarity = 2) {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Simple noise function (could be replaced with a better one)
    function noise(nx, ny) {
        // Convert to 0-1 range
        return Math.random();
    }
    
    // Generate fractal noise
    function fractalNoise(x, y) {
        let amplitude = 1;
        let frequency = 1;
        let noiseValue = 0;
        let maxValue = 0;
        
        for (let i = 0; i < octaves; i++) {
            const sampleX = x * frequency * scale;
            const sampleY = y * frequency * scale;
            
            noiseValue += noise(sampleX, sampleY) * amplitude;
            maxValue += amplitude;
            
            amplitude *= persistence;
            frequency *= lacunarity;
        }
        
        // Normalize
        return noiseValue / maxValue;
    }
    
    // Fill the canvas with noise
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const nx = x / width;
            const ny = y / height;
            
            const value = fractalNoise(nx, ny);
            const index = (y * width + x) * 4;
            
            data[index] = value * 255;     // R
            data[index + 1] = value * 255; // G
            data[index + 2] = value * 255; // B
            data[index + 3] = 255;         // A
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

// Generate grass textures
function generateGrassTextures() {
    console.log('Generating grass textures...');
    const size = 1024;
    
    // Color map
    const colorCanvas = createCanvas(size, size);
    const colorCtx = colorCanvas.getContext('2d');
    
    // Base green color
    colorCtx.fillStyle = '#4a8c3d';
    colorCtx.fillRect(0, 0, size, size);
    
    // Add variation
    for (let i = 0; i < 10000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = 1 + Math.random() * 3;
        
        // Random green variation
        const r = 60 + Math.random() * 40;
        const g = 120 + Math.random() * 60;
        const b = 40 + Math.random() * 40;
        
        colorCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        colorCtx.beginPath();
        colorCtx.arc(x, y, radius, 0, Math.PI * 2);
        colorCtx.fill();
    }
    
    // Add some grass blades
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const length = 5 + Math.random() * 15;
        const width = 1 + Math.random() * 2;
        const angle = Math.random() * Math.PI;
        
        // Random green for grass blade
        const r = 50 + Math.random() * 40;
        const g = 130 + Math.random() * 60;
        const b = 30 + Math.random() * 40;
        
        colorCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        colorCtx.save();
        colorCtx.translate(x, y);
        colorCtx.rotate(angle);
        colorCtx.fillRect(-width/2, -length/2, width, length);
        colorCtx.restore();
    }
    
    // Normal map
    const normalCanvas = createCanvas(size, size);
    const normalCtx = normalCanvas.getContext('2d');
    
    // Fill with neutral normal (128, 128, 255)
    normalCtx.fillStyle = '#8080ff';
    normalCtx.fillRect(0, 0, size, size);
    
    // Add some normal variation
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = 2 + Math.random() * 5;
        
        // Random normal variation
        const nx = 128 + (Math.random() - 0.5) * 40;
        const ny = 128 + (Math.random() - 0.5) * 40;
        
        normalCtx.fillStyle = `rgb(${nx}, ${ny}, 255)`;
        normalCtx.beginPath();
        normalCtx.arc(x, y, radius, 0, Math.PI * 2);
        normalCtx.fill();
    }
    
    // Roughness map
    const roughnessCanvas = createCanvas(size, size);
    const roughnessCtx = roughnessCanvas.getContext('2d');
    
    // Base roughness (grass is quite rough)
    roughnessCtx.fillStyle = '#c0c0c0'; // ~0.75 roughness
    roughnessCtx.fillRect(0, 0, size, size);
    
    // Add roughness variation
    for (let i = 0; i < 8000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = 2 + Math.random() * 6;
        
        // Random roughness variation
        const r = 160 + (Math.random() - 0.5) * 60;
        
        roughnessCtx.fillStyle = `rgb(${r}, ${r}, ${r})`;
        roughnessCtx.beginPath();
        roughnessCtx.arc(x, y, radius, 0, Math.PI * 2);
        roughnessCtx.fill();
    }
    
    // Displacement map
    const displacementCanvas = createCanvas(size, size);
    const displacementCtx = displacementCanvas.getContext('2d');
    
    // Generate noise for displacement
    generateNoise(displacementCanvas, displacementCtx, 4, 6, 0.6, 2);
    
    // Save the textures
    const grassDir = path.join(__dirname, 'textures');
    ensureDirectoryExists(grassDir);
    
    fs.writeFileSync(path.join(grassDir, 'grass_color.jpg'), colorCanvas.toBuffer('image/jpeg'));
    fs.writeFileSync(path.join(grassDir, 'grass_normal.jpg'), normalCanvas.toBuffer('image/jpeg'));
    fs.writeFileSync(path.join(grassDir, 'grass_roughness.jpg'), roughnessCanvas.toBuffer('image/jpeg'));
    fs.writeFileSync(path.join(grassDir, 'grass_displacement.jpg'), displacementCanvas.toBuffer('image/jpeg'));
    
    console.log('Grass textures generated successfully');
}

// Generate bark textures
function generateBarkTextures() {
    console.log('Generating bark textures...');
    const size = 1024;
    
    // Color map
    const colorCanvas = createCanvas(size, size);
    const colorCtx = colorCanvas.getContext('2d');
    
    // Base brown color
    colorCtx.fillStyle = '#8B4513';
    colorCtx.fillRect(0, 0, size, size);
    
    // Add vertical bark lines
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * size;
        const width = 10 + Math.random() * 30;
        
        // Random bark color variation
        const r = 110 + Math.random() * 40;
        const g = 60 + Math.random() * 30;
        const b = 20 + Math.random() * 20;
        
        colorCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        colorCtx.fillRect(x, 0, width, size);
    }
    
    // Add bark cracks and details
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const length = 50 + Math.random() * 150;
        const width = 2 + Math.random() * 5;
        
        // Random dark color for cracks
        const value = 30 + Math.random() * 40;
        
        colorCtx.fillStyle = `rgb(${value}, ${value/2}, ${value/3})`;
        colorCtx.fillRect(x, y, width, length);
    }
    
    // Normal map
    const normalCanvas = createCanvas(size, size);
    const normalCtx = normalCanvas.getContext('2d');
    
    // Fill with neutral normal (128, 128, 255)
    normalCtx.fillStyle = '#8080ff';
    normalCtx.fillRect(0, 0, size, size);
    
    // Add vertical normal lines for bark texture
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * size;
        const width = 10 + Math.random() * 30;
        
        // Random normal variation for bark ridges
        const nx = 128 + (Math.random() - 0.5) * 100;
        
        normalCtx.fillStyle = `rgb(${nx}, 128, 255)`;
        normalCtx.fillRect(x, 0, width, size);
    }
    
    // Roughness map
    const roughnessCanvas = createCanvas(size, size);
    const roughnessCtx = roughnessCanvas.getContext('2d');
    
    // Base roughness (bark is rough)
    roughnessCtx.fillStyle = '#e0e0e0'; // ~0.88 roughness
    roughnessCtx.fillRect(0, 0, size, size);
    
    // Add roughness variation for bark
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const length = 50 + Math.random() * 150;
        const width = 5 + Math.random() * 15;
        
        // Random roughness variation
        const r = 200 + (Math.random() - 0.5) * 55;
        
        roughnessCtx.fillStyle = `rgb(${r}, ${r}, ${r})`;
        roughnessCtx.fillRect(x, y, width, length);
    }
    
    // Save the textures
    const barkDir = path.join(__dirname, 'textures');
    ensureDirectoryExists(barkDir);
    
    fs.writeFileSync(path.join(barkDir, 'bark_color.jpg'), colorCanvas.toBuffer('image/jpeg'));
    fs.writeFileSync(path.join(barkDir, 'bark_normal.jpg'), normalCanvas.toBuffer('image/jpeg'));
    fs.writeFileSync(path.join(barkDir, 'bark_roughness.jpg'), roughnessCanvas.toBuffer('image/jpeg'));
    
    console.log('Bark textures generated successfully');
}

// Generate stone textures
function generateStoneTextures() {
    console.log('Generating stone textures...');
    const size = 1024;
    
    // Color map
    const colorCanvas = createCanvas(size, size);
    const colorCtx = colorCanvas.getContext('2d');
    
    // Base stone color
    colorCtx.fillStyle = '#888888';
    colorCtx.fillRect(0, 0, size, size);
    
    // Add stone pattern
    for (let i = 0; i < 300; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const width = 20 + Math.random() * 60;
        const height = 20 + Math.random() * 60;
        
        // Random stone color variation
        const value = 120 + Math.random() * 50;
        
        colorCtx.fillStyle = `rgb(${value}, ${value}, ${value})`;
        colorCtx.beginPath();
        colorCtx.ellipse(x, y, width/2, height/2, 0, 0, Math.PI * 2);
        colorCtx.fill();
        
        // Add stone edges
        colorCtx.strokeStyle = '#666666';
        colorCtx.lineWidth = 1 + Math.random() * 2;
        colorCtx.stroke();
    }
    
    // Normal map
    const normalCanvas = createCanvas(size, size);
    const normalCtx = normalCanvas.getContext('2d');
    
    // Fill with neutral normal (128, 128, 255)
    normalCtx.fillStyle = '#8080ff';
    normalCtx.fillRect(0, 0, size, size);
    
    // Add normal variation for stones
    for (let i = 0; i < 300; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const width = 20 + Math.random() * 60;
        const height = 20 + Math.random() * 60;
        
        // Random normal variation
        const nx = 128 + (Math.random() - 0.5) * 60;
        const ny = 128 + (Math.random() - 0.5) * 60;
        
        normalCtx.fillStyle = `rgb(${nx}, ${ny}, 255)`;
        normalCtx.beginPath();
        normalCtx.ellipse(x, y, width/2, height/2, 0, 0, Math.PI * 2);
        normalCtx.fill();
    }
    
    // Roughness map
    const roughnessCanvas = createCanvas(size, size);
    const roughnessCtx = roughnessCanvas.getContext('2d');
    
    // Base roughness (stone is moderately rough)
    roughnessCtx.fillStyle = '#c8c8c8'; // ~0.78 roughness
    roughnessCtx.fillRect(0, 0, size, size);
    
    // Add roughness variation for stones
    for (let i = 0; i < 300; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const width = 20 + Math.random() * 60;
        const height = 20 + Math.random() * 60;
        
        // Random roughness variation
        const r = 180 + (Math.random() - 0.5) * 50;
        
        roughnessCtx.fillStyle = `rgb(${r}, ${r}, ${r})`;
        roughnessCtx.beginPath();
        roughnessCtx.ellipse(x, y, width/2, height/2, 0, 0, Math.PI * 2);
        roughnessCtx.fill();
    }
    
    // Save the textures
    const stoneDir = path.join(__dirname, 'textures');
    ensureDirectoryExists(stoneDir);
    
    fs.writeFileSync(path.join(stoneDir, 'stone_color.jpg'), colorCanvas.toBuffer('image/jpeg'));
    fs.writeFileSync(path.join(stoneDir, 'stone_normal.jpg'), normalCanvas.toBuffer('image/jpeg'));
    fs.writeFileSync(path.join(stoneDir, 'stone_roughness.jpg'), roughnessCanvas.toBuffer('image/jpeg'));
    
    console.log('Stone textures generated successfully');
}

// Generate wood textures
function generateWoodTextures() {
    console.log('Generating wood textures...');
    const size = 1024;
    
    // Color map
    const colorCanvas = createCanvas(size, size);
    const colorCtx = colorCanvas.getContext('2d');
    
    // Base wood color
    colorCtx.fillStyle = '#C19A6B';
    colorCtx.fillRect(0, 0, size, size);
    
    // Add wood grain
    for (let i = 0; i < 40; i++) {
        const y = i * (size / 40) + (Math.random() - 0.5) * 10;
        const width = size;
        const height = 5 + Math.random() * 15;
        
        // Random wood color variation
        const r = 180 + (Math.random() - 0.5) * 30;
        const g = 140 + (Math.random() - 0.5) * 30;
        const b = 90 + (Math.random() - 0.5) * 30;
        
        colorCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        colorCtx.fillRect(0, y, width, height);
    }
    
    // Add wood knots
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = 10 + Math.random() * 20;
        
        // Darker color for knots
        const r = 140 + (Math.random() - 0.5) * 30;
        const g = 100 + (Math.random() - 0.5) * 30;
        const b = 60 + (Math.random() - 0.5) * 30;
        
        // Draw knot
        colorCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        colorCtx.beginPath();
        colorCtx.arc(x, y, radius, 0, Math.PI * 2);
        colorCtx.fill();
        
        // Draw rings around knot
        for (let j = 0; j < 3; j++) {
            const ringRadius = radius + j * 5 + Math.random() * 5;
            
            colorCtx.strokeStyle = `rgb(${r-20*j}, ${g-20*j}, ${b-20*j})`;
            colorCtx.lineWidth = 2 + Math.random() * 2;
            colorCtx.beginPath();
            colorCtx.arc(x, y, ringRadius, 0, Math.PI * 2);
            colorCtx.stroke();
        }
    }
    
    // Normal map
    const normalCanvas = createCanvas(size, size);
    const normalCtx = normalCanvas.getContext('2d');
    
    // Fill with neutral normal (128, 128, 255)
    normalCtx.fillStyle = '#8080ff';
    normalCtx.fillRect(0, 0, size, size);
    
    // Add normal variation for wood grain
    for (let i = 0; i < 40; i++) {
        const y = i * (size / 40) + (Math.random() - 0.5) * 10;
        const width = size;
        const height = 5 + Math.random() * 15;
        
        // Random normal variation for grain
        const nx = 128;
        const ny = 128 + (Math.random() - 0.5) * 40;
        
        normalCtx.fillStyle = `rgb(${nx}, ${ny}, 255)`;
        normalCtx.fillRect(0, y, width, height);
    }
    
    // Add normal variation for knots
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = 10 + Math.random() * 20;
        
        // Create bump effect for knots
        normalCtx.fillStyle = `rgb(128, 128, 200)`;
        normalCtx.beginPath();
        normalCtx.arc(x, y, radius, 0, Math.PI * 2);
        normalCtx.fill();
        
        // Create rings around knot
        for (let j = 0; j < 3; j++) {
            const ringRadius = radius + j * 5 + Math.random() * 5;
            
            normalCtx.strokeStyle = `rgb(128, 128, ${220 - j * 20})`;
            normalCtx.lineWidth = 2 + Math.random() * 2;
            normalCtx.beginPath();
            normalCtx.arc(x, y, ringRadius, 0, Math.PI * 2);
            normalCtx.stroke();
        }
    }
    
    // Roughness map
    const roughnessCanvas = createCanvas(size, size);
    const roughnessCtx = roughnessCanvas.getContext('2d');
    
    // Base roughness (wood is moderately rough)
    roughnessCtx.fillStyle = '#b0b0b0'; // ~0.69 roughness
    roughnessCtx.fillRect(0, 0, size, size);
    
    // Add roughness variation for wood grain
    for (let i = 0; i < 40; i++) {
        const y = i * (size / 40) + (Math.random() - 0.5) * 10;
        const width = size;
        const height = 5 + Math.random() * 15;
        
        // Random roughness variation
        const r = 160 + (Math.random() - 0.5) * 30;
        
        roughnessCtx.fillStyle = `rgb(${r}, ${r}, ${r})`;
        roughnessCtx.fillRect(0, y, width, height);
    }
    
    // Add roughness variation for knots (knots are smoother)
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = 10 + Math.random() * 20;
        
        // Knots are smoother
        const r = 140 + (Math.random() - 0.5) * 30;
        
        roughnessCtx.fillStyle = `rgb(${r}, ${r}, ${r})`;
        roughnessCtx.beginPath();
        roughnessCtx.arc(x, y, radius, 0, Math.PI * 2);
        roughnessCtx.fill();
    }
    
    // Save the textures
    const woodDir = path.join(__dirname, 'textures');
    ensureDirectoryExists(woodDir);
    
    fs.writeFileSync(path.join(woodDir, 'wood_color.jpg'), colorCanvas.toBuffer('image/jpeg'));
    fs.writeFileSync(path.join(woodDir, 'wood_normal.jpg'), normalCanvas.toBuffer('image/jpeg'));
    fs.writeFileSync(path.join(woodDir, 'wood_roughness.jpg'), roughnessCanvas.toBuffer('image/jpeg'));
    
    console.log('Wood textures generated successfully');
}

// Main function
function main() {
    console.log('Starting texture generation...');
    
    try {
        // Install canvas if not already installed
        console.log('Note: This script requires the "canvas" npm package.');
        console.log('If not installed, run: npm install canvas');
        
        // Generate all textures
        generateGrassTextures();
        generateBarkTextures();
        generateStoneTextures();
        generateWoodTextures();
        
        console.log('All textures generated successfully!');
    } catch (error) {
        console.error('Error generating textures:', error);
    }
}

// Run the main function
main(); 