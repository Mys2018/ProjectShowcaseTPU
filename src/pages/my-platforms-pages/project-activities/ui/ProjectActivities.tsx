import { ProjectProfile } from '@/shared/ui/small-widgets/project-profile/ProjectProfile';
import styles from './ProjectActivities.module.css';
import { YourTasksWidget } from '@/shared/ui/small-widgets/your-tasks/YourTasksWidget';
import { StagesWidget, YourPointsWidget } from '@/shared/ui';
import type { Activity } from '@/shared/ui';
import type { ClosingDiscipline } from '@/shared/ui';
import { ProjectsGrid } from '@/widgets/projects-grid';
import banner from '../../assets/banner.png'
import { useRef } from 'react';
import {useMe} from "@/entities/user";
import { useProjectDraft } from '@/entities/project/api/queries';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared';

export const ProjectActivities = () => {

    const { data: user } = useMe();
    const { data: draft } = useProjectDraft();
    const navigate = useNavigate();

    const draftTitle = (draft?.data as Record<string, { title?: string }>)?.meta?.title || 'Без названия';

    const data: {
        name?: string;
        role?: string;
        avatarSrc?: string;
        activities?: Activity[];
        closingDisciplines?: ClosingDiscipline[]
    } = {
        name: 'Paven',
        role: 'Разработчик',
        avatarSrc: '',

        activities: [
            {
                type: 'currentStage',
                title: 'Подготовка презентации',
                deadline: '5-06-2026',
                progressSteps: 5,
                progressCurrentStep: 5,
                unitType: 'points'
            },
            {
                type: 'upcomingStage',
                title: 'Подготовка презентации',
                progressSteps: 1,
                progressCurrentStep: 0,
                unitType: 'points'
            },
            {
                type: 'keyPoint',
                title: 'Постерная сессия 1',
                deadline: '29-05-2026',
                status: 'completed',
                number: 1,
                extra: 'tooltip'
            }

        ],
        closingDisciplines: [
            {
                title: 'УИРС-1',
                currentProgress: 18,
                maxProgress: 36
            },
            {
                title: 'УИРС-2',
                currentProgress: 0,
                maxProgress: 36
            }
        ]
    };

    const widgetRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const scrollTop = target.scrollTop;

        if (widgetRef.current) {
            widgetRef.current.scrollTop = scrollTop;
        }

        if (contentRef.current) {
            contentRef.current.scrollTop = scrollTop;
        }
    }

    const handleContinueDraft = () => {
        navigate(`${ROUTES.MY_PLATFORM}/${ROUTES.MY_PLATFORM_CREATE}?draft=true`);
    };

    return (
      <main className={styles.mainContent}>
          <aside className={styles.profile}>
              <ProjectProfile name={user?.meta.name} role={data.role} avatarSrc={user?.profilePicture} />

              </aside>
              <h1 className={styles.welcomeMessage}>C возвращением, {user?.meta.firstName}!</h1>
              <aside className={styles.activities} ref={widgetRef} onScroll={handleScroll}>
                  <YourTasksWidget data={data.activities} />
                  <YourPointsWidget disciplines={data.closingDisciplines} tpuPoints={307} />
              </aside>
              <div className={styles.contentWrapper} ref={contentRef} onScroll={handleScroll}>
                  {draft && (
                    <section className={styles.draftBanner}>
                        <div>
                            <p>Черновик проекта: <strong>{draftTitle}</strong></p>
                        </div>
                        <button type="button" onClick={handleContinueDraft}>
                            Продолжить заполнение
                        </button>
                    </section>
                  )}
                  <section className={styles.banner}>
                      <img src={banner} alt="Activities Banner" className={styles.bannerImage} />
                  </section>
                  <section className={styles.stagesWidget}>

                      <StagesWidget />
                  </section>
                  <section className={styles.projects}>
                      <h3 className={styles.projectstitle}>Проекты для вас</h3>
                      <ProjectsGrid />
                  </section>

              </div>
          </main>
    );
}