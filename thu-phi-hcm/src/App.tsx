import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import { NotificationProvider } from './context/NotificationContext'
import LoadingSpinner from './components/ui/LoadingSpinner'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Lazy load components for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const PaymentPage = lazy(() => import('./pages/PaymentPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const PasswordPage = lazy(() => import('./pages/PasswordPage'))
const GuidePage = lazy(() => import('./pages/GuidePage'))
const ReceiptLookupPage = lazy(() => import('./pages/ReceiptLookupPage'))
const WelcomePage = lazy(() => import('./pages/WelcomePage'))
const SystemPage = lazy(() => import('./pages/SystemPage'))
const DataTablePage = lazy(() => import('./pages/DataTablePage'))
const ReceiptApprovalPage = lazy(() => import('./pages/ReceiptApprovalPage'))
const QROrderPage = lazy(() => import('./pages/QROrderPage'))
const EcomPaymentPage = lazy(() => import('./pages/EcomPaymentPage'))
const FeeDeclarationManagePage = lazy(() => import('./pages/FeeDeclarationManagePage'))
const BarcodeFeePage = lazy(() => import('./pages/BarcodeFeePage'))
const DebtManagePage = lazy(() => import('./pages/DebtManagePage'))
const CreateReceiptPage = lazy(() => import('./pages/CreateReceiptPage'))
const ReceiptManagePage = lazy(() => import('./pages/ReceiptManagePage'))
const ChartDemoPage = lazy(() => import('./pages/ChartDemoPage'))

// Reports Pages
const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'))
const ReceiptListPage = lazy(() => import('./pages/reports/ReceiptListPage'))
const SummaryByWarehousePage = lazy(() => import('./pages/reports/SummaryByWarehousePage'))
const SummaryByServicePage = lazy(() => import('./pages/reports/SummaryByServicePage'))
const SummaryByEnterprisePage = lazy(() => import('./pages/reports/SummaryByEnterprisePage'))
const DetailedReportPage = lazy(() => import('./pages/reports/DetailedReportPage'))
const ReceiptUsageHistoryPage = lazy(() => import('./pages/reports/ReceiptUsageHistoryPage'))
const CollectionSummaryPage = lazy(() => import('./pages/reports/CollectionSummaryPage'))
const ReceiptLookupDetailPage = lazy(() => import('./pages/reports/ReceiptLookupPage'))

// Debt Management Pages
const DebtManagementPage = lazy(() => import('./pages/debt-management/DebtManagementPage'))
const DebtStatusPage = lazy(() => import('./pages/debt-management/DebtStatusPage'))
const BusinessServicesPage = lazy(() => import('./pages/debt-management/BusinessServicesPage'))
const CreateQRCodePage = lazy(() => import('./pages/debt-management/CreateQRCodePage'))

// Data Reconciliation Pages
const DataReconciliationPage = lazy(() => import('./pages/data-reconciliation/DataReconciliationPage'))
const InitializePage = lazy(() => import('./pages/data-reconciliation/InitializePage'))
const ManageListPage = lazy(() => import('./pages/data-reconciliation/ManageListPage'))
const CustomsReportPage = lazy(() => import('./pages/data-reconciliation/CustomsReportPage'))

//Payment Pages
const DeclarePage = lazy(() => import("./pages/payment/declare/Declare"));
// Payment Management Pages
const PaymentManagementPage = lazy(() => import('./pages/payment-management/PaymentManagementPage'))

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <Layout>{children}</Layout>
}

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
          {/* Public routes */}
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/receipt-lookup" element={<ReceiptLookupPage />} />
          <Route path="/ecom-payment" element={<EcomPaymentPage />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/payment/order" element={<ProtectedRoute><QROrderPage /></ProtectedRoute>} />
          <Route path="/fee-declaration/manage" element={<ProtectedRoute><FeeDeclarationManagePage /></ProtectedRoute>} />
                        <Route path="/fee-declaration/barcode" element={<ProtectedRoute><BarcodeFeePage /></ProtectedRoute>} />
              <Route path="/fee-declaration/debt-management" element={<ProtectedRoute><DebtManagePage /></ProtectedRoute>} />
          <Route path="/receipt-management/create" element={<ProtectedRoute><CreateReceiptPage /></ProtectedRoute>} />
          <Route path="/receipt-management/manage" element={<ProtectedRoute><ReceiptManagePage /></ProtectedRoute>} />
          <Route path="/chart-demo" element={<ProtectedRoute><ChartDemoPage /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/password" element={<ProtectedRoute><PasswordPage /></ProtectedRoute>} />
          <Route path="/guide" element={<ProtectedRoute><GuidePage /></ProtectedRoute>} />
                                <Route path="/system" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/users" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/business" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/password" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/customs" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/banks" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/warehouses" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/toll-stations" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/storage-locations" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/enterprises" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/transport-methods" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/receipt-templates" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/tariff-types" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/tariffs" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/form-types" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/payment-types" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/container-types" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
                      <Route path="/system/units" element={<ProtectedRoute><SystemPage /></ProtectedRoute>} />
          
          {/* Reports routes */}
          <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/reports/receipt-list" element={<ProtectedRoute><ReceiptListPage /></ProtectedRoute>} />
          <Route path="/reports/summary-by-warehouse" element={<ProtectedRoute><SummaryByWarehousePage /></ProtectedRoute>} />
          <Route path="/reports/summary-by-service" element={<ProtectedRoute><SummaryByServicePage /></ProtectedRoute>} />
          <Route path="/reports/summary-by-enterprise" element={<ProtectedRoute><SummaryByEnterprisePage /></ProtectedRoute>} />
          <Route path="/reports/detailed-report" element={<ProtectedRoute><DetailedReportPage /></ProtectedRoute>} />
          <Route path="/reports/receipt-usage-history" element={<ProtectedRoute><ReceiptUsageHistoryPage /></ProtectedRoute>} />
          <Route path="/reports/collection-summary" element={<ProtectedRoute><CollectionSummaryPage /></ProtectedRoute>} />
          <Route path="/reports/receipt-lookup" element={<ProtectedRoute><ReceiptLookupDetailPage /></ProtectedRoute>} />
          <Route
            path="/payment/declare"
            element={
              <ProtectedRoute>
                <DeclarePage />
              </ProtectedRoute>
            }
          />
          {/* Debt Management routes */}
          <Route path="/debt-management" element={<ProtectedRoute><DebtManagementPage /></ProtectedRoute>} />
          <Route path="/debt-management/debt-status" element={<ProtectedRoute><DebtStatusPage /></ProtectedRoute>} />
          <Route path="/debt-management/business-services" element={<ProtectedRoute><BusinessServicesPage /></ProtectedRoute>} />
          <Route path="/debt-management/create-qr-code" element={<ProtectedRoute><CreateQRCodePage /></ProtectedRoute>} />
          
          {/* Data Reconciliation routes */}
          <Route path="/data-reconciliation" element={<ProtectedRoute><DataReconciliationPage /></ProtectedRoute>} />
          <Route path="/data-reconciliation/initialize" element={<ProtectedRoute><InitializePage /></ProtectedRoute>} />
          <Route path="/data-reconciliation/manage-list" element={<ProtectedRoute><ManageListPage /></ProtectedRoute>} />
          <Route path="/data-reconciliation/customs-report" element={<ProtectedRoute><CustomsReportPage /></ProtectedRoute>} />

          {/* Payment Management routes */}
          <Route path="/payment-management" element={<ProtectedRoute><PaymentManagementPage /></ProtectedRoute>} />
          <Route path="/payment-management/manage" element={<ProtectedRoute><PaymentManagementPage /></ProtectedRoute>} />
          <Route path="/payment-management/cancel" element={<ProtectedRoute><PaymentManagementPage /></ProtectedRoute>} />
          <Route path="/payment-management/restore" element={<ProtectedRoute><PaymentManagementPage /></ProtectedRoute>} />
          <Route path="/payment-management/notify-transfer" element={<ProtectedRoute><PaymentManagementPage /></ProtectedRoute>} />
          <Route path="/payment-management/manage-transfer" element={<ProtectedRoute><PaymentManagementPage /></ProtectedRoute>} />
          <Route path="/payment-management/bank-reconciliation" element={<ProtectedRoute><PaymentManagementPage /></ProtectedRoute>} />
          
          <Route path="/data-table" element={<ProtectedRoute><DataTablePage /></ProtectedRoute>} />
          <Route path="/payment/process" element={<ProtectedRoute><ReceiptApprovalPage /></ProtectedRoute>} />

          {/* Default redirects */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/welcome" replace />
              )
            } 
          />
          
          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </NotificationProvider>
  </ErrorBoundary>
  )
}

export default App
