import React, { useState, useEffect } from 'react';
import { Filter, Star, Search, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Shop = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    // Fetch products
    fetch('http://localhost/Spec%20Zone/backend/api/products.php?action=read')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });

    // Fetch categories
    fetch('http://localhost/Spec%20Zone/backend/api/categories.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);
  return (
    <div className="container shop-page">
      <style>{`
        .shop-page .filters-toggle { display: none; }

        .shop-page .shop-sort {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-color: rgba(0, 0, 0, 0.2);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 0.8rem 2.5rem 0.8rem 1rem;
          font-family: inherit;
          font-size: 0.95rem;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239494a0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          transition: all var(--transition-fast);
        }

        .shop-page .shop-sort:hover {
          border-color: var(--border-highlight);
        }

        .shop-page .shop-sort:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.1);
        }

        .shop-page .shop-sort option {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }

        @media (max-width: 900px) {
          .shop-page .shop-sidebar {
            display: none;
            width: 100%;
            order: 2;
          }
          .shop-page .shop-sidebar.filters-open {
            display: block;
          }
          .shop-page .filters-toggle {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
            order: 1;
          }
          .shop-page .shop-main {
            order: 3;
          }
          .shop-page .shop-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          .shop-page .shop-header-controls {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }
          .shop-page .shop-search {
            width: 100%;
          }
          .shop-page .shop-search-input {
            width: 100%;
          }
          .shop-page .shop-sort {
            width: 100%;
          }
        }
      `}</style>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside
          id="filter-panel"
          className={`shop-sidebar glass-panel${filtersOpen ? ' filters-open' : ''}`}
          style={{ padding: '2rem', height: 'fit-content' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <Filter size={20} />
            <h3 style={{ margin: 0 }}>Filters</h3>
          </div>

          <div className="filter-group">
            <h4>Categories</h4>
            {categories.map(cat => (
              <label key={cat.id} className="filter-label">
                <input type="checkbox" value={cat.id} /> {cat.name}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Price Range</h4>
            <label className="filter-label"><input type="radio" name="price" /> Under Rs. 50,000</label>
            <label className="filter-label"><input type="radio" name="price" /> Rs. 50,000 - 100,000</label>
            <label className="filter-label"><input type="radio" name="price" /> Rs. 100,000 - 200,000</label>
            <label className="filter-label"><input type="radio" name="price" /> Over Rs. 200,000</label>
          </div>
          
           <button className="btn btn-primary" style={{ width: '100%' }}>Apply Filters</button>
        </aside>

        <button
          type="button"
          className="btn btn-outline filters-toggle"
          aria-expanded={filtersOpen}
          aria-controls="filter-panel"
          onClick={() => setFiltersOpen(prev => !prev)}
        >
          <Filter size={18} />
          Filters
        </button>

        {/* Main Content */}
        <main className="shop-main">
          <div className="shop-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0 }}>All Components</h2>
            <div className="shop-header-controls" style={{ display: 'flex', gap: '1rem' }}>
              <div className="shop-search" style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input type="text" placeholder="Search..." className="form-control shop-search-input" style={{ paddingLeft: '2.5rem' }} />
              </div>
              <select className="form-control shop-sort">
                <option>Sort by: Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>

          <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {loading ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p>No products available yet.</p>
            ) : (
              products.map((product) => (
                <div className="product-card" key={product.id}>
                  <Link to={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ position: 'relative', height: '200px', backgroundColor: 'rgba(0,0,0,0.3)', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', overflow: 'hidden' }}>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                          <ImageIcon size={48} color="var(--text-secondary)" />
                        </div>
                      )}
                      {product.stock <= 0 && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--danger)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          Out of Stock
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      {product.category_name}
                    </div>
                    
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: '1.3' }}>{product.name}</h3>
                    </Link>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1rem' }}>
                    <Star size={16} color="var(--warning)" fill="var(--warning)" />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>--</span>
                  </div>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>Rs. {parseFloat(product.price).toLocaleString('en-IN')}</span>
                    {(!user || user.role === 'buyer') && (
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.4rem 0.8rem' }}
                        onClick={() => {
                          if(!user) alert("Please login first to add to cart!");
                          else addToCart(product.id, 1);
                        }}
                      >
                        Cart
                      </button>
                    )}
                  </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;
