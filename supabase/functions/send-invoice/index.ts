// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/runtime/manual/getting_started

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    const { orderId, userEmail, bankingDetails } = await req.json()
    
    if (!orderId || !userEmail) {
      return new Response(
        JSON.stringify({ error: 'Order ID and user email are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    
    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }
    
    // Get order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        product:products(
          name,
          image_url
        )
      `)
      .eq('order_id', orderId)
    
    if (itemsError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch order items' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Get user details
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('name, email, address')
      .eq('id', order.user_id)
      .single()
    
    if (userError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user details' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Get banking details if not provided
    let bankDetails = bankingDetails
    if (!bankDetails) {
      const { data: bankData, error: bankError } = await supabase
        .from('banking_details')
        .select('*')
        .eq('is_default', true)
        .single()
      
      if (bankError || !bankData) {
        return new Response(
          JSON.stringify({ error: 'No banking details found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      bankDetails = bankData
    }
    
    // Generate invoice HTML
    const invoiceHtml = generateInvoiceHtml(order, orderItems, bankDetails, userProfile)
    
    // Send email
    const client = new SmtpClient()
    
    await client.connectTLS({
      hostname: Deno.env.get('SMTP_HOSTNAME') || '',
      port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
      username: Deno.env.get('SMTP_USERNAME') || '',
      password: Deno.env.get('SMTP_PASSWORD') || '',
    })
    
    await client.send({
      from: Deno.env.get('EMAIL_FROM') || 'noreply@kg-components.com',
      to: userEmail,
      subject: `Invoice #${order.id.substring(0, 8)} for your order at KG-Components`,
      content: 'Please see the attached invoice.',
      html: invoiceHtml,
    })
    
    await client.close()
    
    // Update order to mark invoice as sent
    await supabase
      .from('orders')
      .update({ invoice_sent: true })
      .eq('id', orderId)
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Helper function to generate invoice HTML
function generateInvoiceHtml(order, orderItems, bankingDetails, userDetails) {
  // Calculate subtotal
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price_per_unit * item.quantity,
    0
  )
  
  // Format date
  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // Generate HTML for the invoice
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice #${order.id.substring(0, 8)}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #eee;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .invoice-details {
          margin-bottom: 40px;
        }
        .invoice-details-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .invoice-table th, .invoice-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .invoice-table th {
          background-color: #f8f8f8;
        }
        .invoice-total {
          margin-top: 20px;
          text-align: right;
        }
        .invoice-total-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 5px;
        }
        .invoice-total-row span:first-child {
          width: 150px;
          text-align: right;
          margin-right: 20px;
        }
        .invoice-payment {
          margin-top: 40px;
          padding: 20px;
          background-color: #f8f8f8;
          border-radius: 5px;
        }
        .invoice-payment h3 {
          margin-top: 0;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div>
            <h1>INVOICE</h1>
            <p>KG-Components</p>
          </div>
          <div>
            <h2>Invoice #${order.id.substring(0, 8)}</h2>
            <p>Date: ${orderDate}</p>
          </div>
        </div>
        
        <div class="invoice-details">
          <div class="invoice-details-row">
            <div>
              <h3>Bill To:</h3>
              <p>${userDetails.name}<br>
              ${userDetails.email}<br>
              ${userDetails.address || 'No address provided'}</p>
            </div>
            <div>
              <h3>Ship To:</h3>
              <p>${order.shipping_address || 'No shipping address provided'}</p>
            </div>
          </div>
        </div>
        
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderItems.map(item => `
              <tr>
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price_per_unit.toFixed(2)}</td>
                <td>$${(item.price_per_unit * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="invoice-total">
          <div class="invoice-total-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="invoice-total-row">
            <span>Shipping:</span>
            <span>${order.shipping_cost ? `$${order.shipping_cost.toFixed(2)}` : 'Free'}</span>
          </div>
          <div class="invoice-total-row" style="font-weight: bold; font-size: 1.2em;">
            <span>Total:</span>
            <span>$${order.total_amount.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="invoice-payment">
          <h3>Payment Information</h3>
          <p>Please make payment to the following bank account:</p>
          <p>
            <strong>Bank Name:</strong> ${bankingDetails.bank_name}<br>
            <strong>Account Name:</strong> ${bankingDetails.account_name}<br>
            <strong>Account Number:</strong> ${bankingDetails.account_number}<br>
            ${bankingDetails.branch_code ? `<strong>Branch Code:</strong> ${bankingDetails.branch_code}<br>` : ''}
            ${bankingDetails.swift_code ? `<strong>Swift Code:</strong> ${bankingDetails.swift_code}<br>` : ''}
          </p>
          <p>Please include your invoice number (${order.id.substring(0, 8)}) as the payment reference.</p>
        </div>
        
        <div style="margin-top: 40px; text-align: center;">
          <p>Thank you for your business!</p>
          <p>If you have any questions, please contact us at support@kg-components.com</p>
        </div>
      </div>
    </body>
    </html>
  `
}

