'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="container mx-auto py-12">
      <section className="mb-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            KG-Components
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mb-8">
            Your one-stop shop for electronic components, tools, and accessories.
            Quality products for hobbyists, professionals, and businesses.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/shop">
                Shop Now
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Product Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                {category.icon}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <Button variant="outline" asChild>
                  <Link href={`/shop?category=${category.id}`}>
                    Browse {category.name}
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Why Choose KG-Components?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Card className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Browse our extensive catalog of electronic components, tools, and accessories.
            Create an account to save your favorite products and track your orders.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/shop">
                Shop Now
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth">
                Create Account
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}

// Sample data
const categories = [
  {
    id: 'tools',
    name: 'Tools',
    description: 'Quality tools for electronics work, from soldering irons to precision screwdrivers.',
    icon: <div className="text-4xl">🔧</div>,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Essential accessories for your electronic projects and equipment.',
    icon: <div className="text-4xl">🔌</div>,
  },
  {
    id: 'components',
    name: 'Components',
    description: 'Wide range of electronic components for all your project needs.',
    icon: <div className="text-4xl">🔋</div>,
  },
  {
    id: 'power',
    name: 'Power Products',
    description: 'Power supplies, batteries, and charging solutions for your devices.',
    icon: <div className="text-4xl">⚡</div>,
  },
  {
    id: 'test',
    name: 'Test & Measurement',
    description: 'Precision testing equipment for accurate measurements and diagnostics.',
    icon: <div className="text-4xl">📏</div>,
  },
  {
    id: 'kits',
    name: 'DIY Kits',
    description: 'Educational and fun DIY electronic kits for all skill levels.',
    icon: <div className="text-4xl">🔨</div>,
  },
];

const features = [
  {
    title: 'Quality Products',
    description: 'We source only the highest quality components and tools from trusted manufacturers.',
    icon: <div className="text-2xl">✅</div>,
  },
  {
    title: 'Fast Shipping',
    description: 'Quick processing and shipping to get your orders to you as fast as possible.',
    icon: <div className="text-2xl">🚚</div>,
  },
  {
    title: 'Expert Support',
    description: 'Our team of electronics experts is always ready to help with your questions.',
    icon: <div className="text-2xl">💬</div>,
  },
];

