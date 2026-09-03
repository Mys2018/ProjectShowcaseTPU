import {useParams} from 'react-router-dom';
import {useMediaQuery} from "usehooks-ts";
import {useProjectDetails} from '@/entities/project/api/queries';
import {MOBILE_BREAKPOINT} from "@/shared/lib";
import {MobileLayoutProjectPage} from "@/pages/catalog-layout/project-page/ui/MobileLayoutProjectPage.tsx";
import {DesktopLayoutProjectPage} from "@/pages/catalog-layout/project-page/ui/DesktopLayoutProjectPage.tsx";

export function ProjectPage() {
  // Один брейкпоинт с шапкой и панелью: иначе на 769-1199 показывался бы десктопный
  // макет без панели, хотя шапка уже мобильная.
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError } = useProjectDetails(id || '');


  if (isLoading) return <div style={{ padding: 40 }}>Загрузка проекта...</div>;
  if (isError || !project) return <div style={{ padding: 40 }}>Проект не найден</div>;

  console.log(project)
  return (
    isMobile ? (
      <MobileLayoutProjectPage project={project} />
    ) : (
      <DesktopLayoutProjectPage project={project} />
    )
  );
}