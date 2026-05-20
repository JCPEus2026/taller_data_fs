import { useState } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Rating from './pages/Rating'
import Search from './pages/Search'
import SearchDetail from './pages/SearchDetail'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedProperty, setSelectedProperty] = useState(null)

  const navigate = (page, data = null) => {
    setCurrentPage(page)
    if (data) setSelectedProperty(data)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':       return <Home navigate={navigate} />
      case 'login':      return <Login navigate={navigate} />
      case 'rating':     return <Rating navigate={navigate} />
      case 'search':     return <Search navigate={navigate} />
      case 'detail':     return <SearchDetail navigate={navigate} property={selectedProperty} />
      case 'contact':    return <Contact navigate={navigate} />
      case 'profile':    return <Profile navigate={navigate} />
      default:           return <Home navigate={navigate} />
    }
  }

  return (
    <AuthProvider>
      <Layout navigate={navigate} currentPage={currentPage}>
        {renderPage()}
      </Layout>
    </AuthProvider>
  )
}