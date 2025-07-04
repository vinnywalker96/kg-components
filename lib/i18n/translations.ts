export type Language = 'en' | 'pt'

export type TranslationKey = 
  // Common
  | 'language'
  | 'switchToEnglish'
  | 'switchToPortuguese'
  
  // Navigation
  | 'home'
  | 'shop'
  | 'about'
  | 'contact'
  | 'account'
  | 'admin'
  | 'cart'
  | 'orders'
  | 'login'
  | 'signup'
  | 'logout'
  | 'signOut'
  
  // Home Page
  | 'heroTitle'
  | 'heroSubtitle'
  | 'shopNow'
  | 'learnMore'
  | 'browseByCategory'
  | 'viewAllCategories'
  | 'featuredProducts'
  | 'productImage'
  | 'featuredProduct'
  | 'shopAllProducts'
  | 'whyChooseUs'
  | 'qualityGuaranteed'
  | 'qualityGuaranteedDesc'
  | 'fastShipping'
  | 'fastShippingDesc'
  | 'expertSupport'
  | 'expertSupportDesc'
  | 'stayUpdated'
  | 'newsletterDesc'
  | 'emailPlaceholder'
  | 'subscribe'
  
  // About Page
  | 'aboutTitle'
  | 'aboutSubtitle'
  | 'ourStory'
  | 'ourStoryPart1'
  | 'ourStoryPart2'
  | 'ourMission'
  | 'ourMissionText'
  | 'whatSetsUsApart'
  | 'qualityAssurance'
  | 'qualityAssuranceText'
  | 'extensiveSelection'
  | 'extensiveSelectionText'
  | 'expertSupportAboutText'
  | 'fastShippingAboutText'
  | 'ourTeam'
  | 'ourTeamPart1'
  | 'ourTeamPart2'
  | 'sustainabilityCommitment'
  | 'sustainabilityPart1'
  | 'sustainabilityPart2'
  | 'joinOurCommunity'
  | 'joinOurCommunityPart1'
  | 'joinOurCommunityPart2'
  
  // Categories
  | 'tools'
  | 'accessories'
  | 'components'
  | 'powerProducts'
  | 'testMeasurements'
  | 'kits'
  
  // Shop
  | 'shopTitle'
  | 'shopDescription'
  | 'categories'
  | 'price'
  | 'minPrice'
  | 'maxPrice'
  | 'sort'
  | 'sortByNameAsc'
  | 'sortByNameDesc'
  | 'sortByPriceAsc'
  | 'sortByPriceDesc'
  | 'search'
  | 'searchPlaceholder'
  | 'filter'
  | 'clearFilters'
  | 'noProductsFound'
  | 'addToCart'
  | 'viewDetails'
  
  // Product
  | 'productDetails'
  | 'inStock'
  | 'outOfStock'
  | 'quantity'
  | 'relatedProducts'
  
  // Cart
  | 'cartTitle'
  | 'cartEmpty'
  | 'cartTotal'
  | 'checkout'
  | 'continueShopping'
  | 'removeItem'
  | 'updateCart'
  
  // Account
  | 'accountTitle'
  | 'profileInformation'
  | 'updateProfile'
  | 'fullName'
  | 'email'
  | 'phone'
  | 'address'
  | 'saveChanges'
  | 'accountActions'
  | 'adminDashboard'
  | 'goToAdmin'
  
  // Auth
  | 'loginTitle'
  | 'loginDescription'
  | 'signupTitle'
  | 'signupDescription'
  | 'password'
  | 'forgotPassword'
  | 'dontHaveAccount'
  | 'alreadyHaveAccount'
  | 'createAccount'
  
  // Admin
  | 'dashboard'
  | 'products'
  | 'users'
  | 'settings'
  | 'banking'
  | 'userManagement'
  | 'addNewAdmin'
  | 'grantAdminPrivileges'
  | 'userEmail'
  | 'role'
  | 'actions'
  | 'removeAdmin'
  | 'masterAdmin'
  
  // Orders
  | 'ordersTitle'
  | 'orderDetails'
  | 'orderNumber'
  | 'orderDate'
  | 'orderStatus'
  | 'orderTotal'
  | 'paymentStatus'
  | 'paymentMethod'
  | 'shippingAddress'
  | 'orderItems'
  | 'noOrders'
  
  // Categories Management
  | 'addNewCategory'
  | 'editCategory'
  | 'categoryDetails'
  | 'categoryName'
  | 'createCategory'
  | 'confirmDeletion'
  | 'searchCategories'
  | 'noCategories'
  | 'noDescription'
  | 'created'
  | 'categories'
  
  // Misc
  | 'loading'
  | 'error'
  | 'success'
  | 'cancel'
  | 'confirm'
  | 'save'
  | 'edit'
  | 'delete'
  | 'create'
  | 'update'
  | 'view'

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    // Common
    language: 'Language',
    switchToEnglish: 'Switch to English',
    switchToPortuguese: 'Switch to Portuguese',
    
    // Navigation
    home: 'Home',
    shop: 'Shop',
    about: 'About',
    contact: 'Contact',
    account: 'Account',
    admin: 'Admin',
    cart: 'Cart',
    orders: 'Orders',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    signOut: 'Sign Out',
    
    // Home Page
    heroTitle: 'Quality Electronic Components for Your Projects',
    heroSubtitle: 'From resistors to microcontrollers, we have everything you need for your next electronic project.',
    shopNow: 'Shop Now',
    learnMore: 'Learn More',
    browseByCategory: 'Browse by Category',
    viewAllCategories: 'View All Categories',
    featuredProducts: 'Featured Products',
    productImage: 'Product Image',
    featuredProduct: 'Featured Product',
    shopAllProducts: 'Shop All Products',
    whyChooseUs: 'Why Choose KG-Components',
    qualityGuaranteed: 'Quality Guaranteed',
    qualityGuaranteedDesc: 'All our components are sourced from trusted manufacturers and undergo rigorous quality testing.',
    fastShipping: 'Fast Shipping',
    fastShippingDesc: 'We process orders quickly and offer expedited shipping options to get your components when you need them.',
    expertSupport: 'Expert Support',
    expertSupportDesc: 'Our team of electronics experts is available to help you choose the right components for your project.',
    stayUpdated: 'Stay Updated',
    newsletterDesc: 'Subscribe to our newsletter to receive updates on new products, special offers, and electronics tips.',
    emailPlaceholder: 'Your email address',
    subscribe: 'Subscribe',
    
    // Categories
    tools: 'Tools',
    accessories: 'Accessories',
    components: 'Components',
    powerProducts: 'Power Products',
    testMeasurements: 'Test and Measurements',
    kits: 'Kits',
    
    // Shop
    shopTitle: 'Shop',
    shopDescription: 'Browse our selection of electronic components.',
    categories: 'Categories',
    price: 'Price',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    sort: 'Sort',
    sortByNameAsc: 'Name (A-Z)',
    sortByNameDesc: 'Name (Z-A)',
    sortByPriceAsc: 'Price (Low to High)',
    sortByPriceDesc: 'Price (High to Low)',
    search: 'Search',
    searchPlaceholder: 'Search products...',
    filter: 'Filter',
    clearFilters: 'Clear Filters',
    noProductsFound: 'No products found',
    addToCart: 'Add to Cart',
    viewDetails: 'View Details',
    
    // Product
    productDetails: 'Product Details',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    quantity: 'Quantity',
    relatedProducts: 'Related Products',
    
    // Cart
    cartTitle: 'Your Cart',
    cartEmpty: 'Your cart is empty',
    cartTotal: 'Cart Total',
    checkout: 'Checkout',
    continueShopping: 'Continue Shopping',
    removeItem: 'Remove',
    updateCart: 'Update Cart',
    
    // Account
    accountTitle: 'Your Account',
    profileInformation: 'Profile Information',
    updateProfile: 'Update your personal information',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    address: 'Shipping Address',
    saveChanges: 'Save Changes',
    accountActions: 'Account Actions',
    adminDashboard: 'Admin Dashboard',
    goToAdmin: 'Go to Admin',
    
    // Auth
    loginTitle: 'Login to Your Account',
    loginDescription: 'Enter your email and password to access your account',
    signupTitle: 'Create a New Account',
    signupDescription: 'Enter your details to create a new account',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    dontHaveAccount: 'Don\'t have an account?',
    alreadyHaveAccount: 'Already have an account?',
    createAccount: 'Create Account',
    
    // Admin
    dashboard: 'Dashboard',
    products: 'Products',
    users: 'Users',
    settings: 'Settings',
    banking: 'Banking',
    userManagement: 'User Management',
    addNewAdmin: 'Add New Admin',
    grantAdminPrivileges: 'Grant admin privileges to an existing user',
    userEmail: 'User Email',
    role: 'Role',
    actions: 'Actions',
    removeAdmin: 'Remove Admin',
    masterAdmin: 'Master Admin',
    
    // Orders
    ordersTitle: 'Your Orders',
    orderDetails: 'Order Details',
    orderNumber: 'Order Number',
    orderDate: 'Order Date',
    orderStatus: 'Status',
    orderTotal: 'Total',
    paymentStatus: 'Payment Status',
    paymentMethod: 'Payment Method',
    shippingAddress: 'Shipping Address',
    orderItems: 'Order Items',
    noOrders: 'You have no orders',
    
    // About Page
    aboutTitle: 'About KG-Components',
    aboutSubtitle: 'Your trusted source for electronic components and tools',
    ourStory: 'Our Story',
    ourStoryPart1: 'KG-Components was founded in 2023 with a simple mission: to provide electronics enthusiasts, makers, and professionals with high-quality components at competitive prices. What started as a small operation has grown into a comprehensive electronic components supplier serving customers worldwide.',
    ourStoryPart2: 'We understand the frustration of working on a project only to discover you\'re missing a critical component or receiving poor-quality parts that don\'t work as expected. That\'s why we\'ve built our business around reliability, quality, and excellent customer service.',
    ourMission: 'Our Mission',
    ourMissionText: 'Our mission is to empower creators and innovators by providing reliable electronic components, tools, and resources. We believe that everyone should have access to the components they need to bring their ideas to life, whether they\'re a hobbyist working on their first Arduino project or a professional engineer developing cutting-edge technology.',
    whatSetsUsApart: 'What Sets Us Apart',
    qualityAssurance: 'Quality Assurance',
    qualityAssuranceText: 'Every component we sell undergoes rigorous quality testing to ensure it meets our high standards. We source directly from reputable manufacturers and authorized distributors to guarantee authenticity.',
    extensiveSelection: 'Extensive Selection',
    extensiveSelectionText: 'From resistors and capacitors to microcontrollers and development boards, we offer a comprehensive range of components for all your electronic needs. Our catalog is constantly expanding to include the latest technologies.',
    expertSupportAboutText: 'Our team consists of electronics enthusiasts and professionals who understand your needs. We\'re always ready to help you find the right components for your project or answer any technical questions.',
    fastShippingAboutText: 'We know that waiting for components can delay your entire project. That\'s why we process orders quickly and offer expedited shipping options to get your components to you as soon as possible.',
    ourTeam: 'Our Team',
    ourTeamPart1: 'Behind KG-Components is a team of passionate electronics enthusiasts, engineers, and customer service professionals dedicated to providing you with the best possible experience.',
    ourTeamPart2: 'Our team members bring diverse backgrounds and expertise in electronics, from analog circuit design to embedded systems programming. This collective knowledge allows us to better understand and serve the needs of our customers.',
    sustainabilityCommitment: 'Sustainability Commitment',
    sustainabilityPart1: 'We\'re committed to reducing our environmental impact. We use eco-friendly packaging materials whenever possible and are continuously working to optimize our operations for sustainability.',
    sustainabilityPart2: 'Additionally, we offer resources on proper electronic waste disposal and participate in recycling programs for electronic components and devices.',
    joinOurCommunity: 'Join Our Community',
    joinOurCommunityPart1: 'KG-Components is more than just a supplier—we\'re a community of makers, creators, and innovators. Follow us on social media to stay updated on new products, technical tips, and inspiring projects from our community.',
    joinOurCommunityPart2: 'We also regularly publish tutorials, project ideas, and technical articles on our blog to help you make the most of your electronic components.',
    
    // Categories Management
    addNewCategory: 'Add New Category',
    editCategory: 'Edit Category',
    categoryDetails: 'Category Details',
    categoryName: 'Category Name',
    createCategory: 'Create Category',
    confirmDeletion: 'Confirm Deletion',
    searchCategories: 'Search categories...',
    noCategories: 'No categories found.',
    noDescription: 'No description',
    created: 'Created',
    categories: 'Categories',
    
    // Misc
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create',
    update: 'Update',
    view: 'View'
  },
  
  pt: {
    // Common
    language: 'Idioma',
    switchToEnglish: 'Mudar para Inglês',
    switchToPortuguese: 'Mudar para Português',
    
    // Navigation
    home: 'Início',
    shop: 'Loja',
    about: 'Sobre',
    contact: 'Contato',
    account: 'Conta',
    admin: 'Admin',
    cart: 'Carrinho',
    orders: 'Pedidos',
    login: 'Entrar',
    signup: 'Cadastrar',
    logout: 'Sair',
    signOut: 'Sair',
    
    // Home Page
    heroTitle: 'Componentes Eletrônicos de Qualidade para Seus Projetos',
    heroSubtitle: 'De resistores a microcontroladores, temos tudo o que você precisa para seu próximo projeto eletrônico.',
    shopNow: 'Comprar Agora',
    learnMore: 'Saiba Mais',
    browseByCategory: 'Navegar por Categoria',
    viewAllCategories: 'Ver Todas as Categorias',
    featuredProducts: 'Produtos em Destaque',
    productImage: 'Imagem do Produto',
    featuredProduct: 'Produto em Destaque',
    shopAllProducts: 'Ver Todos os Produtos',
    whyChooseUs: 'Por Que Escolher KG-Components',
    qualityGuaranteed: 'Qualidade Garantida',
    qualityGuaranteedDesc: 'Todos os nossos componentes são provenientes de fabricantes confiáveis e passam por rigorosos testes de qualidade.',
    fastShipping: 'Envio Rápido',
    fastShippingDesc: 'Processamos pedidos rapidamente e oferecemos opções de envio expresso para que você receba seus componentes quando precisar.',
    expertSupport: 'Suporte Especializado',
    expertSupportDesc: 'Nossa equipe de especialistas em eletrônica está disponível para ajudá-lo a escolher os componentes certos para o seu projeto.',
    stayUpdated: 'Mantenha-se Atualizado',
    newsletterDesc: 'Assine nossa newsletter para receber atualizações sobre novos produtos, ofertas especiais e dicas de eletrônica.',
    emailPlaceholder: 'Seu endereço de email',
    subscribe: 'Assinar',
    
    // Categories
    tools: 'Ferramentas',
    accessories: 'Acessórios',
    components: 'Componentes',
    powerProducts: 'Produtos de Energia',
    testMeasurements: 'Teste e Medição',
    kits: 'Kits',
    
    // Shop
    shopTitle: 'Loja',
    shopDescription: 'Navegue por nossa seleção de componentes eletrônicos.',
    categories: 'Categorias',
    price: 'Preço',
    minPrice: 'Preço Mínimo',
    maxPrice: 'Preço Máximo',
    sort: 'Ordenar',
    sortByNameAsc: 'Nome (A-Z)',
    sortByNameDesc: 'Nome (Z-A)',
    sortByPriceAsc: 'Preço (Menor para Maior)',
    sortByPriceDesc: 'Preço (Maior para Menor)',
    search: 'Buscar',
    searchPlaceholder: 'Buscar produtos...',
    filter: 'Filtrar',
    clearFilters: 'Limpar Filtros',
    noProductsFound: 'Nenhum produto encontrado',
    addToCart: 'Adicionar ao Carrinho',
    viewDetails: 'Ver Detalhes',
    
    // Product
    productDetails: 'Detalhes do Produto',
    inStock: 'Em Estoque',
    outOfStock: 'Fora de Estoque',
    quantity: 'Quantidade',
    relatedProducts: 'Produtos Relacionados',
    
    // Cart
    cartTitle: 'Seu Carrinho',
    cartEmpty: 'Seu carrinho está vazio',
    cartTotal: 'Total do Carrinho',
    checkout: 'Finalizar Compra',
    continueShopping: 'Continuar Comprando',
    removeItem: 'Remover',
    updateCart: 'Atualizar Carrinho',
    
    // Account
    accountTitle: 'Sua Conta',
    profileInformation: 'Informações do Perfil',
    updateProfile: 'Atualize suas informações pessoais',
    fullName: 'Nome Completo',
    email: 'Email',
    phone: 'Telefone',
    address: 'Endereço de Entrega',
    saveChanges: 'Salvar Alterações',
    accountActions: 'Ações da Conta',
    adminDashboard: 'Painel de Administração',
    goToAdmin: 'Ir para Admin',
    
    // Auth
    loginTitle: 'Entrar na Sua Conta',
    loginDescription: 'Digite seu email e senha para acessar sua conta',
    signupTitle: 'Criar uma Nova Conta',
    signupDescription: 'Digite seus dados para criar uma nova conta',
    password: 'Senha',
    forgotPassword: 'Esqueceu a senha?',
    dontHaveAccount: 'Não tem uma conta?',
    alreadyHaveAccount: 'Já tem uma conta?',
    createAccount: 'Criar Conta',
    
    // Admin
    dashboard: 'Painel',
    products: 'Produtos',
    users: 'Usuários',
    settings: 'Configurações',
    banking: 'Bancário',
    userManagement: 'Gerenciamento de Usuários',
    addNewAdmin: 'Adicionar Novo Admin',
    grantAdminPrivileges: 'Conceder privilégios de administrador a um usuário existente',
    userEmail: 'Email do Usuário',
    role: 'Função',
    actions: 'Ações',
    removeAdmin: 'Remover Admin',
    masterAdmin: 'Admin Principal',
    
    // Orders
    ordersTitle: 'Seus Pedidos',
    orderDetails: 'Detalhes do Pedido',
    orderNumber: 'Número do Pedido',
    orderDate: 'Data do Pedido',
    orderStatus: 'Status',
    orderTotal: 'Total',
    paymentStatus: 'Status do Pagamento',
    paymentMethod: 'Método de Pagamento',
    shippingAddress: 'Endereço de Entrega',
    orderItems: 'Itens do Pedido',
    noOrders: 'Você não tem pedidos',
    
    // About Page
    aboutTitle: 'Sobre KG-Components',
    aboutSubtitle: 'Sua fonte confiável de componentes eletrônicos e ferramentas',
    ourStory: 'Nossa História',
    ourStoryPart1: 'A KG-Components foi fundada em 2023 com uma missão simples: fornecer a entusiastas de eletrônica, criadores e profissionais componentes de alta qualidade a preços competitivos. O que começou como uma pequena operação cresceu e se tornou um fornecedor abrangente de componentes eletrônicos atendendo clientes em todo o mundo.',
    ourStoryPart2: 'Entendemos a frustração de trabalhar em um projeto apenas para descobrir que está faltando um componente crítico ou receber peças de baixa qualidade que não funcionam como esperado. É por isso que construímos nosso negócio em torno de confiabilidade, qualidade e excelente atendimento ao cliente.',
    ourMission: 'Nossa Missão',
    ourMissionText: 'Nossa missão é capacitar criadores e inovadores fornecendo componentes eletrônicos, ferramentas e recursos confiáveis. Acreditamos que todos devem ter acesso aos componentes necessários para dar vida às suas ideias, seja um hobbyista trabalhando em seu primeiro projeto Arduino ou um engenheiro profissional desenvolvendo tecnologia de ponta.',
    whatSetsUsApart: 'O Que Nos Diferencia',
    qualityAssurance: 'Garantia de Qualidade',
    qualityAssuranceText: 'Cada componente que vendemos passa por rigorosos testes de qualidade para garantir que atenda aos nossos altos padrões. Obtemos produtos diretamente de fabricantes respeitáveis e distribuidores autorizados para garantir a autenticidade.',
    extensiveSelection: 'Seleção Extensiva',
    extensiveSelectionText: 'De resistores e capacitores a microcontroladores e placas de desenvolvimento, oferecemos uma gama abrangente de componentes para todas as suas necessidades eletrônicas. Nosso catálogo está em constante expansão para incluir as tecnologias mais recentes.',
    expertSupportAboutText: 'Nossa equipe é composta por entusiastas de eletrônica e profissionais que entendem suas necessidades. Estamos sempre prontos para ajudá-lo a encontrar os componentes certos para o seu projeto ou responder a quaisquer perguntas técnicas.',
    fastShippingAboutText: 'Sabemos que esperar por componentes pode atrasar todo o seu projeto. É por isso que processamos pedidos rapidamente e oferecemos opções de envio expresso para que seus componentes cheguem até você o mais rápido possível.',
    ourTeam: 'Nossa Equipe',
    ourTeamPart1: 'Por trás da KG-Components está uma equipe de entusiastas apaixonados por eletrônica, engenheiros e profissionais de atendimento ao cliente dedicados a proporcionar a melhor experiência possível.',
    ourTeamPart2: 'Os membros da nossa equipe trazem experiências e conhecimentos diversos em eletrônica, desde design de circuitos analógicos até programação de sistemas embarcados. Esse conhecimento coletivo nos permite entender e atender melhor às necessidades de nossos clientes.',
    sustainabilityCommitment: 'Compromisso com a Sustentabilidade',
    sustainabilityPart1: 'Estamos comprometidos em reduzir nosso impacto ambiental. Usamos materiais de embalagem ecológicos sempre que possível e estamos continuamente trabalhando para otimizar nossas operações para a sustentabilidade.',
    sustainabilityPart2: 'Além disso, oferecemos recursos sobre o descarte adequado de resíduos eletrônicos e participamos de programas de reciclagem para componentes e dispositivos eletrônicos.',
    joinOurCommunity: 'Junte-se à Nossa Comunidade',
    joinOurCommunityPart1: 'A KG-Components é mais do que apenas um fornecedor—somos uma comunidade de criadores, inventores e inovadores. Siga-nos nas redes sociais para se manter atualizado sobre novos produtos, dicas técnicas e projetos inspiradores de nossa comunidade.',
    joinOurCommunityPart2: 'Também publicamos regularmente tutoriais, ideias de projetos e artigos técnicos em nosso blog para ajudá-lo a aproveitar ao máximo seus componentes eletrônicos.',
    
    // Categories Management
    addNewCategory: 'Adicionar Nova Categoria',
    editCategory: 'Editar Categoria',
    categoryDetails: 'Detalhes da Categoria',
    categoryName: 'Nome da Categoria',
    createCategory: 'Criar Categoria',
    confirmDeletion: 'Confirmar Exclusão',
    searchCategories: 'Buscar categorias...',
    noCategories: 'Nenhuma categoria encontrada.',
    noDescription: 'Sem descrição',
    created: 'Criado em',
    categories: 'Categorias',
    
    // Misc
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Salvar',
    edit: 'Editar',
    delete: 'Excluir',
    create: 'Criar',
    update: 'Atualizar',
    view: 'Visualizar'
  }
}
