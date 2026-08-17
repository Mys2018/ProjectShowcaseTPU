import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootRoute } from './RootRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/pages/login-page/ui/LoginPage'
import { MainLayout } from '@/pages/main-layout/ui/MainLayout'
import { MyPlatformLayout } from '@/pages/my-platform-layout'
import { CatalogLayout, Catalog, ProjectPage } from '@/pages/catalog-layout'
import { MyPlatformPage } from '@/pages/my-platform'
import { MyProfile } from '@/pages/my-profile'
import { CreateProjectPage } from '@/pages/create-project'
import { SomeoneProfile } from '@/pages/someone-profile'
import { ProjectsGrid } from '@/widgets/projects-grid'
import { ROUTES } from '@/shared'

export const router = createBrowserRouter([
  {
    element: <RootRoute />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />
      },
      {
        path: ROUTES.MAIN,
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.CATALOG.BASE} replace />
          },

          {
            path: ROUTES.CATALOG.BASE,
            element: <CatalogLayout />,
            children: [
              {
                index: true,
                element: <Navigate to={ROUTES.CATALOG.ALL_PROJECTS} replace />
              },
              {
                element: <Catalog />,
                children: [
                  {
                    path: ROUTES.CATALOG.ALL_PROJECTS,
                    element: <ProjectsGrid />
                  },
                  {
                    path: ROUTES.CATALOG.RECRUITING,
                    element: <ProjectsGrid />
                  },
                  {
                    path: ROUTES.CATALOG.IN_WORK,
                    element: <ProjectsGrid />
                  }
                ]
              },
              {
                path: ROUTES.CATALOG.PROJECT,
                element: <ProjectPage />
              }
            ]
          },

          {
            element: <ProtectedRoute />,
            children: [
              {
                path: ROUTES.MY_PLATFORM.BASE,
                element: <MyPlatformLayout />,
                children: [
                  {
                    index: true,
                    element: <MyPlatformPage />
                  },
                  {
                    path: ROUTES.MY_PLATFORM.CREATE,
                    element: <CreateProjectPage />
                  }
                ]
              }
            ]
          },

          {
            path: ROUTES.PROFILE.BASE,
            element: <MyProfile />
          },

          {
            path: ROUTES.PROFILE.BY_ID,
            element: <SomeoneProfile />
          }
        ]
      },
      {
        path: '*',
        // TODO - сделать NotFoundPage
        element: <Navigate to={ROUTES.LOGIN} replace />
      }
    ]
  }
])
