// Read from global window scope (resolves CORS issues over file:/// protocol)
const getShowcasePhotos = () => window.showcasePhotos || [];

function init() {
  initGallery();
  initNavigation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// --- GALLERY LIGHTBOX ---
let visiblePhotosCount = 6;
let currentLightboxIndex = 0;

function initGallery() {
  const grid = document.getElementById('gallery-grid');
  const btnLoadMore = document.getElementById('btn-load-more');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCaption = document.getElementById('lightbox-caption');

  if (!grid || !btnLoadMore || !lightbox) return;

  const photos = getShowcasePhotos();

  // Render initial photos
  renderPhotos();

  // Load More click event
  btnLoadMore.addEventListener('click', () => {
    visiblePhotosCount += 6;
    renderPhotos();
  });

  // Photo click event (open lightbox)
  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;

    currentLightboxIndex = parseInt(item.getAttribute('data-index'));
    openLightbox();
  });

  // Lightbox close click
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      // close on overlay click (but check if not clicking buttons)
      if (e.target !== lightboxPrev && e.target !== lightboxNext) {
        closeLightbox();
      }
    }
  });

  // Lightbox navigations
  lightboxPrev.addEventListener('click', showPrevPhoto);
  lightboxNext.addEventListener('click', showNextPhoto);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevPhoto();
    if (e.key === 'ArrowRight') showNextPhoto();
  });

  function renderPhotos() {
    grid.innerHTML = '';
    const slice = photos.slice(0, visiblePhotosCount);
    
    grid.innerHTML = slice.map((photo, index) => `
      <div class="gallery-item glass-card animate-fade-in" data-index="${index}">
        <img src="${photo}" alt="Trabalho Garagem JVC ${index + 1}" loading="lazy" class="gallery-img">
        <div class="gallery-overlay">
          <div class="gallery-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
          <span class="gallery-caption">Garagem JVC Estética</span>
        </div>
      </div>
    `).join('');

    // Hide button if all photos are displayed
    if (visiblePhotosCount >= photos.length) {
      btnLoadMore.style.display = 'none';
    } else {
      btnLoadMore.style.display = 'inline-block';
    }
  }

  function openLightbox() {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable page scrolling
    updateLightboxImage();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Enable page scrolling
  }

  function showPrevPhoto() {
    currentLightboxIndex = (currentLightboxIndex - 1 + visiblePhotosCount) % visiblePhotosCount;
    updateLightboxImage();
  }

  function showNextPhoto() {
    currentLightboxIndex = (currentLightboxIndex + 1) % visiblePhotosCount;
    updateLightboxImage();
  }

  function updateLightboxImage() {
    const photoUrl = photos[currentLightboxIndex];
    lightboxImg.src = photoUrl;
    lightboxCaption.textContent = `Projeto Garagem JVC — Foto ${currentLightboxIndex + 1} de ${photos.length}`;
  }
}

// --- ACTIVE NAVIGATION LINK ---
function initNavigation() {
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 120) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === current || (current === '' && href === 'sobre')) {
        link.classList.add('active');
      }
    });
  });
}
