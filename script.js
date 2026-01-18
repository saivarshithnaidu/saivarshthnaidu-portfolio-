document.addEventListener('DOMContentLoaded', () => {

    // --- INTRO ANIMATION CONTROLLER ---
    const introOverlay = document.getElementById('intro-overlay');
    const introSound = document.getElementById('intro-sound');
    const skipBtn = document.getElementById('skip-btn');
    const startBtn = document.getElementById('start-btn'); // New Button
    const heroContent = document.querySelector('.hero-content');

    // Force strict volume
    introSound.volume = 1.0;

    // Logic:
    // 1. Try Autoplay.
    // 2. If success -> Add 'playing' class to overlay to start CSS animation.
    // 3. If fail -> Show 'ENTER PORTFOLIO' button -> Wait for click -> Play -> Add class.

    const startAnimation = () => {
        introOverlay.classList.add('playing'); // THIS starts the visual animation
        const animationDuration = 3500;
        setTimeout(finishIntro, animationDuration);
    };

    const handleAutoplayFailure = () => {
        console.log("Autoplay blocked. Waiting for user interaction.");
        startBtn.style.display = 'block'; // Show the button

        startBtn.addEventListener('click', () => {
            introSound.play()
                .then(() => {
                    startBtn.style.display = 'none';
                    startAnimation();
                })
                .catch(e => console.error("Audio failed even after click:", e));
        });
    };

    // Attempt Play
    const playPromise = introSound.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Autoplay worked!
                startAnimation();
            })
            .catch(error => {
                // Autoplay blocked
                handleAutoplayFailure();
            });
    } else {
        // Older browsers? Just start.
        startAnimation();
    }

    // Skip Button Logic
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            try {
                introSound.pause();
                introSound.currentTime = 0;
            } catch (e) { /* ignore */ }
            finishIntro();
        });
    }

    function finishIntro() {
        introOverlay.classList.remove('playing'); // Cleanup
        introOverlay.classList.add('hidden');
        sessionStorage.setItem('introShown', 'true');
        heroContent.classList.add('fade-in');
        setTimeout(() => {
            introOverlay.style.display = 'none';
        }, 800);
    }


    // --- Navbar Background on Scroll ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Section Reveal Animation ---
    const revealSections = document.querySelectorAll('.row-section');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15 // Trigger when 15% visible
    });

    revealSections.forEach(section => {
        revealObserver.observe(section);
    });

    // --- Row Scroll Handles ---
    document.querySelectorAll('.row-container').forEach(container => {
        const row = container.querySelector('.row');
        const leftHandle = container.querySelector('.left-handle');
        const rightHandle = container.querySelector('.right-handle');

        if (!leftHandle || !rightHandle) return;

        leftHandle.addEventListener('click', () => {
            const scrollAmount = window.innerWidth * 0.7; // Scroll 70% of screen width
            row.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        rightHandle.addEventListener('click', () => {
            const scrollAmount = window.innerWidth * 0.7;
            row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    });

    // --- Optional: Smooth Anchor Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// --- Keyboard Navigation (TV / Accessibility) ---
document.addEventListener('keydown', (e) => {
    // Only handle if no specific element is focused (or body is focused)
    // implying general navigation, OR if we want to override default scroll

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        // Find the visible slider (optional optimization: find "focused" section)
        // For simplicity, we can scroll the slider that is currently in view 
        // or if an element inside a slider is focused, scroll that slider.

        const activeElement = document.activeElement;
        const slider = activeElement.closest('.row-container')?.querySelector('.row');

        if (slider) {
            const scrollAmount = window.innerWidth * 0.3;
            if (e.key === 'ArrowRight') {
                slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        } else {
            // If no specific slider is focused, verify if any section is visible and scroll that? 
            // Actually, standard behavior is usually sufficient for vertical scroll.
            // But for horizontal rows, we might want to manually focus/scroll.
        }
    }
});

