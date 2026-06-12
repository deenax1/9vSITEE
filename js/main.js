document.addEventListener('DOMContentLoaded', () => {
  initConfetti();
  initCursorSparkles();
  initGallery();
  initBackToTop();
});

/* ---------------------------------------------------
   1. Canvas-Based Celebration Confetti/Glitter
--------------------------------------------------- */
function initConfetti() {
  const canvas = document.createElement('canvas');
  canvas.id = 'petal-canvas'; // Keep ID to match CSS background layer
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  const confettiCount = 40;
  const particles = [];
  const colors = ['#dfba73', '#e8d4ac', '#c23b56', '#a89098', '#5c4d52'];
  
  class Confetti {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 6 + 4;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 1 - 0.5;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 2 - 1;
      this.sway = Math.random() * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.005;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.3 + 0.3;
      this.shape = Math.random() > 0.5 ? 'circle' : 'square';
    }
    
    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.sway) * 0.3;
      this.sway += this.swaySpeed;
      this.rotation += this.rotationSpeed;
      
      if (this.y > height + 20) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      
      ctx.beginPath();
      if (this.shape === 'circle') {
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      } else {
        ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
      }
      ctx.fill();
      ctx.restore();
    }
  }
  
  for (let i = 0; i < confettiCount; i++) {
    particles.push(new Confetti());
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  
  animate();
}

/* ---------------------------------------------------
   2. Cursor Sparkles Trail & Click Sparkles
--------------------------------------------------- */
function initCursorSparkles() {
  const colors = ['#dfba73', '#e8d4ac', '#c23b56', '#fbf7f8'];
  let lastMove = 0;
  
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastMove < 40) return;
    lastMove = now;
    
    createSparkle(e.clientX, e.clientY);
  });
  
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const velocity = Math.random() * 4 + 2;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      createSparkle(e.clientX, e.clientY, vx, vy);
    }
  });
  
  function createSparkle(x, y, vx = null, vy = null) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    const size = Math.random() * 4 + 2;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.backgroundColor = color;
    sparkle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    
    document.body.appendChild(sparkle);
    
    if (vx !== null && vy !== null) {
      let currentX = x;
      let currentY = y;
      let currentVx = vx;
      let currentVy = vy;
      let opacity = 1;
      
      const animateCustomSparkle = () => {
        currentX += currentVx;
        currentY += currentVy;
        currentVy += 0.08;
        currentVx *= 0.98;
        opacity -= 0.02;
        
        sparkle.style.left = `${currentX}px`;
        sparkle.style.top = `${currentY}px`;
        sparkle.style.opacity = opacity;
        
        if (opacity > 0) {
          requestAnimationFrame(animateCustomSparkle);
        } else {
          sparkle.remove();
        }
      };
      
      requestAnimationFrame(animateCustomSparkle);
    } else {
      setTimeout(() => {
        sparkle.remove();
      }, 1200);
    }
  }
}


/* ---------------------------------------------------
   3. Memories Gallery Filter, Hover Preview, Lightbox
   --------------------------------------------------- */
function initGallery() {
  const cards = document.querySelectorAll('.memory-card');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  if (cards.length === 0) return; // Not on memories page

  // 1. Filtering Logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      // Update active class on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      cards.forEach(card => {
        const type = card.getAttribute('data-type');
        if (filter === 'all' || type === filter) {
          card.classList.remove('hidden');
          card.classList.remove('fade-in');
          void card.offsetWidth; // force reflow
          card.classList.add('fade-in');
        } else {
          card.classList.add('hidden');
          card.classList.remove('fade-in');
        }
      });
    });
  });

  // 2. Video Play preview on Hover
  const videoCards = document.querySelectorAll('.video-card');
  videoCards.forEach(card => {
    const video = card.querySelector('.memory-video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play().catch(err => {
        // Autoplay policy might block play, ignore it
      });
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });

  // 3. Initialize Lightbox modal
  setupLightbox();
}

function setupLightbox() {
  const cards = document.querySelectorAll('.memory-card');
  const modal = document.getElementById('lightbox-modal');
  const content = document.getElementById('lightbox-content');
  const title = document.getElementById('lightbox-title');
  const desc = document.getElementById('lightbox-desc');
  const counter = document.getElementById('lightbox-counter');
  
  if (!modal) return;

  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let activeItems = [];
  let currentIndex = 0;

  const updateActiveItems = () => {
    activeItems = Array.from(document.querySelectorAll('.memory-card:not(.hidden)'));
  };

  const openLightbox = (card) => {
    updateActiveItems();
    currentIndex = activeItems.indexOf(card);
    if (currentIndex === -1) return;

    renderItem();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    content.innerHTML = ''; // Stop and clear media
    document.body.style.overflow = '';
  };

  const showPrev = () => {
    if (activeItems.length === 0) return;
    currentIndex = (currentIndex - 1 + activeItems.length) % activeItems.length;
    renderItem();
  };

  const showNext = () => {
    if (activeItems.length === 0) return;
    currentIndex = (currentIndex + 1) % activeItems.length;
    renderItem();
  };

  const renderItem = () => {
    const card = activeItems[currentIndex];
    if (!card) return;

    const type = card.getAttribute('data-type');
    counter.textContent = `${currentIndex + 1} из ${activeItems.length}`;

    // Clear previous media
    content.innerHTML = '';

    if (type === 'photo') {
      const imgSrc = card.querySelector('.memory-img').getAttribute('src');
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = `Воспоминание ${currentIndex + 1}`;
      content.appendChild(img);
      
      // Trigger animations
      setTimeout(() => {
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      }, 50);
    } else if (type === 'video') {
      const videoSrc = card.querySelector('.memory-video').getAttribute('src');
      const video = document.createElement('video');
      video.src = videoSrc;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.className = 'lightbox-video-element';
      content.appendChild(video);
      
      // Trigger animations
      setTimeout(() => {
        video.style.opacity = '1';
        video.style.transform = 'scale(1)';
      }, 50);
    }
  };

  // Click on cards opens Lightbox
  cards.forEach(card => {
    card.addEventListener('click', () => {
      openLightbox(card);
    });
  });

  // Buttons controls
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });

  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-content-wrapper') || e.target === content) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Touch Swipe navigation for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showNext();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      showPrev();
    }
  };
}


/* ---------------------------------------------------
   4. Back To Top Scroll Controller
   --------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
