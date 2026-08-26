import { useParams } from 'react-router-dom';
import { useProjectDetails } from '@/entities/project/api/queries';
import { useMediaQuery } from "usehooks-ts";
import { MobileLayoutProjectPage } from "@/pages/catalog-layout/project-page/ui/MobileLayoutProjectPage.tsx";
import { DesktopLayoutProjectPage } from "@/pages/catalog-layout/project-page/ui/DesktopLayoutProjectPage.tsx";

export function ProjectPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError } = useProjectDetails(id || '');


  if (isLoading) return <div style={{ padding: 40 }}>Загрузка проекта...</div>;
  if (isError || !project) return <div style={{ padding: 40 }}>Проект не найден</div>;

  return (
    isMobile ? (
      <MobileLayoutProjectPage project={project} />
    ) : (
      <DesktopLayoutProjectPage project={project} />
    )
  );
}