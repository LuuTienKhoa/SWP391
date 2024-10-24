import "./App.css";
import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "./component/header/header";
import Footer from "./component/footer/footer";
import HomePage from "./page/HomePage";
import AboutPage from "./page/AboutPage";
import NotFoundPage from "./page/NotFound/NotFoundPage";
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
import ManageKoi from "./page/ManageKoi/ManageKoi";
import UpdateKoi from "./page/ManageKoi/UpdateKoi";
import CreateKoi from "./page/ManageKoi/CreateKoi";
import ComparisonPage from "./page/ComparisonPage";
import ManagePromotion from "./page/ManagePromotion/ManagePromotion";
import UpdatePromotion from "./page/ManagePromotion/UpdatePromotion";
import CreatePromotion from "./page/ManagePromotion/CreatePromotion";
import KoiBatchPage from "./page/KoiBatch/KoiBatchPage";
import ManageKoiBatch from "./page/KoiBatch/ManageKoiBatch";
import BlogPage from "./page/Blog/BlogPage";
import UserBlogPage from "./page/Blog/UserBlogPage";
import ManageFeedback from "./page/ManageFeedback/ManageFeedback"
import OrderPage from "./page/OrderPage"
import ManageOrder from "./page/ManageOrder/ManageOrder";
import UpdateOrder from "./page/ManageOrder/UpdateOrder";
import StaffPage from "./page/StaffPage"
import StaffProtectedRoute from "./context/StaffProtectedRoute";
import StaffLayout from "./layouts/StaffLayout";
import AdminLayout from "./layouts/AdminLayout";
import ManageConsignmentPage from "./page/Consignment/ManageConsign";
import ConsignmentPage from "./page/Consignment/ConsignmentPage";

function App() {
  const location = useLocation();

  // Loại bỏ header và footer cho tất cả các trang bắt đầu bằng /admin hoặc /staff
  const shouldRenderHeaderFooter = !(
    location.pathname.startsWith("/admin") || location.pathname.startsWith("/staff")
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
      {shouldRenderHeaderFooter && (
        <Header
          isLoggedIn={isLoggedIn}
          role={role}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/comparison" element={<ComparisonPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/userBlog" element={<UserBlogPage />} />
          <Route path="/consign" element={<ConsignmentPage />} />

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminPage />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-user"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <ManageUserProfiles />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/manageKoi"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <ManageKoi />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/manageKoi/updateKoi/:id"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <UpdateKoi />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/manageKoi/createKoi"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <CreateKoi />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/managePromotion"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <ManagePromotion />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/managePromotion/updatePromotion/:id"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <UpdatePromotion />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/managePromotion/createPromotion"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <CreatePromotion />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />     
          <Route
            path="/admin/manageKoiBatch/"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <ManageKoiBatch />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />     
          <Route
            path="/admin/manageFeedback/"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <ManageFeedback />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />    
          <Route
            path="/admin/manageOrder/"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <ManageOrder />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />    
          <Route
            path="/admin/manageOrder/updateOrder/:id"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <UpdateOrder />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />  
             <Route
            path="/admin/manageConsign"
            element={
              <StaffProtectedRoute>
                <StaffLayout>
                  <ManageConsignmentPage />
                </StaffLayout>
              </StaffProtectedRoute>
            }
          />  
            <Route
            path="/staff"
            element={
              <StaffProtectedRoute>
                <StaffLayout>
                  <StaffPage />
                </StaffLayout>
              </StaffProtectedRoute>
            }
          />                 
          <Route
            path="/staff/manageConsign"
            element={
              <StaffProtectedRoute>
                <StaffLayout>
                  <ManageConsignmentPage />
                </StaffLayout>
              </StaffProtectedRoute>
            }
          />  
          <Route
            path="/staff/manage-user"
            element={
              <StaffProtectedRoute>
                <StaffLayout>
                  <ManageUserProfiles />
                </StaffLayout>
              </StaffProtectedRoute>
            }
          />     
          <Route
            path="/staff/managePromotion"
            element={
              <StaffProtectedRoute>
                <StaffLayout>
                  <ManagePromotion />
                </StaffLayout>
              </StaffProtectedRoute>
            }
          />     
           <Route
            path="/staff/manageKoi"
            element={
              <StaffProtectedRoute>
                <StaffLayout>
                  <ManageKoi />
                </StaffLayout>
              </StaffProtectedRoute>
            }
          />     
          <Route
            path="/staff/manageKoiBatch"
            element={
              <StaffProtectedRoute>
                <StaffLayout>
                  <ManageKoiBatch />
                </StaffLayout>
              </StaffProtectedRoute>
            }
          />     
          <Route
            path="/staff/manageOrder"
            element={
              <StaffProtectedRoute>
                <StaffLayout>
                  <ManageOrder />
                </StaffLayout>
              </StaffProtectedRoute>
            }
          />     

          
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/view-details/:id" element={<ViewDetailsPage />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="/koiBatch" element={<KoiBatchPage />}/>
          <Route path="/order" element={<OrderPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {shouldRenderHeaderFooter && <Footer />}
    </>
  );
}

export default App;
