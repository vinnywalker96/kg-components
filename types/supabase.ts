export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      banking_details: {
        Row: {
          account_name: string
          account_number: string
          bank_name: string
          branch_code: string | null
          created_at: string
          id: string
          is_default: boolean
          swift_code: string | null
          updated_at: string
        }
        Insert: {
          account_name: string
          account_number: string
          bank_name: string
          branch_code?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          swift_code?: string | null
          updated_at?: string
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_name?: string
          branch_code?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          swift_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_per_unit: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price_per_unit: number
          product_id?: string | null
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_per_unit?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          invoice_sent: boolean
          notes: string | null
          payment_method: string | null
          payment_status: string
          shipping_address: string | null
          shipping_cost: number | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_sent?: boolean
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          shipping_address?: string | null
          shipping_cost?: number | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          invoice_sent?: boolean
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          shipping_address?: string | null
          shipping_cost?: number | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          image_url: string | null
          name: string
          price: number
          stock: number
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          name: string
          price: number
          stock?: number
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

