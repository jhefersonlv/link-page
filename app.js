import { mockData, themePresets } from './mockData.js';

// --- INICIALIZAÇÃO E CONTROLE DE ESTADOS ---
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Carrega e aplica o tema inicial
  applyTheme(mockData.theme);
  
  // Renderiza informações de perfil e cabeçalho
  renderProfile(mockData.profile);
  
  // Renderiza botões de redes sociais
  renderSocials(mockData.socials);
  
  // Renderiza catálogo de produtos/serviços
  renderProducts(mockData.products);
  
  // Inicializa eventos do formulário de contato
  initContactForm();
  
  // Inicializa o switch de layout (Grid vs Carrossel)
  initLayoutSwitcher();
  
  // Inicializa painel administrativo (tweak de temas)
  initTweakPanel();
}

// --- MECANISMO DE TEMA DINÂMICO (INJEÇÃO DE VARIÁVEIS CSS E FONTES) ---
function applyTheme(theme) {
  const root = document.documentElement;
  
  // Injeta variáveis CSS no root
  root.style.setProperty('--bg-color', theme.backgroundColor);
  root.style.setProperty('--bg-gradient', theme.backgroundGradient);
  root.style.setProperty('--primary-color', theme.primaryColor);
  root.style.setProperty('--primary-hover', theme.primaryHoverColor);
  root.style.setProperty('--secondary-color', theme.secondaryColor);
  root.style.setProperty('--text-color', theme.textColor);
  root.style.setProperty('--text-muted', theme.textMutedColor);
  root.style.setProperty('--card-bg', theme.cardBackground);
  root.style.setProperty('--card-border', theme.cardBorderColor);
  root.style.setProperty('--card-text', theme.cardTextColor);
  root.style.setProperty('--btn-radius', theme.borderRadius);
  
  // Trata efeitos de Glassmorphism
  const container = document.querySelector('.mobile-container');
  if (theme.glassmorphism) {
    document.body.classList.add('glassmorphism-effect');
    if (container) container.style.backdropFilter = 'blur(10px)';
  } else {
    document.body.classList.remove('glassmorphism-effect');
    if (container) container.style.backdropFilter = 'none';
  }
  
  // Trata sombras de acordo com intensidade
  switch (theme.shadowIntensity) {
    case 'none':
      root.style.setProperty('--box-shadow', 'none');
      root.style.setProperty('--glow-shadow', 'none');
      break;
    case 'soft':
      root.style.setProperty('--box-shadow', '0 4px 15px rgba(0, 0, 0, 0.15)');
      root.style.setProperty('--glow-shadow', `0 0 10px ${theme.primaryColor}20`);
      break;
    case 'strong':
      root.style.setProperty('--box-shadow', '0 20px 45px rgba(0, 0, 0, 0.7)');
      root.style.setProperty('--glow-shadow', `0 0 25px ${theme.primaryColor}60`);
      break;
    case 'medium':
    default:
      root.style.setProperty('--box-shadow', '0 10px 30px -10px rgba(0, 0, 0, 0.4)');
      root.style.setProperty('--glow-shadow', `0 0 18px ${theme.primaryColor}35`);
      break;
  }

  // Carrega fontes do Google Fonts dinamicamente
  loadGoogleFont(theme.fontFamily);
}

function loadGoogleFont(fontName) {
  const fontLink = document.getElementById('dynamic-font');
  if (fontLink) {
    const formattedName = fontName.replace(/\s+/g, '+');
    fontLink.href = `https://fonts.googleapis.com/css2?family=${formattedName}:wght@300;400;600;700;800&display=swap`;
  }
  document.documentElement.style.setProperty('--font-family', `'${fontName}', sans-serif`);
}

// --- RENDERIZADORES DE CONTEÚDO ---
function renderProfile(profile) {
  const logoImg = document.getElementById('company-logo');
  const companyNameEl = document.getElementById('company-name');
  const bioEl = document.getElementById('company-bio');
  const btnContactText = document.getElementById('btn-contact-text');
  
  if (logoImg) logoImg.src = profile.logo;
  if (companyNameEl) companyNameEl.textContent = profile.companyName;
  if (bioEl) bioEl.textContent = profile.bio;
  if (btnContactText && profile.contactButton) {
    btnContactText.textContent = profile.contactButton.text;
  }
}

// Helper para obter ícones SVG das redes sociais
function getSocialIconSvg(platform) {
  const icons = {
    instagram: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-4.846c1.6.95 3.167 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.875-6.976C16.606 1.907 14.123.886 11.487.886c-5.437 0-9.863 4.417-9.867 9.86 0 1.769.467 3.498 1.354 5.034L1.93 22.07l6.505-1.705c-1.523.83-3.13 1.267-4.788 1.267zM17.433 14.28c-.312-.156-1.85-.913-2.137-1.017-.287-.104-.496-.156-.704.156-.208.312-.806.913-.988 1.121-.182.208-.364.234-.676.078-.312-.156-1.318-.486-2.51-1.549-.928-.827-1.554-1.849-1.736-2.161-.182-.312-.02-.481.136-.636.141-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.208.052-.39-.026-.546-.078-.156-.704-1.7-.963-2.327-.253-.607-.51-.525-.7-.535-.18-.01-.387-.01-.595-.01-.208 0-.547.078-.832.39-.286.312-1.092 1.066-1.092 2.6s1.118 3.016 1.274 3.224c.156.208 2.2 3.36 5.33 4.715.745.322 1.326.515 1.782.66.748.238 1.43.204 1.97.124.602-.09 1.85-.754 2.11-1.443.26-.69.26-1.282.182-1.403-.077-.12-.285-.195-.597-.35z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24"><path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.386.507 9.386.507s7.517 0 9.387-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    github: `<svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`
  };
  return icons[platform] || `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
}

function renderSocials(socials) {
  const container = document.getElementById('socials-container');
  if (!container) return;
  
  container.innerHTML = socials.map(social => `
    <a href="${social.url}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="${social.name}">
      ${getSocialIconSvg(social.name)}
    </a>
  `).join('');
}

function renderProducts(products) {
  const container = document.getElementById('catalog-container');
  if (!container) return;
  
  container.innerHTML = products.map(product => `
    <div class="product-card" id="card-${product.id}">
      <div class="product-image-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
        ${product.price ? `<span class="product-price-badge">${product.price}</span>` : ''}
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <button class="product-btn" data-product-name="${product.name}">
          <span>${product.buttonText || 'Ver Detalhes'}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 14px; height: 14px;">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  // Adiciona evento de clique para cada botão de produto para abrir o formulário
  container.querySelectorAll('.product-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productName = btn.getAttribute('data-product-name');
      openContactModal(productName);
    });
  });
}

// --- FORMULÁRIO DE CONTATO (MODAL & VALIDAÇÃO) ---
function initContactForm() {
  const btnContact = document.getElementById('btn-contact');
  const modal = document.getElementById('contact-modal');
  const modalClose = document.getElementById('modal-close');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success-state');
  const successClose = document.getElementById('btn-success-close');
  
  // Abre o modal pelo botão principal
  if (btnContact) {
    btnContact.addEventListener('click', () => {
      openContactModal();
    });
  }
  
  // Fecha o modal pelo botão 'X'
  if (modalClose) {
    modalClose.addEventListener('click', closeContactModal);
  }
  
  // Fecha o modal clicando fora dele
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeContactModal();
      }
    });
  }
  
  // Fecha o estado de sucesso
  if (successClose) {
    successClose.addEventListener('click', closeContactModal);
  }
  
  // Submissão do Formulário
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const submitSpan = submitBtn.querySelector('span');
      const originalText = submitSpan.textContent;
      
      // Estado de Envio/Loading
      submitBtn.disabled = true;
      submitSpan.textContent = 'Enviando...';
      
      // Simula uma requisição AJAX para a API externa do usuário
      setTimeout(() => {
        // Coleta dados (apenas demonstração conceitual no console)
        const lead = {
          nome: document.getElementById('form-name').value,
          email: document.getElementById('form-email').value,
          telefone: document.getElementById('form-phone').value,
          mensagem: document.getElementById('form-message').value,
          interesse: document.getElementById('form-product-interest').value,
          dataEnvio: new Date().toISOString()
        };
        console.log('Lead Capturado com sucesso! Dados que seriam enviados à API:', lead);
        
        // Exibe tela de sucesso e esconde formulário
        contactForm.style.display = 'none';
        formSuccess.classList.remove('hidden');
        
        // Reseta o botão de envio
        submitBtn.disabled = false;
        submitSpan.textContent = originalText;
      }, 1200);
    });
  }
}

function openContactModal(interestedProduct = null) {
  const modal = document.getElementById('contact-modal');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success-state');
  const interestInput = document.getElementById('form-product-interest');
  const messageArea = document.getElementById('form-message');
  const modalTitle = document.querySelector('.modal-header h3');
  
  if (!modal) return;
  
  // Configura o formulário
  if (contactForm) {
    contactForm.reset();
    contactForm.style.display = 'flex';
  }
  if (formSuccess) formSuccess.classList.add('hidden');
  
  if (interestedProduct) {
    // Configura o modal se o usuário tiver interesse em um produto específico
    if (interestInput) interestInput.value = interestedProduct;
    if (messageArea) messageArea.value = `Gostaria de solicitar contato e orçamento sobre o serviço: ${interestedProduct}.`;
    if (modalTitle) modalTitle.textContent = `Interesse: ${interestedProduct}`;
  } else {
    // Caso geral
    if (interestInput) interestInput.value = '';
    if (messageArea) messageArea.value = mockData.profile.contactButton.placeholderMessage || '';
    if (modalTitle) modalTitle.textContent = 'Solicitar Contato';
  }
  
  modal.classList.add('open');
  document.body.style.overflow = 'hidden'; // Impede scroll do body com modal aberto
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// --- SWITCHER DE LAYOUT (GRID E CARROSSEL) ---
function initLayoutSwitcher() {
  const switcher = document.querySelector('.layout-switcher');
  const switcherBtns = document.querySelectorAll('.switcher-btn');
  const catalog = document.getElementById('catalog-container');
  const carouselNavPrev = document.querySelector('.carousel-nav-btn.prev');
  const carouselNavNext = document.querySelector('.carousel-nav-btn.next');
  const indicatorsContainer = document.getElementById('carousel-indicators');
  
  if (!switcher || !catalog) return;
  
  switcherBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const layout = btn.getAttribute('data-layout');
      
      // Atualiza estado visual do switcher
      switcherBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      switcher.setAttribute('data-active-layout', layout);
      
      // Atualiza layout do catálogo
      if (layout === 'carousel') {
        catalog.classList.remove('layout-grid');
        catalog.classList.add('layout-carousel');
        
        // Exibe indicadores e controles de navegação
        setupCarouselIndicators();
        if (indicatorsContainer) indicatorsContainer.classList.remove('hidden');
        
      } else {
        catalog.classList.remove('layout-carousel');
        catalog.classList.add('layout-grid');
        
        // Esconde indicadores
        if (indicatorsContainer) indicatorsContainer.classList.add('hidden');
      }
    });
  });
  
  // Configura navegação do Carrossel (Prev e Next)
  if (carouselNavPrev && carouselNavNext) {
    carouselNavPrev.addEventListener('click', () => {
      const cardWidth = catalog.querySelector('.product-card').offsetWidth;
      catalog.scrollBy({ left: -cardWidth - 16, behavior: 'smooth' });
    });
    
    carouselNavNext.addEventListener('click', () => {
      const cardWidth = catalog.querySelector('.product-card').offsetWidth;
      catalog.scrollBy({ left: cardWidth + 16, behavior: 'smooth' });
    });
  }

  // Listener de rolagem do carrossel para atualizar os indicadores/dots
  catalog.addEventListener('scroll', () => {
    if (!catalog.classList.contains('layout-carousel')) return;
    updateActiveIndicator();
  });
}

function setupCarouselIndicators() {
  const catalog = document.getElementById('catalog-container');
  const indicatorsContainer = document.getElementById('carousel-indicators');
  if (!catalog || !indicatorsContainer) return;
  
  const cards = catalog.querySelectorAll('.product-card');
  indicatorsContainer.innerHTML = Array.from(cards).map((_, index) => `
    <span class="indicator-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
  `).join('');
  
  // Adiciona evento de clique para os dots
  indicatorsContainer.querySelectorAll('.indicator-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'), 10);
      const card = catalog.querySelectorAll('.product-card')[index];
      if (card) {
        // Encontra o scroll exacto
        catalog.scrollTo({
          left: card.offsetLeft - catalog.offsetLeft - 16,
          behavior: 'smooth'
        });
      }
    });
  });
}

function updateActiveIndicator() {
  const catalog = document.getElementById('catalog-container');
  const dots = document.querySelectorAll('.carousel-indicators .indicator-dot');
  if (!catalog || dots.length === 0) return;
  
  const cards = catalog.querySelectorAll('.product-card');
  const scrollPosition = catalog.scrollLeft;
  const containerWidth = catalog.offsetWidth;
  
  let activeIndex = 0;
  let minDistance = Infinity;
  
  cards.forEach((card, idx) => {
    const cardCenter = card.offsetLeft - catalog.offsetLeft - (containerWidth / 2) + (card.offsetWidth / 2);
    const distance = Math.abs(scrollPosition - cardCenter);
    if (distance < minDistance) {
      minDistance = distance;
      activeIndex = idx;
    }
  });
  
  dots.forEach((dot, idx) => {
    if (idx === activeIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// --- PAINEL DO TWEAK DE CONFIGURAÇÃO (SIMULADOR DE RESPOSTA DA API) ---
function initTweakPanel() {
  const panel = document.getElementById('tweak-panel');
  const toggle = document.getElementById('tweak-toggle');
  const presetsList = document.getElementById('theme-presets-list');
  
  if (!panel || !toggle || !presetsList) return;
  
  // Abre/fecha painel ao clicar no botão
  toggle.addEventListener('click', () => {
    panel.classList.toggle('expanded');
  });

  // Fecha painel ao clicar fora dele
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target)) {
      panel.classList.remove('expanded');
    }
  });
  
  // Renderiza botões para selecionar os presets de temas vindos da API
  presetsList.innerHTML = Object.entries(themePresets).map(([key, value]) => `
    <button class="theme-preset-btn ${key === 'darkOrbit' ? 'active' : ''}" data-theme-key="${key}">
      <span>${value.name}</span>
      <div class="theme-colors-preview">
        <span class="color-dot" style="background-color: ${value.primaryColor};"></span>
        <span class="color-dot" style="background-color: ${value.secondaryColor};"></span>
        <span class="color-dot" style="background-color: ${value.backgroundColor};"></span>
      </div>
    </button>
  `).join('');
  
  // Vincula evento de clique em cada tema para simular a resposta da API do usuário
  presetsList.querySelectorAll('.theme-preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Impede o fechamento do painel
      
      const themeKey = btn.getAttribute('data-theme-key');
      const selectedTheme = themePresets[themeKey];
      
      // Aplica o tema na LP
      applyTheme(selectedTheme);
      
      // Atualiza classe active nos botões
      presetsList.querySelectorAll('.theme-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      console.log(`[API SIMULATOR] Novo layout recebido da API externa: ${selectedTheme.name}`, selectedTheme);
    });
  });
}
