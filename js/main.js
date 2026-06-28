/**
 * Antigravity Web Core
 * Mohith Dande - Professional Cyber Portfolio Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Systems
    initCanvasParticles();
    initTerminal();
    initProjectsFilter();
    initProjectModal();
    initScrollReveal();
    initMobileNav();
    initContactForm();
});

/* ==========================================================================
   CANVAS PARTICLE BACKGROUND
   ========================================================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    const mouse = {
        x: null,
        y: null,
        radius: 120
    };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 10;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
        }
        
        draw() {
            ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        
        update() {
            // Screen boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            
            this.x += this.vx;
            this.y += this.vy;
            
            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    
                    // Repel slightly
                    this.x -= directionX * force * 3;
                    this.y -= directionY * force * 3;
                }
            }
        }
    }
    
    function init() {
        particles = [];
        const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 14000));
        for (let i = 0; i < count; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            particles.push(new Particle(x, y));
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }
    
    function connectParticles() {
        let maxDistance = 110;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    let opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function handleResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
    animate();
}

/* ==========================================================================
   INTERACTIVE TERMINAL
   ========================================================================== */
function initTerminal() {
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');
    const tabs = document.querySelectorAll('.terminal-tab');
    if (!terminalBody || !terminalInput) return;
    
    // Command mapping and response templates
    const commands = {
        help: () => `
            <div class="terminal-text">Available commands:</div>
            <ul class="terminal-help-list">
                <li><span>about</span> - Core profile highlights</li>
                <li><span>skills</span> - Categorized technical skills</li>
                <li><span>projects</span> - Featured project names & details</li>
                <li><span>contact</span> - Get email, linkedin and phone</li>
                <li><span>clear</span> - Clear the terminal output</li>
            </ul>
        `,
        about: () => `
            <div class="terminal-text">
                <span class="keyword">Profile Summary:</span><br>
                Mohith Dande | B.Tech CSE Cyber Security Student<br>
                Amrita Vishwa Vidyapeetham, Amritapuri, Kerala.<br><br>
                ✦ Focused on: Machine Learning, Web Backend & Cybersecurity Integration<br>
                ✦ Core stack: Python, Flask, Firebase, SQLite<br>
                ✦ Goal: Future AI & Security Engineer
            </div>
        `,
        skills: () => `
            <div class="terminal-text">
                <span class="keyword">Technical Toolkit:</span><br>
                ------------------------------------------------<br>
                🤖 <span class="property">AI & ML:</span> Python, Scikit-Learn, Pandas, NumPy<br>
                ⚙️ <span class="property">Backend:</span> Flask, REST APIs, SQLite, SQLAlchemy, Firebase<br>
                🛠️ <span class="property">Frontend & Tools:</span> Git, GitHub, JavaScript, HTML5, CSS3
            </div>
        `,
        projects: () => `
            <div class="terminal-text">
                <span class="keyword">Featured Projects:</span><br>
                ------------------------------------------------<br>
                1. <span class="class-name">AI Student Placement Predictor</span> [ML & Flask]<br>
                2. <span class="class-name">Netflix Recommendation System</span> [NLP & TF-IDF]<br>
                3. <span class="class-name">Guardian Path</span> [Kotlin Safety-First Maps]<br>
                4. <span class="class-name">SkillBridge AI</span> [MERN Freelancer SaaS]<br>
                5. <span class="class-name">Spotify Clone</span> [MERN Streamer App]<br><br>
                Type <span class="string">"projects"</span> or scroll down to explore visual details!
            </div>
        `,
        contact: () => `
            <div class="terminal-text">
                <span class="keyword">Communication Channels:</span><br>
                ------------------------------------------------<br>
                📧 Email: <a href="mailto:mohithdande3@gmail.com" class="string">mohithdande3@gmail.com</a><br>
                📞 Phone: <span class="property">9985124955</span><br>
                💼 LinkedIn: <a href="https://www.linkedin.com/in/mohith-dande-01b58a371/" target="_blank" class="string">mohith-dande-01b58a371</a>
            </div>
        `
    };
    
    // Command executor
    function executeCommand(cmdStr) {
        const cleanCmd = cmdStr.trim().toLowerCase();
        let response = '';
        
        if (cleanCmd === '') {
            return;
        }
        
        if (cleanCmd === 'clear') {
            terminalBody.innerHTML = '';
            return;
        }
        
        if (commands[cleanCmd]) {
            response = commands[cleanCmd]();
        } else {
            response = `<div class="terminal-text error-text">Command not found: "${cleanCmd}". Type <span class="keyword">'help'</span> for list of commands.</div>`;
        }
        
        // Print output to terminal screen
        const cmdOutput = document.createElement('div');
        cmdOutput.className = 'terminal-output-block';
        cmdOutput.innerHTML = `
            <div class="terminal-input-line">
                <span class="terminal-prompt">dande@mohith:~$</span>
                <span>${cmdStr}</span>
            </div>
            ${response}
            <div style="margin-bottom: 0.75rem;"></div>
        `;
        
        // Insert before the last input element
        terminalBody.appendChild(cmdOutput);
        
        // Scroll terminal to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    // Handle tab clicking
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const targetCmd = tab.getAttribute('data-cmd');
            if (targetCmd) {
                executeCommand(targetCmd);
            }
        });
    });
    
    // Command prompt submission
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const inputVal = terminalInput.value;
            executeCommand(inputVal);
            terminalInput.value = '';
        }
    });
    
    // Auto-focus terminal input when terminal body is clicked
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });
    
    // Default boot commands to make terminal look active
    setTimeout(() => executeCommand('about'), 300);
}

/* ==========================================================================
   PROJECTS FILTER GRID
   ========================================================================== */
function initProjectsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length === 0 || projectCards.length === 0) return;
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active filter button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const targetFilter = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (targetFilter === 'all' || cardCategory === targetFilter) {
                    card.style.display = 'flex';
                    // Trigger reflow for transition effect
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   PROJECT DETAILS MODAL
   ========================================================================== */
const projectDetailsData = {
    "placement-predictor": {
        title: "AI Student Placement Predictor",
        slogan: "Predict placement success with Explainable AI & Machine Learning.",
        tag: "AI / ML",
        desc: `
            <h4>Project Overview</h4>
            <p>An end-to-end Machine Learning web application designed to evaluate college student performance across technical, academic, and behavioral metrics to forecast placement chances. Built to help students identify skill gaps early and optimize their career preparation.</p>
            
            <h4>Core Features</h4>
            <ul>
                <li><strong>Predictive Analytics Dashboard:</strong> Evaluates student CGPA, internships, projects, logic scores, and communication ratings using a Random Forest regression pipeline.</li>
                <li><strong>Explainable AI:</strong> Uses custom charts and feedback lists explaining which specific skills a student needs to improve to increase placement probability.</li>
                <li><strong>Enterprise Ready:</strong> Processes datasets with thousands of records securely and provides quick predictions under 100ms.</li>
            </ul>
            
            <h4>Technical Architecture</h4>
            <p>Built with Python Flask on the backend serving a Scikit-Learn trained Random Forest classifier. Frontend uses HTML5/CSS3 dynamic templates, Chart.js for data visualization, and SQLite for admin dashboard records tracking.</p>
        `,
        tech: ["Python", "Flask", "Scikit-Learn", "SQLite", "Pandas", "Chart.js"],
        repo: "https://github.com/Mohith1-stack/AI-Student-Placement-Predictor",
        stats: "📊 XAI Dashboard | 10k+ Records"
    },
    "netflix-recommendation": {
        title: "Netflix Recommendation System",
        slogan: "Discover your next favorite movies instantly using NLP.",
        tag: "AI / NLP",
        desc: `
            <h4>Project Overview</h4>
            <p>An AI recommendation platform utilizing natural language processing algorithms to deliver highly relevant content suggestions. Designed to replicate modern streaming suggestion engines by parsing metadata, genres, and storylines.</p>
            
            <h4>Core Features</h4>
            <ul>
                <li><strong>Content-Based Filtering:</strong> Applies TF-IDF vectorization over movie overview, plot summary, and keyword metadata to compute content similarity.</li>
                <li><strong>Cosine Similarity Search:</strong> Computes semantic similarities in high-dimensional vector spaces to surface matching shows in milliseconds.</li>
                <li><strong>Dynamic TMDB API:</strong> Integrates with TMDB database to retrieve live movie details, cover art, descriptions, and user ratings.</li>
            </ul>
            
            <h4>Technical Architecture</h4>
            <p>Backend built using Python Flask running Scikit-Learn vectorization. Frontend utilizes dynamic responsive CSS layouts with dynamic JS fetching TMDB posters and details directly in the browser.</p>
        `,
        tech: ["Python", "Flask", "Scikit-Learn", "TMDB API", "TF-IDF Vectorizer", "JavaScript"],
        repo: "https://github.com/Mohith1-stack/Netflix-Recommendation-System",
        stats: "🎥 TMDB API | Content Based"
    },
    "guardian-path": {
        title: "Guardian Path",
        slogan: "A custom navigation engine prioritizing user safety over speed.",
        tag: "Mobile / Android",
        desc: `
            <h4>Project Overview</h4>
            <p>A safety-first navigation Android application designed to provide citizens with optimized walking routes based on local safety scores, crime maps, lighting levels, and crowd densities rather than standard shortest paths.</p>
            
            <h4>Core Features</h4>
            <ul>
                <li><strong>Intelligent Night Agent:</strong> Scans routes after dark to flag dim-lit or high-risk paths using risk assessment models.</li>
                <li><strong>Custom Route Overlays:</strong> Modifies standard routing instructions using open-source road network engines (OSRM) to bypass unsafe hotspots.</li>
                <li><strong>Instant SOS:</strong> Panic button allowing users to instantly broadcast their live location and safe path state to emergency contacts.</li>
            </ul>
            
            <h4>Technical Architecture</h4>
            <p>Developed in Kotlin for Android devices. Map services render via Google Maps API, routing calculated using customized Open Source Routing Machine (OSRM) pipelines, and localized risk indexing database built on SQLite.</p>
        `,
        tech: ["Kotlin", "Android SDK", "OSRM", "Google Maps API", "SQLite", "Risk Assessment API"],
        repo: "https://github.com/Mohith1-stack/Code-Chaos",
        stats: "🌙 Night Agent | Risk Detection"
    },
    "techbuddies": {
        title: "TechBuddies Student Management",
        slogan: "Managing academic attendance and analytics seamlessly.",
        tag: "Web App",
        desc: `
            <h4>Project Overview</h4>
            <p>An administrative web portal engineered for educators and administrators to monitor student profiles, record class attendance, generate reports, and analyze performance charts in one platform.</p>
            
            <h4>Core Features</h4>
            <ul>
                <li><strong>Secure Role-Based Login:</strong> Implement authentication checkpoints and custom database sessions for instructors and admins.</li>
                <li><strong>Attendance Tracker:</strong> One-click interface for teachers to mark daily attendance logs and export summaries to CSV/PDF sheets.</li>
                <li><strong>Predictive Analytics:</strong> Visualizes student absence streaks and alerts educators on students at academic risk.</li>
            </ul>
            
            <h4>Technical Architecture</h4>
            <p>Built with Python Flask and SQLAlchemy ORM on the backend. Connected to SQLite for storing records securely. Frontend utilizes beautiful modern grids, CSS layout tables, and vanilla javascript chart handlers.</p>
        `,
        tech: ["Python", "Flask", "SQLAlchemy", "SQLite", "HTML/CSS", "Vanilla JS"],
        repo: "https://github.com/Mohith1-stack/TechBuddies",
        stats: "📚 Attendance System | Analytics"
    },
    "loan-approval": {
        title: "AI Loan Approval Prediction",
        slogan: "Helping financial institutions manage risks with machine learning.",
        tag: "AI / ML",
        desc: `
            <h4>Project Overview</h4>
            <p>An automated credit scoring and loan risk assessment system built to predict approval outcomes based on applicant assets, credit histories, income details, and education profiles.</p>
            
            <h4>Core Features</h4>
            <ul>
                <li><strong>Applicant Profiling Matrix:</strong> Processes applicant financial vectors such as debt ratio, credit score, monthly income, and dependents.</li>
                <li><strong>Risk Classifier Pipeline:</strong> Leverages Scikit-Learn classifiers to predict default probabilities and loan category scores.</li>
                <li><strong>Interactive Dashboard UI:</strong> Built with Streamlit to enable loan officers to run what-if analyses by tweaking sliders.</li>
            </ul>
            
            <h4>Technical Architecture</h4>
            <p>Developed entirely in Python. Uses Scikit-Learn for classification models, Pandas and NumPy for pre-processing pipelines, and Streamlit for layout templates and charts.</p>
        `,
        tech: ["Python", "Scikit-Learn", "Streamlit", "Pandas", "NumPy", "Matplotlib"],
        repo: "https://github.com/Mohith1-stack/AI-Loan-Approval-Prediction",
        stats: "🏦 Risk Analysis | ML Pipeline"
    },
    "civicsense": {
        title: "CivicSense-AI",
        slogan: "Empowering communities through AI-driven public issue tracking.",
        tag: "AI / Civic Tech",
        desc: `
            <h4>Project Overview</h4>
            <p>A web platform aimed at narrowing the gap between local citizens and municipal governance. Users can report local problems (potholes, garbage dumps, light outages) and AI routes them to the correct city departments.</p>
            
            <h4>Core Features</h4>
            <ul>
                <li><strong>Civic Incident Classifier:</strong> Natural Language Processing pipelines that analyze textual issue reports and route them to matching city boards.</li>
                <li><strong>Interactive Issue Map:</strong> Visualizes community complaints on an interactive local grid map, highlighting high-priority incident nodes.</li>
                <li><strong>Upvoting & Updates:</strong> Allows nearby citizens to support reports and tracks completion statuses from local municipal departments.</li>
            </ul>
            
            <h4>Technical Architecture</h4>
            <p>Utilizes Flask, Python, SQLite on the backend. Frontend incorporates responsive layouts, custom interactive grids, and geolocation map widgets.</p>
        `,
        tech: ["Python", "Flask", "NLP Classifier", "SQLite", "JavaScript", "HTML/CSS"],
        repo: "https://github.com/Mohith1-stack/CivicSense-AI",
        stats: "🏙️ Smart Governance | Citizen App"
    },
    "skillbridge": {
        title: "SkillBridge AI",
        slogan: "Bridging client projects and freelancers with matching AI.",
        tag: "AI / SAAS",
        desc: `
            <h4>Project Overview</h4>
            <p>A modern full-featured software platform for freelance services. Incorporates matching algorithms that rank freelancer skills, rates, and reviews against client requirements.</p>
            
            <h4>Core Features</h4>
            <ul>
                <li><strong>ATS Resume Parser:</strong> Integrates OpenAI API to parse freelancer resume attachments and extract key skill matrices.</li>
                <li><strong>Intelligent Match Maker:</strong> Calculates match coefficients between project descriptors and freelancer profiles.</li>
                <li><strong>Financial Integration:</strong> Supports credit card checkouts and payment splits using secure Stripe payment portals.</li>
            </ul>
            
            <h4>Technical Architecture</h4>
            <p>Engineered using the MERN stack (MongoDB, Express, React, Node.js). Payments handled via Stripe SDK, AI pipelines query OpenAI REST endpoints, and uploads managed with Cloudinary.</p>
        `,
        tech: ["React.js", "Node.js", "Express", "MongoDB", "Stripe API", "OpenAI API"],
        repo: "https://github.com/Mohith1-stack/AI-Powered-Freelance-Marketplace",
        stats: "💼 ATS Resume | AI Matching"
    },
    "spotify": {
        title: "Spotify Clone",
        slogan: "Stream and share playlists seamlessly in a premium browser layout.",
        tag: "Full Stack",
        desc: `
            <h4>Project Overview</h4>
            <p>A detailed full-stack audio streaming app developed to practice cloud audio delivery, real-time buffering, and administrative CRUD operations for tracks and albums.</p>
            
            <h4>Core Features</h4>
            <ul>
                <li><strong>Fluid Web Audio Player:</strong> Seamless audio rendering with buffer queues, volume slides, song progress controls, and background playback.</li>
                <li><strong>User Libraries:</strong> Custom playlist creator, favorites collection, and artist search parameters.</li>
                <li><strong>Content Creator Dashboard:</strong> Admin dashboard permitting track creation, album uploads, and streaming statistics reviews.</li>
            </ul>
            
            <h4>Technical Architecture</h4>
            <p>Built with MongoDB, Express, React, and Node.js. Authenticated sessions managed via JSON Web Tokens (JWT) and media assets stored in Cloudinary API buckets.</p>
        `,
        tech: ["React.js", "Node.js", "Express", "MongoDB", "Cloudinary SDK", "JWT"],
        repo: "https://github.com/Mohith1-stack/Spotify-Clone",
        stats: "🎵 Music Streaming | Playlists"
    }
};

function initProjectModal() {
    const modalOverlay = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!modalOverlay || !closeBtn) return;
    
    // Modal Element Hooks
    const modalTag = document.getElementById('modal-project-tag');
    const modalTitle = document.getElementById('modal-project-title');
    const modalSlogan = document.getElementById('modal-project-slogan');
    const modalBody = document.getElementById('modal-project-body');
    const modalTech = document.getElementById('modal-project-tech');
    const modalRepoBtn = document.getElementById('modal-repo-btn');
    
    function openModal(projectId) {
        const data = projectDetailsData[projectId];
        if (!data) return;
        
        modalTag.textContent = data.tag;
        modalTitle.textContent = data.title;
        modalSlogan.textContent = data.slogan;
        modalBody.innerHTML = data.desc;
        
        // Render tech tags
        modalTech.innerHTML = '';
        data.tech.forEach(t => {
            const badge = document.createElement('span');
            badge.className = 'project-tech-badge';
            badge.textContent = t;
            modalTech.appendChild(badge);
        });
        
        modalRepoBtn.setAttribute('href', data.repo);
        
        // Activate modal
        modalOverlay.style.display = 'flex';
        setTimeout(() => {
            modalOverlay.classList.add('active');
        }, 10);
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            modalOverlay.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }
    
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // If the user clicked directly on the repository button, don't open the modal
            if (e.target.closest('.project-link-btn')) return;
            
            const projectId = card.getAttribute('data-project-id');
            if (projectId) openModal(projectId);
        });
    });
    
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal clicking overlay background
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
    // ESC key close support
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.fade-in-scroll');
    if (revealElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve once visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
    
    // Scroll header background effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   MOBILE NAV TOGGLE
   ========================================================================== */
function initMobileNav() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (!menuBtn || !mobileNav) return;
    
    menuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });
    
    // Close menu when clicking navigation links
    const mobileLinks = mobileNav.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    });
}

/* ==========================================================================
   CONTACT FORM & TOAST MANAGER
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg style="animation: spin 1s linear infinite; margin-right: 0.5rem;" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-width="4" style="opacity: 0.25;"></circle>
                <path d="M4 12a8 8 0 018-8" stroke-width="4"></path>
            </svg> Sending...
        `;
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        fetch("https://formsubmit.co/ajax/mohithdande3@gmail.com", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message,
                _subject: "New Message from Portfolio Website Redesign",
                _captcha: "false"
            })
        })
        .then(response => {
            if (response.ok) {
                showToast("Message Sent!", "Thank you for reaching out. I'll get back to you soon!");
                form.reset();
            } else {
                throw new Error("Failed to send message.");
            }
        })
        .catch(err => {
            showToast("Error Occurred", "Something went wrong. Please email directly at mohithdande3@gmail.com", true);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
    });
}

function showToast(title, message, isError = false) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast glass-panel ${isError ? 'error' : ''}`;
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-desc">${message}</div>
    `;
    
    container.appendChild(toast);
    
    // Automatically remove after 4.5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4500);
}

// Inline spin animation injector for loading spinner
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
