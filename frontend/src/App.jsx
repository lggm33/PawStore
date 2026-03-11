import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Products from './pages/Products'
import Details from './pages/Details'
import Administration from './pages/Administration'
import EditProduct from './pages/EditProduct'
import Login from './pages/Login'
import LoginRequired from './pages/LoginRequired'
import AdminRequired from './pages/AdminRequired'
import useProductStore from './store/useProductStore'
import useAuthStore from './store/useAuth'

function App() {
  const fetchProducts = useProductStore((state) => state.fetchProducts)

  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname.replace('/', '');
    return path || 'home';
  });
  const [currentProductId, setCurrentProductId] = useState(null)

  const { isAuthenticated, user } = useAuthStore()

  const protectedRoutes = [
    'products',
    'details',
  ]

  const adminRoutes = [
    'administration',
    'edit'
  ]

  const navigate = (page, productId = null) => {
    setCurrentPage(page)
    setCurrentProductId(productId)
    const url = productId ? `/${page}?id=${productId}` : `/${page}`;
    window.history.pushState({ page, productId }, '', url)
  }

  const resolvedPage = (() => {
    const requiresAuth = protectedRoutes.includes(currentPage) || adminRoutes.includes(currentPage)
    const requiresAdmin = adminRoutes.includes(currentPage)

    if (requiresAuth && !isAuthenticated) {
      return 'login-required'
    }
    if (requiresAdmin && user?.role !== 'admin') {
      return 'admin-required'
    }
    return currentPage
  })()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        setCurrentPage(event.state.page);
        setCurrentProductId(event.state.productId);
      } else {
        setCurrentPage('home');
        setCurrentProductId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);



  if (resolvedPage === 'home') {
    return <Home navigate={navigate} />
  }
  
  if (resolvedPage === 'products') {
    return <Products navigate={navigate} />
  }
  
  if (resolvedPage === 'details') {
    return <Details productId={currentProductId} navigate={navigate} />
  }

  if (resolvedPage === 'administration') {
    return <Administration navigate={navigate} />
  }

  if (resolvedPage === 'edit') {
    return <EditProduct productId={currentProductId} navigate={navigate} />
  }

  if (resolvedPage === 'login') {
    return <Login navigate={navigate} />
  }

  if (resolvedPage === 'login-required') {
    return <LoginRequired navigate={navigate} />
  }

  if (resolvedPage === 'admin-required') {
    return <AdminRequired navigate={navigate} />
  }

  return <div>Página no encontrada</div>
}

export default App
