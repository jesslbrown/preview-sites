document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle (Simplified for prototype)
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileBtn.addEventListener('click', () => {
        const isHidden = window.getComputedStyle(navLinks).display === 'none';
        navLinks.style.display = isHidden ? 'flex' : 'none';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(3, 3, 5, 0.95)';
        navLinks.style.padding = '2rem';
        navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
    });

    // 3. Scroll Fade-Up Animations using Intersection Observer
    const animatedElements = document.querySelectorAll('.fade-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // 4. Premium Guitar Canvas Animation
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let animationFrameId;

        // Configuration
        const config = {
            stringCount: 4,
            particleCount: 40,
            goldColor: 'rgba(201, 162, 80, 0.4)',
            indigoColor: 'rgba(74, 92, 255, 0.2)',
            particleColor: 'rgba(255, 255, 255, 0.15)'
        };

        let strings = [];
        let particles = [];
        let time = 0;
        let mouseX = 0;
        let mouseY = 0;

        // Track subtle mouse movement for parallax
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initElements();
        }

        function initElements() {
            strings = [];
            particles = [];

            // Initialize strings (subtle waves)
            for (let i = 0; i < config.stringCount; i++) {
                strings.push({
                    yBase: height * 0.4 + (i * height * 0.1),
                    amplitude: 20 + Math.random() * 30,
                    frequency: 0.001 + Math.random() * 0.0015,
                    speed: 0.01 + Math.random() * 0.015,
                    phase: Math.random() * Math.PI * 2,
                    color: i % 2 === 0 ? config.goldColor : config.indigoColor,
                    width: 1 + Math.random() * 1.5
                });
            }

            // Initialize particles (glowing dust)
            for (let i = 0; i < config.particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 3 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: -Math.random() * 1 - 0.2, // Drift up slowly
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            time += 1;

            // Draw particles
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around
                if (p.y < -50) p.y = height + 50;
                if (p.x < -50) p.x = width + 50;
                if (p.x > width + 50) p.x = -50;

                ctx.beginPath();
                ctx.arc(p.x - (mouseX * 20), p.y - (mouseY * 20), p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.5})`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = config.goldColor;
                ctx.fill();
                ctx.shadowBlur = 0; // reset
            });

            // Draw strings (subtle curves)
            strings.forEach((s, index) => {
                ctx.beginPath();
                ctx.moveTo(0, s.yBase);
                
                // Subtle parallax offset
                const yOffset = mouseY * 30 * (index * 0.5);

                for (let x = 0; x <= width; x += 20) {
                    const y = s.yBase + yOffset + Math.sin(x * s.frequency + time * s.speed + s.phase) * s.amplitude;
                    ctx.lineTo(x, y);
                }

                ctx.strokeStyle = s.color;
                ctx.lineWidth = s.width;
                
                // Add soft glow to strings
                ctx.shadowBlur = 20;
                ctx.shadowColor = s.color;
                ctx.stroke();
                ctx.shadowBlur = 0; // reset
            });

            animationFrameId = requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize);
        resize();
        draw();
    }
});
