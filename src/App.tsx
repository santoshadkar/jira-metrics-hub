import { Route, Routes } from 'react-router';
import Layout from './components/Layout.tsx';
import { JqlPreferencesProvider } from './lib/jql-preferences.tsx';
import HomePage from './pages/HomePage.tsx';
import RolesPage from './pages/RolesPage.tsx';
import RolePage from './pages/RolePage.tsx';
import FrameworksPage from './pages/FrameworksPage.tsx';
import FrameworkPage from './pages/FrameworkPage.tsx';
import MetricPage from './pages/MetricPage.tsx';
import DashboardsPage from './pages/DashboardsPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import CompareEditionsPage from './pages/CompareEditionsPage.tsx';
import MatrixPage from './pages/MatrixPage.tsx';
import SearchPage from './pages/SearchPage.tsx';
import ContentStatusPage from './pages/ContentStatusPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

export default function App() {
  return (
    <JqlPreferencesProvider>
      <AppRoutes />
    </JqlPreferencesProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="roles/:roleId" element={<RolePage />} />
        <Route path="frameworks" element={<FrameworksPage />} />
        <Route path="frameworks/:framework" element={<FrameworkPage />} />
        <Route path="metrics/:metricId" element={<MetricPage />} />
        <Route path="dashboards" element={<DashboardsPage />} />
        <Route path="dashboards/:dashboardId" element={<DashboardPage />} />
        <Route path="editions" element={<CompareEditionsPage />} />
        <Route path="matrix" element={<MatrixPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="content-status" element={<ContentStatusPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
