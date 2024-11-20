import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute"; // Unified protected route
import AdminLayout from "../layouts/AdminLayout";
import StaffLayout from "../layouts/StaffLayout";
import AdminPage from "../pages/AdminPage";
import StaffPage from "../pages/StaffPage";
import ManageDelivery from "../pages/ManageDelivery/ManageDelivery";
import ManageConsignmentPage from "../pages/Admin/ManageConsign";
import ManageUserProfiles from "../pages/Admin/ManageUserProfile";
import ManagePromotion from "../pages/Admin/ManagePromotion";
import ManageKoi from "../pages/Admin/ManageKoi";
import ManageKoiBatch from "../pages/Admin/ManageKoiBatch";
import ManageOrder from "../pages/Admin/ManageOrder";
import ManageFeedback from "../pages/Admin/ManageFeedBack";
import UpdateKoi from "../pages/ManageKoi/UpdateKoi";
import CreateKoi from "../pages/ManageKoi/CreateKoi";
import UpdatePromotion from "../pages/ManagePromotion/UpdatePromotion";
import CreatePromotion from "../pages/ManagePromotion/CreatePromotion";
import UpdateOrder from "../pages/ManageOrder/UpdateOrder";
import UpdateDelivery from "../pages/ManageDelivery/UpdateDelivery";
import ManageConsignKoi from "../pages/Admin/ManageConsignKoi"
import CreateTransactionPage from '../pages/CreateTransactionPage'
import OrderDetail from '../pages/ManageOrder/OrderDetail';
import DeliveryDetail from '../pages/ManageDelivery/DeliveryDetail';

const DynamicLayout = ({ role, children }) => {
  return role === "0" ? <AdminLayout>{children}</AdminLayout> : <StaffLayout>{children}</StaffLayout>;
};

function RoleBasedRoutes() {
  const adminRoutes = [
    { path: "/admin", element: <AdminPage /> },
    { path: "/admin/manage-user", element: <ManageUserProfiles /> },
    { path: "/admin/manageKoi", element: <ManageKoi /> },
    { path: "/admin/manageKoi/updateKoi/:id", element: <UpdateKoi /> },
    { path: "/admin/manageKoi/createKoi", element: <CreateKoi /> },
    { path: "/admin/managePromotion", element: <ManagePromotion /> },
    { path: "/admin/managePromotion/updatePromotion/:id", element: <UpdatePromotion /> },
    { path: "/admin/managePromotion/createPromotion", element: <CreatePromotion /> },
    { path: "/admin/manageKoiBatch", element: <ManageKoiBatch /> },
    { path: "/admin/manageFeedback", element: <ManageFeedback /> },
    { path: "/admin/manageOrder", element: <ManageOrder /> },
    { path: "/admin/manageOrder/orderDetail/:id", element: <OrderDetail /> },
    { path: "/admin/manageOrder/updateOrder/:id", element: <UpdateOrder /> },
    { path: "/admin/manageConsign", element: <ManageConsignmentPage /> },
    { path: "/admin/manageDelivery", element: <ManageDelivery /> },
    { path: "/admin/manageDelivery/deliveryDetail/:id", element: <DeliveryDetail /> },
    { path: "/admin/manageDelivery/updateDelivery/:id", element: <UpdateDelivery /> },
    { path: "/admin/manageConsignKoi", element: <ManageConsignKoi /> },
    { path: "/admin/manageTrans", element: <CreateTransactionPage /> },
  ];

  const staffRoutes = [
    { path: "/staff", element: <StaffPage /> },
    { path: "/staff/manageTrans", element: <CreateTransactionPage /> },
    { path: "/staff/manageDelivery", element: <ManageDelivery /> },
    { path: "/staff/manageDelivery/deliveryDetail/:id", element: <DeliveryDetail /> },
    { path: "/staff/manageDelivery/updateDelivery/:id", element: <UpdateDelivery /> },
    { path: "/staff/manageConsign", element: <ManageConsignmentPage /> },
    { path: "/staff/manage-user", element: <ManageUserProfiles /> },
    { path: "/staff/managePromotion", element: <ManagePromotion /> },
    { path: "/staff/manageKoi", element: <ManageKoi /> },
    { path: "/staff/manageKoiBatch", element: <ManageKoiBatch /> },
    { path: "/staff/manageOrder", element: <ManageOrder /> },
    { path: "/staff/manageOrder/orderDetail/:id", element: <OrderDetail /> },
    { path: "/staff/manageOrder/updateOrder/:id", element: <UpdateOrder /> },
    { path: "/staff/manageFeedback", element: <ManageFeedback /> },
    { path: "/staff/manageConsignKoi", element: <ManageConsignKoi /> },
  ];

  return (
    <Routes>
      {/* Admin Routes */}
      {adminRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            <ProtectedRoute requiredRole="0">
              <DynamicLayout role="0">{route.element}</DynamicLayout>
            </ProtectedRoute>
          }
        />
      ))}

      {/* Staff Routes */}
      {staffRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            <ProtectedRoute requiredRole="1">
              <DynamicLayout role="1">{route.element}</DynamicLayout>
            </ProtectedRoute>
          }
        />
      ))}
    </Routes>
  );
}

export default RoleBasedRoutes;

