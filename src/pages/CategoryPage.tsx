import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'
import CategoryLayout from '../components/CategoryLayout'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import FeaturedProducts from '../components/FeaturedProducts'

const CategoryPage: React.FC = () => {
  const location = useLocation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Extract category from pathname
  const category = location.pathname.slice(1) // Remove leading slash

  useEffect(() => {
    if (category) {
      fetchCategoryProducts()
    }
  }, [category])

  const fetchCategoryProducts = async () => {
    if (!category) return

    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching category products:', error)
      setError('Failed to load products for this category')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryTitle = () => {
    if (!category) return ''
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getCategoryDescription = () => {
    const descriptions: Record<string, string> = {
      'beds': 'Comfortable beds and mattresses designed for hostel rooms and student accommodation.',
      'stationary': 'Essential stationery items and study accessories for students and professionals.',
      'bathware': 'Bathroom essentials and accessories for modern hostel and dorm facilities.',
      'dorm': 'Complete dorm room essentials and furniture for comfortable student living.',
      'new-collections': 'Latest arrivals and trending products from our newest collections.'
    }
    return descriptions[category] || `Discover our curated collection of ${getCategoryTitle().toLowerCase()} products.`
  }

  if (loading) {
    return (
      <CategoryLayout 
        title={getCategoryTitle()} 
        description={getCategoryDescription()}
      >
        <LoadingSpinner size="lg" className="py-12" />
      </CategoryLayout>
    )
  }

  if (error) {
    return (
      <CategoryLayout 
        title={getCategoryTitle()} 
        description={getCategoryDescription()}
      >
        <ErrorMessage message={error} onRetry={fetchCategoryProducts} />
      </CategoryLayout>
    )
  }

  return (
    <>
      <CategoryLayout 
        title={getCategoryTitle()} 
        description={getCategoryDescription()}
      >
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              Check back soon for new {getCategoryTitle().toLowerCase()} products!
            </p>
          </div>
        )}
      </CategoryLayout>
      
      {/* Show featured products on category pages */}
      {products.length > 0 && (
        <div className="bg-gray-50">
          <FeaturedProducts />
        </div>
      )}
    </>
  )
}

export default CategoryPage