import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import Header from './component/header/header';
import Footer from './component/footer/footer';
import HomePage from './page/HomePage';
import AboutPage from './page/AboutPage';
import NotFoundPage from './page/NotFoundPage';
import LoginPage from './page/LoginPage';
import RegisterPage from './page/RegisterPage';
import AdminPage from './page/AdminPage';
import ProductsPage from './page/ShopPage/ProductsPage';
import ViewDetailsPage from "./page/ShopPage/ViewDetailsPage";
import PaymentPage from "./page/ShopPage/PaymentPage";
import UserProfilePage from './page/UserProfilePage';
import ScrollToTop from './component/ScrollToTop';
import ProtectedRoute from './context/ProtectedRoute';
import store from './store/store';
import ManageUserProfiles from './page/ManageUserProfile';
import ManageKoi from './page/ManageKoi';
import UpdateKoi from "./page/UpdateKoi";
import CreateKoi from "./page/CreateKoi"

function App() {
  const location = useLocation();

  // Define paths that should not have the header and footer
  const excludeHeaderFooterPaths = ['/admin', '/admin/manage-user'];

  const shouldRenderHeaderFooter = !excludeHeaderFooterPaths.includes(location.pathname);

  return (
    <>
    <Provider store={store}>
    <ScrollToTop />
      {shouldRenderHeaderFooter && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute allowedRoles={['0']} />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/manage-user" element={<ManageUserProfiles />} />
        </Route>
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/view-details/:id" element={<ViewDetailsPage />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="manageKoi" element={<ManageKoi />} />
          <Route path="/manageKoi/updateKoi/:id" element={<UpdateKoi />} />
          <Route path="/manageKoi/createKoi" element={<CreateKoi />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {shouldRenderHeaderFooter && <Footer />}
    </Provider>     
    </>
  );
}

export default App;
