'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define translations
const translations = {
  en: {
    // General
    success: 'Success',
    error: 'Error',
    loading: 'Loading...',
    details: 'Details',
    
    // Products
    addToCart: 'Add to Cart',
    adding: 'Adding...',
    addedToCart: 'Product added to cart',
    loginToAddToCart: 'Please log in to add items to your cart',
    errorAddingToCart: 'Error adding product to cart',
    noProductsFound: 'No products found',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    
    // Cart
    cart: 'Cart',
    yourCart: 'Your Cart',
    emptyCart: 'Your cart is empty',
    checkout: 'Checkout',
    continueShopping: 'Continue Shopping',
    removeFromCart: 'Remove',
    cartTotal: 'Total',
    
    // Orders
    orders: 'Orders',
    yourOrders: 'Your Orders',
    noOrders: 'You have no orders yet',
    orderDetails: 'Order Details',
    orderDate: 'Order Date',
    orderStatus: 'Status',
    orderTotal: 'Total',
    
    // Auth
    login: 'Log In',
    logout: 'Log Out',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    
    // User
    profile: 'Profile',
    updateProfile: 'Update Profile',
    name: 'Name',
    phone: 'Phone',
    address: 'Address',
    
    // Admin
    admin: 'Admin',
    dashboard: 'Dashboard',
    users: 'Users',
    products: 'Products',
    categories: 'Categories',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    
    // Banking
    bankingDetails: 'Banking Details',
    bankName: 'Bank Name',
    accountName: 'Account Name',
    accountNumber: 'Account Number',
    branchCode: 'Branch Code',
    swiftCode: 'SWIFT Code',
  },
  pt: {
    // General
    success: 'Sucesso',
    error: 'Erro',
    loading: 'Carregando...',
    details: 'Detalhes',
    
    // Products
    addToCart: 'Adicionar ao Carrinho',
    adding: 'Adicionando...',
    addedToCart: 'Produto adicionado ao carrinho',
    loginToAddToCart: 'Faça login para adicionar itens ao seu carrinho',
    errorAddingToCart: 'Erro ao adicionar produto ao carrinho',
    noProductsFound: 'Nenhum produto encontrado',
    outOfStock: 'Fora de Estoque',
    inStock: 'Em Estoque',
    
    // Cart
    cart: 'Carrinho',
    yourCart: 'Seu Carrinho',
    emptyCart: 'Seu carrinho está vazio',
    checkout: 'Finalizar Compra',
    continueShopping: 'Continuar Comprando',
    removeFromCart: 'Remover',
    cartTotal: 'Total',
    
    // Orders
    orders: 'Pedidos',
    yourOrders: 'Seus Pedidos',
    noOrders: 'Você ainda não tem pedidos',
    orderDetails: 'Detalhes do Pedido',
    orderDate: 'Data do Pedido',
    orderStatus: 'Status',
    orderTotal: 'Total',
    
    // Auth
    login: 'Entrar',
    logout: 'Sair',
    register: 'Registrar',
    email: 'Email',
    password: 'Senha',
    forgotPassword: 'Esqueceu a Senha?',
    resetPassword: 'Redefinir Senha',
    
    // User
    profile: 'Perfil',
    updateProfile: 'Atualizar Perfil',
    name: 'Nome',
    phone: 'Telefone',
    address: 'Endereço',
    
    // Admin
    admin: 'Admin',
    dashboard: 'Painel',
    users: 'Usuários',
    products: 'Produtos',
    categories: 'Categorias',
    addProduct: 'Adicionar Produto',
    editProduct: 'Editar Produto',
    deleteProduct: 'Excluir Produto',
    
    // Banking
    bankingDetails: 'Dados Bancários',
    bankName: 'Nome do Banco',
    accountName: 'Nome da Conta',
    accountNumber: 'Número da Conta',
    branchCode: 'Código da Agência',
    swiftCode: 'Código SWIFT',
  }
}

type Language = 'en' | 'pt'
type TranslationKey = keyof typeof translations.en

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  
  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt')) {
      setLanguage(savedLanguage)
    }
  }, [])
  
  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }
  
  const translate = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key
  }
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

