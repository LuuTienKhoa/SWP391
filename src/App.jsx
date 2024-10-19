import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import Header from "./component/header/header";
import Footer from "./component/footer/footer";
import HomePage from "./page/HomePage";
import AboutPage from "./page/AboutPage";
import NotFoundPage from "./page/NotFoundPage";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import AdminPage from "./page/AdminPage";
import ProductsPage from "./page/ShopPage/ProductsPage";
import ViewDetailsPage from "./page/ShopPage/ViewDetailsPage";
import PaymentPage from "./page/ShopPage/PaymentPage";
import UserProfilePage from "./page/UserProfilePage";
import ScrollToTop from "./component/ScrollToTop";
import AdminProtectedRoute from "./context/ProtectedRoute";
import ManageUserProfiles from "./page/ManageUserProfile";
import ManageKoi from "./page/ManageKoi";
import UpdateKoi from "./page/UpdateKoi";
import CreateKoi from "./page/CreateKoi";
import ComparisonPage from "./page/ComparisonPage";

function App() {
  const location = useLocation();

  // Define paths that should not have the header and footer
  const excludeHeaderFooterPaths = ["/admin", "/admin/manage-user"];

  const shouldRenderHeaderFooter = !excludeHeaderFooterPaths.includes(
    location.pathname
  );
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');
    if (token) {
      setIsLoggedIn(true);
      setRole(userRole);
    }
  }, []);

  return (
    <>
        <ScrollToTop />
        {shouldRenderHeaderFooter && <Header isLoggedIn={isLoggedIn} role={role} setIsLoggedIn={setIsLoggedIn} />}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/comparison" element={<ComparisonPage />}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-user"
            element={
              <AdminProtectedRoute>
                <ManageUserProfiles />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/manageKoi"
            element={
              <AdminProtectedRoute>
                <ManageKoi />
              </AdminProtectedRoute>
            }
          />
           <Route
        path="/admin/manageKoi/updateKoi/:id"
        element={
          <AdminProtectedRoute>
            <UpdateKoi />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/manageKoi/createKoi"
        element={
          <AdminProtectedRoute>
            <CreateKoi />
          </AdminProtectedRoute>
        }
      />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/view-details/:id" element={<ViewDetailsPage />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {shouldRenderHeaderFooter && <Footer />}
    </>
  );
}

export default App;
