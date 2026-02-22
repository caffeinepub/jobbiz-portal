import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EmployerRegistrationPage from './pages/EmployerRegistrationPage';
import EmployeeRegistrationPage from './pages/EmployeeRegistrationPage';
import BusinessDirectoryPage from './pages/BusinessDirectoryPage';
import AddBusinessPage from './pages/AddBusinessPage';
import JobsPage from './pages/JobsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const employerRegistrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer-registration',
  component: EmployerRegistrationPage,
});

const employeeRegistrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employee-registration',
  component: EmployeeRegistrationPage,
});

const businessDirectoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/business-directory',
  component: BusinessDirectoryPage,
});

const addBusinessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add-business',
  component: AddBusinessPage,
});

const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs',
  component: JobsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  employerRegistrationRoute,
  employeeRegistrationRoute,
  businessDirectoryRoute,
  addBusinessRoute,
  jobsRoute,
  profileRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
