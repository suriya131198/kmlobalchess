// ===== Lobal Chess Academy — Interactive JavaScript =====

document.addEventListener('DOMContentLoaded', () => {

    // ===== FLOATING CHESS PIECES =====
    const floatingContainer = document.getElementById('floating-pieces');
    const chessPieces = ['♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟'];

    function createFloatingPiece() {
        const piece = document.createElement('div');
        piece.classList.add('floating-piece');
        piece.textContent = chessPieces[Math.floor(Math.random() * chessPieces.length)];
        piece.style.left = Math.random() * 100 + '%';
        piece.style.fontSize = (Math.random() * 2 + 1.2) + 'rem';
        piece.style.opacity = Math.random() * 0.06 + 0.02;
        const duration = Math.random() * 20 + 15;
        piece.style.animationDuration = duration + 's';
        piece.style.animationDelay = -(Math.random() * duration) + 's';
        floatingContainer.appendChild(piece);
    }

    // Create initial floating pieces
    for (let i = 0; i < 18; i++) {
        createFloatingPiece();
    }

    // ===== CURSOR TRAIL (CHESS SQUARES) =====
    const canvas = document.getElementById('cursor-trail');
    const ctx = canvas.getContext('2d');
    let mouseX = 0, mouseY = 0;
    let trailSquares = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Add new trail square
        trailSquares.push({
            x: mouseX,
            y: mouseY,
            size: 8 + Math.random() * 6,
            opacity: 0.35,
            color: Math.random() > 0.5 ? '#c9a84c' : '#b58863',
            rotation: Math.random() * 45,
            life: 1,
        });

        // Keep trail manageable
        if (trailSquares.length > 20) {
            trailSquares.shift();
        }
    });

    function animateTrail() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        trailSquares.forEach((sq, i) => {
            sq.life -= 0.03;
            sq.opacity = sq.life * 0.3;
            sq.size *= 0.98;

            if (sq.life <= 0) {
                trailSquares.splice(i, 1);
                return;
            }

            ctx.save();
            ctx.globalAlpha = sq.opacity;
            ctx.translate(sq.x, sq.y);
            ctx.rotate(sq.rotation * Math.PI / 180);
            ctx.fillStyle = sq.color;
            ctx.fillRect(-sq.size / 2, -sq.size / 2, sq.size, sq.size);
            ctx.restore();
        });

        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');

    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll();

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavOnScroll() {
        const scrollY = window.scrollY + 100;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNavOnScroll);

    // ===== MOBILE MENU =====
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinksContainer = document.getElementById('navLinks');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinksContainer.classList.remove('open');
        });
    });

    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== ANIMATED COUNTERS =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    if (statNumbers.length > 0) {
        counterObserver.observe(statNumbers[0].closest('.stats-grid'));
    }

    function animateCounters() {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            function updateCounter() {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    return;
                }
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            }
            updateCounter();
        });
    }

    // ===== 3D TILT EFFECT ON CARDS =====
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(other => {
                other.classList.remove('active');
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ===== FORM VALIDATION =====
    const trialForm = document.getElementById('trialForm');

    if (trialForm) {
        trialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            // Name validation
            const nameInput = document.getElementById('name');
            if (nameInput.value.trim().length < 2) {
                nameInput.classList.add('error');
                valid = false;
            } else {
                nameInput.classList.remove('error');
            }

            // Phone validation
            const phoneInput = document.getElementById('phone');
            const phoneRegex = /^[\+]?[0-9\s\-]{8,15}$/;
            if (!phoneRegex.test(phoneInput.value.trim())) {
                phoneInput.classList.add('error');
                valid = false;
            } else {
                phoneInput.classList.remove('error');
            }

            // Email validation
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.classList.add('error');
                valid = false;
            } else {
                emailInput.classList.remove('error');
            }

            if (valid) {
                // Show success state
                const formCard = trialForm.closest('.trial-form-card');
                formCard.innerHTML = `
                    <div class="form-success">
                        <div class="form-success-icon">♔</div>
                        <h3>Welcome to Lobal Chess!</h3>
                        <p>Thank you for booking your free trial. Our team will reach out to you shortly at <strong>${phoneInput.value}</strong>.</p>
                    </div>
                `;
            }
        });

        // Remove error on input
        ['name', 'phone', 'email'].forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('input', () => {
                input.classList.remove('error');
            });
        });
    }

    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            if (input.value.trim()) {
                input.value = '';
                input.placeholder = '✓ Subscribed!';
                setTimeout(() => {
                    input.placeholder = 'Your email';
                }, 3000);
            }
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== CHESS PIECE SPAWN ON CLICK =====
    document.addEventListener('click', (e) => {
        // Don't spawn on interactive elements
        if (e.target.closest('button, a, input, select, .faq-question, form')) return;

        const piece = document.createElement('div');
        piece.textContent = chessPieces[Math.floor(Math.random() * chessPieces.length)];
        piece.style.position = 'fixed';
        piece.style.left = e.clientX + 'px';
        piece.style.top = e.clientY + 'px';
        piece.style.fontSize = '1.8rem';
        piece.style.color = '#c9a84c';
        piece.style.pointerEvents = 'none';
        piece.style.zIndex = '9998';
        piece.style.transition = 'all 1s ease-out';
        piece.style.opacity = '0.8';
        document.body.appendChild(piece);

        requestAnimationFrame(() => {
            piece.style.transform = `translateY(-80px) rotate(${Math.random() * 90 - 45}deg) scale(0.3)`;
            piece.style.opacity = '0';
        });

        setTimeout(() => piece.remove(), 1000);
    });

    // ===== PARALLAX ON HERO CHESS BOARD =====
    const heroChessboard = document.querySelector('.hero-chessboard');
    if (heroChessboard) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            heroChessboard.style.transform = `translateY(${scrollPos * 0.3}px)`;
        });
    }

    // ===== TYPEWRITER EFFECT FOR HERO BADGE =====
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        const originalText = heroBadge.textContent;
        heroBadge.textContent = '';
        let charIndex = 0;

        function typeWriter() {
            if (charIndex < originalText.length) {
                heroBadge.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 40);
            }
        }

        setTimeout(typeWriter, 500);
    }

});
