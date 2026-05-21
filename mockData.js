// Simulação de resposta da API Externa
// O usuário poderá editar estes campos e as cores na API para personalizar a LP.
export const mockData = {
  profile: {
    logo: "assets/logo.png",
    companyName: "Orbit",
    bio: "Elevamos seu negócio ao próximo nível com ecossistemas de IA, automações inteligentes e interfaces digitais de alta fidelidade.",
    contactButton: {
      text: "Entre em Contato",
      action: "open_form", // "open_form" para abrir o modal do formulário
      placeholderMessage: "Olá! Gostaria de saber mais sobre os serviços da Orbit."
    }
  },
  socials: [
    { name: "instagram", url: "https://instagram.com/orbit", icon: "instagram" },
    { name: "whatsapp", url: "https://wa.me/5511999999999?text=Ol%C3%A1%21+Vim+da+landing+page%21", icon: "whatsapp" },
    { name: "linkedin", url: "https://linkedin.com/company/orbit", icon: "linkedin" },
    { name: "youtube", url: "https://youtube.com/orbit", icon: "youtube" },
    { name: "github", url: "https://github.com/orbit", icon: "github" }
  ],
  products: [
    {
      id: "prod-1",
      name: "Consultoria IA & Automação",
      description: "Desenvolvimento de agentes e fluxos com inteligência artificial para otimizar vendas e reduzir tempo de resposta.",
      price: "A partir de R$ 1.499",
      image: "assets/product_ai.png",
      buttonText: "Falar com Consultor",
      link: "#contato" // Abre o formulário passando esse serviço
    },
    {
      id: "prod-2",
      name: "Plataforma Orbit SaaS",
      description: "Assinatura mensal para controle de agendamentos online, reengajamento automatizado de clientes e CRM inteligente.",
      price: "R$ 199/mês",
      image: "assets/product_saas.png",
      buttonText: "Iniciar Teste Grátis",
      link: "#contato"
    },
    {
      id: "prod-3",
      name: "Desenvolvimento Web Premium",
      description: "Sites institucionais, Landing Pages de alta conversão e Web Applications sob medida com performance impecável.",
      price: "Sob Consulta",
      image: "assets/product_dev.png",
      buttonText: "Solicitar Orçamento",
      link: "#contato"
    },
    {
      id: "prod-4",
      name: "UI/UX & Design de Produto",
      description: "Criação de marcas, identidades visuais marcantes e protótipos de alta fidelidade que encantam usuários.",
      price: "A partir de R$ 3.500",
      image: "assets/product_design.png",
      buttonText: "Ver Portfólio",
      link: "#contato"
    }
  ],
  theme: {
    // Configurações de estilo que virão da API editadas pelo usuário
    fontFamily: "Outfit", // Fontes suportadas: "Outfit", "Inter", "Poppins", "Montserrat", "Playfair Display"
    borderRadius: "16px", // "4px" (retangular), "16px" (arredondado), "30px" (muito arredondado)
    shadowIntensity: "medium", // "none", "soft", "medium", "strong"
    glassmorphism: true, // Efeito de desfoque de fundo atrás de cards e botões

    // Paleta de Cores
    backgroundColor: "#080710",
    backgroundGradient: "linear-gradient(135deg, #090812 0%, #120e2e 50%, #030206 100%)",
    primaryColor: "#7c3aed", // Cor principal do CTA e detalhes (Roxo Orbit)
    primaryHoverColor: "#6d28d9",
    secondaryColor: "#06b6d4", // Cor secundária de destaque (Ciano)
    textColor: "#ffffff", // Cor principal dos textos
    textMutedColor: "#9ca3af", // Cor dos textos secundários/descrições
    cardBackground: "rgba(255, 255, 255, 0.04)", // Cor do card
    cardBorderColor: "rgba(255, 255, 255, 0.08)",
    cardTextColor: "#f3f4f6"
  }
};

// Preset de temas para demonstração no painel do usuário (Tweak do site)
export const themePresets = {
  darkOrbit: {
    name: "Dark Orbit",
    fontFamily: "Outfit",
    borderRadius: "16px",
    shadowIntensity: "medium",
    glassmorphism: true,
    backgroundColor: "#080710",
    backgroundGradient: "linear-gradient(135deg, #090812 0%, #120e2e 50%, #030206 100%)",
    primaryColor: "#7c3aed",
    primaryHoverColor: "#6d28d9",
    secondaryColor: "#06b6d4",
    textColor: "#ffffff",
    textMutedColor: "#9ca3af",
    cardBackground: "rgba(255, 255, 255, 0.04)",
    cardBorderColor: "rgba(255, 255, 255, 0.08)",
    cardTextColor: "#f3f4f6"
  },
  neonCyber: {
    name: "Neon Cyberpunk",
    fontFamily: "Poppins",
    borderRadius: "8px",
    shadowIntensity: "strong",
    glassmorphism: true,
    backgroundColor: "#0a0a0c",
    backgroundGradient: "linear-gradient(180deg, #0d001a 0%, #000000 100%)",
    primaryColor: "#ff007f", // Hot Pink
    primaryHoverColor: "#d6006b",
    secondaryColor: "#00f0ff", // Neon Cyan
    textColor: "#ffffff",
    textMutedColor: "#a1a1aa",
    cardBackground: "rgba(13, 2, 33, 0.6)",
    cardBorderColor: "rgba(255, 0, 127, 0.2)",
    cardTextColor: "#ffffff"
  },
  minimalLight: {
    name: "Minimalist Light",
    fontFamily: "Inter",
    borderRadius: "24px",
    shadowIntensity: "soft",
    glassmorphism: false,
    backgroundColor: "#f9fafb",
    backgroundGradient: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
    primaryColor: "#111827", // Charcoal Black
    primaryHoverColor: "#374151",
    secondaryColor: "#4b5563",
    textColor: "#111827",
    textMutedColor: "#6b7280",
    cardBackground: "#ffffff",
    cardBorderColor: "rgba(0, 0, 0, 0.06)",
    cardTextColor: "#1f2937"
  },
  emeraldSunset: {
    name: "Emerald Forest",
    fontFamily: "Montserrat",
    borderRadius: "12px",
    shadowIntensity: "medium",
    glassmorphism: true,
    backgroundColor: "#06130d",
    backgroundGradient: "linear-gradient(135deg, #05140d 0%, #0c2b1d 60%, #020705 100%)",
    primaryColor: "#10b981", // Emerald Green
    primaryHoverColor: "#059669",
    secondaryColor: "#f59e0b", // Amber/Gold
    textColor: "#f3f4f6",
    textMutedColor: "#a7f3d0",
    cardBackground: "rgba(16, 185, 129, 0.04)",
    cardBorderColor: "rgba(16, 185, 129, 0.12)",
    cardTextColor: "#ecfdf5"
  },
  coralWarm: {
    name: "Sunset Coral",
    fontFamily: "Poppins",
    borderRadius: "30px",
    shadowIntensity: "soft",
    glassmorphism: true,
    backgroundColor: "#1f1515",
    backgroundGradient: "linear-gradient(135deg, #1c1111 0%, #3a1c1c 100%)",
    primaryColor: "#f43f5e", // Coral Pink
    primaryHoverColor: "#e11d48",
    secondaryColor: "#fb923c", // Warm Orange
    textColor: "#ffffff",
    textMutedColor: "#fecdd3",
    cardBackground: "rgba(244, 63, 94, 0.04)",
    cardBorderColor: "rgba(244, 63, 94, 0.1)",
    cardTextColor: "#fff5f5"
  }
};
