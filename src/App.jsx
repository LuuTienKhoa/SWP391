
import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom';
import Header from './component/header/Header';
import Footer from './component/footer/Footer';
import HomePage from './page/HomePage';
import AboutPage from './page/AboutPage';
import NotFoundPage from './page/NotFoundPage';
import LoginPage from './page/LoginPage';
function App() {
  return (   
    <>
      <Header />
      <main>
      <Routes>
          <Route path="/" element={<HomePage />} />  
          <Route path="/home" element={<Navigate to="/" />} />  
          <Route path="/about" element={<AboutPage />} />    
          <Route path="/login" element={<LoginPage />} />    
          <Route path="*" element={<NotFoundPage />} />    
        </Routes>    
      </main>       
      <Footer />
    </>
  )
}

export default App
