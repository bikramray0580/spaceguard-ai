import { Navigate, Route, Routes } from 'react-router-dom'

import AppShell from './layouts/AppShell'

import DashboardPage from './pages/DashboardPage'
import TrackPage from './pages/TrackPage'
import RiskPage from './pages/RiskPage'
import AlertsPage from './pages/AlertsPage'
import DataSciencePage from './pages/DataSciencePage'
import PreferencesPage from './pages/PreferencesPage'

export default function App() {
  return (
    <Routes>
      {/* Main application shell */}
      <Route element={<AppShell />}>
        {/* Dashboard */}
        <Route
          index
          element={<DashboardPage />}
        />

        {/* Tracking */}
        <Route
          path="track"
          element={<TrackPage />}
        />

        {/* Risk assessment */}
        <Route
          path="risk"
          element={<RiskPage />}
        />

        {/* Alert management */}
        <Route
          path="alerts"
          element={<AlertsPage />}
        />

        {/* Data science */}
        <Route
          path="data-science"
          element={<DataSciencePage />}
        />

        {/* Mission preferences */}
        <Route
          path="preferences"
          element={<PreferencesPage />}
        />

        {/* Unknown routes return to dashboard */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Route>
    </Routes>
  )
}