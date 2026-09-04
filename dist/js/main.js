import { servicesData as defaultServicesData, showcasePhotos as defaultShowcasePhotos } from './services.js';

// Read from module import or global window scope
const getShowcasePhotos = () => (typeof window !== 'undefined' && window.showcasePhotos) || defaultShowcasePhotos || [];
const getServicesData = () => (typeof window !== 'undefined' && window.servicesData) || defaultServicesData || [];

function init() {
  initServicesCatalog();
  initGallery();
  initNavigation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// --- SERVICES CATALOG & TABS ---
function initServicesCatalog() {
  const tabsContainer = document.getElementById('services-tabs');
  const gridContainer = document.getElementById('services-grid');

  if (!tabsContainer || !gridContainer) return;

  const services = getServicesData();
  if (!services.length) return;

  let activeCategoryId = services[0].id;

  // Render Tabs
  tabsContainer.innerHTML = services.map((service, index) => `
    <button class="tab-btn ${index === 0 ? 'active' : ''}" data-category="${service.id}">
      ${service.title}
    </button>
  `).join('');

  // Render Initial Category Cards
  renderCategoryCards(activeCategoryId);

  // Tab Click Handler
  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    const categoryId = btn.getAttribute('data-category');
    if (categoryId === activeCategoryId) return;

    activeCategoryId = categoryId;
    tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    renderCategoryCards(activeCategoryId);
  });

  function renderCategoryCards(catId) {
    const category = services.find(s => s.id === catId);
    if (!category) return;

    const whatsappPhone = "5511912722686";

    gridContainer.innerHTML = `
      <div class="service-category-header text-center" style="grid-column: 1 / -1; margin-bottom: 24px;">
        <h3 style="font-size: 1.6rem; margin-bottom: 8px; color: var(--text-primary);">${category.title}</h3>
        <p style="color: var(--text-secondary); max-width: 680px; margin: 0 auto; font-size: 0.98rem;">${category.description}</p>
      </div>
      ${category.items.map(item => {
        const message = encodeURIComponent(`Olá! Vi no site o serviço "${item.name}" e gostaria de solicitar um orçamento para o meu veículo.`);
        const waUrl = `https://wa.me/${whatsappPhone}?text=${message}`;

        return `
          <div class="glass-card service-item-card animate-fade-in">
            <div class="service-item-header">
              <h4 class="service-item-title">${item.name}</h4>
              ${item.badge ? `<span class="service-card-badge">${item.badge}</span>` : ''}
            </div>
            <p class="service-item-desc">${item.description}</p>
            <div class="service-item-footer">
              <a href="${waUrl}" target="_blank" onclick="return gtag_report_conversion(this.href);" class="btn btn-whatsapp" style="width: 100%; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.949h.004c4.368 0 7.926-3.558 7.93-7.93a7.896 7.896 0 0 0-2.333-5.593l.002-.008zm-5.606 11.96c-1.193 0-2.366-.32-3.386-.925l-.24-.143-2.516.66.671-2.456-.157-.25a6.588 6.588 0 0 1-1.007-3.483C.07 4.195 3.633.631 8.001.631a6.536 6.536 0 0 1 4.628 1.916 6.567 6.567 0 0 1 1.9 4.62c-.004 4.363-3.567 7.926-7.96 7.926z"/>
                </svg>
                <span>Solicitar Orçamento</span>
              </a>
            </div>
          </div>
        `;
      }).join('')}
    `;
  }
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
        <img src="${photo}" alt="Nosso Espaço Garagem JVC ${index + 1}" loading="lazy" class="gallery-img">
        <div class="gallery-overlay">
          <div class="gallery-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
          <span class="gallery-caption">Conheça Nosso Espaço — Garagem JVC</span>
        </div>
      </div>
    `).join('');

    if (visiblePhotosCount >= photos.length) {
      btnLoadMore.style.display = 'none';
    } else {
      btnLoadMore.style.display = 'inline-block';
    }
  }

  function openLightbox() {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateLightboxImage();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
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
    lightboxCaption.textContent = `Nosso Espaço Garagem JVC — Foto ${currentLightboxIndex + 1} de ${photos.length}`;
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

