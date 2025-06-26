import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const ToolNotFound = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find the tool you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/tools">Browse All Tools</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ToolNotFound;
