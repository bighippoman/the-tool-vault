
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CategoriesGrid from '@/components/tools/CategoriesGrid';
import { categories } from '@/data/categories';

const CategoriesSection = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <span className="text-2xl">🏷️</span>
              Browse by Category
            </h2>
            <p className="text-muted-foreground mt-2">
              Organized by our most organized hamsters
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/categories">View All Categories</Link>
          </Button>
        </div>
        
        <CategoriesGrid categories={categories} />
      </div>
    </section>
  );
};

export default CategoriesSection;
