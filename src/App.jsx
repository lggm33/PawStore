import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Products from './pages/Products'
import Details from './pages/Details'
import Administration from './pages/Administration'
import EditProduct from './pages/EditProduct'

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname.replace('/', '');
    return path || 'home';
  });
  const [currentProductId, setCurrentProductId] = useState(null)

  const navigate = (page, productId = null) => {
    setCurrentPage(page)
    setCurrentProductId(productId)
    const url = productId ? `/${page}?id=${productId}` : `/${page}`;
    window.history.pushState({ page, productId }, '', url)
  }

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



  if (currentPage === 'home') {
    return <Home navigate={navigate} />
  }
  
  if (currentPage === 'products') {
    return <Products navigate={navigate} />
  }
  
  if (currentPage === 'details') {
    return <Details productId={currentProductId} navigate={navigate} />
  }

  if (currentPage === 'administration') {
    return <Administration navigate={navigate} />
  }

  if (currentPage === 'edit') {
    return <EditProduct productId={currentProductId} navigate={navigate} />
  }

  return <div>Página no encontrada</div>
}

export default App
