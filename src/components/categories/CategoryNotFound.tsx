import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const CategoryNotFound = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn&apos;t find any tools in this category. It might not exist or might be coming soon!</p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/categories">Browse All Categories</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tools">Browse All Tools</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryNotFound;
