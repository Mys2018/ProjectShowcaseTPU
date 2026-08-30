import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootRoute } from './RootRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/pages/login-page/ui/LoginPage'
import { MainLayout } from '@/pages/main-layout/ui/MainLayout'
import { CatalogLayout, Catalog, ProjectPage } from '@/pages/catalog-layout'
import { MyPlatformPage, ProjectActivitiesLayout } from '@/pages/my-platform'
import { MyProfile } from '@/pages/my-profile'
import { CreateProjectPage } from '@/pages/create-project'
import { SomeoneProfile } from '@/pages/someone-profile'
import { ProjectsGrid } from '@/widgets/projects-grid'
import { NotFoundPage } from '@/pages/not-found-page'
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
            element: <ProtectedRoute />,
            children: [
              {
                index: true,
                element: <MyPlatformPage />
              },
              {
                path: ROUTES.ACTIVITY.BASE,
                element: <ProjectActivitiesLayout />
              },
              {
                path: ROUTES.MANAGE.BASE,
                element: <ProjectActivitiesLayout />
              },
              {
                path: ROUTES.MODERATION.BASE,
                element: <ProjectActivitiesLayout />
              },
              {
                path: ROUTES.PROJECTS.CREATE,
                element: <CreateProjectPage />
              }
            ]
          },
          {
            path: ROUTES.PROJECTS.BASE,
            element: <CatalogLayout />,
            children: [
              {
                index: true,
                element: <Navigate to={ROUTES.PROJECTS.RECRUITMENT} replace />
              },
              {
                element: <Catalog />,
                children: [
                  {
                    path: ROUTES.PROJECTS.RECRUITMENT,
                    element: <ProjectsGrid />
                  },
                  {
                    path: ROUTES.PROJECTS.IN_PROGRESS,
                    element: <ProjectsGrid />
                  }
                ]
              },
              {
                path: ROUTES.PROJECTS.PROJECT,
                element: <ProjectPage />
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
        element: <NotFoundPage />
      }
    ]
  }
])
