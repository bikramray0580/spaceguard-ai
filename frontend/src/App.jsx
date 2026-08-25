import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './layouts/AppShell'
import DashboardPage from './pages/DashboardPage'
import StagedPage from './pages/StagedPage'

const stagedPages = [
  ['track', 'Track Objects', 'Object tracking workspace'], ['risk', 'Risk Monitor', 'Risk assessment workspace'],
  ['alerts', 'Alerts', 'Alert management workspace'], ['data-science', 'Data Science', 'Data science workspace'],
  ['preferences', 'Preferences', 'Mission preferences workspace'],
]

export default function App() {
  return <Routes><Route element={<AppShell />}><Route index element={<DashboardPage />} />
    {stagedPages.map(([path, title, subtitle]) => <Route key={path} path={path} element={<StagedPage title={title} subtitle={subtitle} />} />)}
  </Route><Route path="*" element={<Navigate to="/" replace />} /></Routes>
}
