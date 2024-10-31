import React from 'react';
import { Route, Routes } from 'react-router-dom';
import StaffProtectedRoute from "./StaffProtectedRoute";
import StaffLayout from "../layouts/StaffLayout";
import StaffPage from "../pages/StaffPage";
import UpdateOrder from "../pages/ManageOrder/UpdateOrder";
import ManageDelivery from "../pages/ManageDelivery/ManageDelivery";
import ManageConsignmentPage from "../pages/Admin/ManageConsign";
import ManageUserProfiles from "../pages/Admin/ManageUserProfile";
import ManagePromotion from "../pages/Admin/ManagePromotion";
import ManageKoi from "../pages/Admin/ManageKoi";
import ManageKoiBatch from "../pages/Admin/ManageKoiBatch";
import ManageOrder from "../pages/Admin/ManageOrder";
import ManageFeedback from "../pages/ManageFeedback/ManageFeedback";
function StaffRoutes() {
  return (
    <>
      <Routes>
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
          path="/staff/manageDelivery"
          element={
            <StaffProtectedRoute>
              <StaffLayout>
                <ManageDelivery />
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
        <Route
          path="/staff/manageOrder/updateOrder/:id"
          element={
            <StaffProtectedRoute>
              <StaffLayout>
                <UpdateOrder />
              </StaffLayout>
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/staff/manageFeedback"
          element={
            <StaffProtectedRoute>
              <StaffLayout>
                <ManageFeedback />
              </StaffLayout>
            </StaffProtectedRoute>
          }
        />
      </Routes>
    </>
  )
};

export default StaffRoutes;
