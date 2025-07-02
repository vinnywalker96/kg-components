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
  | 'signOut'
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
    signOut: 'Sign Out',
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
    signOut: 'Sair',
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

