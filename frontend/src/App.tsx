import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AccountsPage } from '@/pages/AccountsPage'
import { TransactionsPage } from '@/pages/TransactionsPage'
import { CopilotPage } from '@/pages/CopilotPage'
import { GoalsPage } from '@/pages/GoalsPage'
import { MobileSetupPage } from '@/pages/MobileSetupPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas de Autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Privadas del Sistema (Protegidas por JWT) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/copilot" element={<CopilotPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/mobile-setup" element={<MobileSetupPage />} />
          </Route>
        </Route>

        {/* Ruta por defecto / Redirección */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
