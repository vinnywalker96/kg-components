'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const data = [
  { name: 'Jan', sales: 4000, orders: 24 },
  { name: 'Feb', sales: 3000, orders: 18 },
  { name: 'Mar', sales: 5000, orders: 30 },
  { name: 'Apr', sales: 2780, orders: 16 },
  { name: 'May', sales: 1890, orders: 11 },
  { name: 'Jun', sales: 2390, orders: 14 },
  { name: 'Jul', sales: 3490, orders: 21 },
];

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="products">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Product Management</h2>
            <p>Product management interface will be implemented here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Order Management</h2>
            <p>Order management interface will be implemented here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Customer Management</h2>
            <p>Customer management interface will be implemented here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

