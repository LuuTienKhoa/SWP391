
import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom';
import Header from './component/header/header';
import Footer from './component/footer/footer';
import HomePage from './page/HomePage';
import AboutPage from './page/AboutPage';
import NotFoundPage from './page/NotFoundPage';
import LoginPage from './page/LoginPage';
import RegisterPage from './page/RegisterPage'
import AdminPage from './page/AdminPage'
import ShopPage from './page/ShopPage';
import UserProfilePage from './page/UserProfilePage'
import ScrollToTop from './component/ScrollToTop';
function App() {
  return (   
    <>
      <ScrollToTop />
      <Header />
      <main>
      <Routes>
          <Route path="/" element={<HomePage />} />  
          <Route path="/home" element={<Navigate to="/" />} />  
          <Route path="/about" element={<AboutPage />} />   
          <Route path="/shop" element={<ShopPage />} />    
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/register" element={<RegisterPage />} />    
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />    
        </Routes>    
      </main>       
      <Footer />
    </>
  )
}

export default App
