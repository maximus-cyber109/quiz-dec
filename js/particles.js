// =================================
// 3D SNOW PARTICLE SYSTEM
// =================================

class SnowParticles {
    constructor() {
        this.canvas = document.getElementById('snow-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.particleCount = 200;
        
        this.init();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Create particles
        this.createParticles();

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);

        // Handle resize
        window.addEventListener('resize', () => this.onResize());

        // Start animation
        this.animate();
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];

        for (let i = 0; i < this.particleCount; i++) {
            // Random position
            positions.push(
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10
            );

            // Random velocity
            velocities.push({
                x: (Math.random() - 0.5) * 0.02,
                y: -Math.random() * 0.05 - 0.02,
                z: (Math.random() - 0.5) * 0.02
            });
        }

        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        );

        // Create material
        const material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        // Create particle system
        const particleSystem = new THREE.Points(geometry, material);
        this.scene.add(particleSystem);

        this.particles = { system: particleSystem, velocities };
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update particle positions
        const positions = this.particles.system.geometry.attributes.position.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Update position based on velocity
            positions[i3] += this.particles.velocities[i].x;
            positions[i3 + 1] += this.particles.velocities[i].y;
            positions[i3 + 2] += this.particles.velocities[i].z;

            // Reset particle if it goes below viewport
            if (positions[i3 + 1] < -10) {
                positions[i3] = Math.random() * 20 - 10;
                positions[i3 + 1] = 10;
                positions[i3 + 2] = Math.random() * 20 - 10;
            }

            // Wrap around horizontally
            if (positions[i3] < -10) positions[i3] = 10;
            if (positions[i3] > 10) positions[i3] = -10;
            if (positions[i3 + 2] < -10) positions[i3 + 2] = 10;
            if (positions[i3 + 2] > 10) positions[i3 + 2] = -10;
        }

        this.particles.system.geometry.attributes.position.needsUpdate = true;

        // Rotate particle system slightly
        this.particles.system.rotation.y += 0.001;

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Initialize snow particles when DOM is ready
let snowParticles;
document.addEventListener('DOMContentLoaded', () => {
    snowParticles = new SnowParticles();
});
