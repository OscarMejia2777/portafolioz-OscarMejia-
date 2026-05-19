import { useState, useMemo } from 'react'

interface Product {
  id: number
  name: string
  category: string
  price: number
  image: string
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 129, image: '🎧' },
  { id: 2, name: 'Leather Notebook', category: 'Stationery', price: 24, image: '📓' },
  { id: 3, name: 'Minimalist Watch', category: 'Accessories', price: 199, image: '⌚' },
  { id: 4, name: 'Desk Lamp', category: 'Home', price: 59, image: '💡' },
  { id: 5, name: 'Canvas Backpack', category: 'Accessories', price: 89, image: '🎒' },
  { id: 6, name: 'Mechanical Keyboard', category: 'Electronics', price: 149, image: '⌨️' },
  { id: 7, name: 'Ceramic Mug', category: 'Home', price: 19, image: '☕' },
  { id: 8, name: 'Plant Pot Set', category: 'Home', price: 34, image: '🪴' },
]

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Home', 'Stationery']

function ShopHub() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState<Product[]>([])

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === 'All' || p.category === category
      return matchSearch && matchCategory
    })
  }, [search, category])

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product])
  }

  const total = cart.length

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <header className="border-b border-zinc-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">ShopHub</h1>
          <button className="relative px-4 py-2 bg-zinc-800 rounded-lg text-sm hover:bg-zinc-700 transition-colors">
            Cart ({total})
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-8 mt-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  category === cat ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(product => (
            <div key={product.id} className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 hover:border-zinc-600 transition-all">
              <div className="text-4xl mb-3">{product.image}</div>
              <h3 className="font-medium text-white">{product.name}</h3>
              <p className="text-xs text-zinc-500 mt-1">{product.category}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-white">${product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="px-3 py-1.5 bg-white text-zinc-900 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-zinc-500 mt-12">No products found.</p>
        )}
      </main>
    </div>
  )
}

export default ShopHub
