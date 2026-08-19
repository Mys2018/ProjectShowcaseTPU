import type {CreateProjectForm} from '../../model/useProjectWizard';
import styles from "./Tabs.module.css";
import clsx from "clsx";
import {
  BigBlock,
  SmallBlock,
  SmallBlockBody, Tag,
  Separator, AllList
} from "@/features/create-project/ui/components/all-info-fields/AllInfoFields.tsx";
import type {PrdMeta} from "@/entities/project";

interface TabProps {
  form: CreateProjectForm;
  setStep: (step: number) => void;
}

export function AllTab({ form, setStep }: TabProps) {
  const prd = form.state.values.prdMeta as PrdMeta;

  const handleEdit = (step: number, _searchTexts?: string[], _tagNames?: string[]) => {
    setStep(step);
    
    // Скроллим наверх страницы при переключении таба для удобства
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const renderSeparator = (condition: boolean) => condition ? <Separator /> : null;
  return (
    <div className={clsx(styles.mainFieldContainer)}>
      <div className={styles.mainInfo}>
        <h3>Проверка информации</h3>
        <p>
          Перед публикацией посмотрите все поля и отредактируйте, если необходимо
        </p>
      </div>

      {/*Основа*/}
      <BigBlock  bigTitle={'Основная информация'}>
        <div className={styles.grid}>
          <SmallBlock title={'Название проекта'} onEditField={() => handleEdit(1, ['Название проекта'])}>
            <SmallBlockBody
              mainText={form.state.values.meta.title}
            />
          </SmallBlock>
          <SmallBlock title={'Заказчик'} onEditField={() => handleEdit(1, ['Заказчик'])}>
            <SmallBlockBody
              mainText={form.state.values.extraFieldsForAll?.partnerName}
            />
          </SmallBlock>
        </div>

        <SmallBlock title={'Описание'} onEditField={() => handleEdit(1, ['Описание'])}>
          <SmallBlockBody
            mainText={form.state.values.meta.description}
          />
        </SmallBlock>

        <SmallBlock title={'Трек теги'} onEditField={() => handleEdit(1, ['Основной тег', 'Дополнительные теги'])}>
          <div className={styles.tags}>
            <div className={styles.tagColumn}>
              <p>
                Основной
              </p>
              <Tag title={form.state.values.extraFieldsForAll?.primaryTagName}/>
            </div>

            <div className={styles.tagColumn}>
              <p>
                Дополнительные
              </p>
              <div className={styles.tagList}>
                {
                  form.state.values.extraFieldsForAll?.tags?.map(tag => (
                    <Tag key={tag} title={tag}/>
                  ))
                }
              </div>

            </div>
          </div>
        </SmallBlock>
      </BigBlock>



      {/*PRD*/}

      <BigBlock bigTitle={'Требования к продукту (PRD)'}>
        {(prd.prerequisites || prd.productVision) && (
          <div className={styles.grid}>
            {prd.prerequisites && (
              <SmallBlock title={'Предпосылки'} onEditField={() => handleEdit(2, ['Актуальность'])}>
                <SmallBlockBody mainText={prd.prerequisites} />
              </SmallBlock>
            )}
            {prd.productVision && (
              <SmallBlock title={'Product vision'} onEditField={() => handleEdit(2, ['Product vision'])}>
                <SmallBlockBody mainText={prd.productVision} />
              </SmallBlock>
            )}
          </div>
        )}

        {renderSeparator(!!(prd.prerequisites || prd.productVision))}

        {prd.audience && prd.audience.length > 0 && (
          <>
            <SmallBlock title={'Целевая аудитория'} subtitle={'z'}>
               <div className={styles.grid}>
                 {prd.audience.map((segment, index: number) => (
                    <SmallBlockBody key={index} subtitle={`Сегмент ${index + 1}`} mainText={segment.description} onEditField={() => handleEdit(2, ['Целевая аудитория'])} />
                 ))}
               </div>
            </SmallBlock>
            {renderSeparator(true)}
          </>
        )}

        {(prd.projectGoal || prd.businessGoal) && (
          <>
            <SmallBlock title={'Цели'} subtitle={'z'}>
              <div className={styles.grid}>
                {prd.projectGoal && (
                  <SmallBlockBody subtitle={'Цель проекта'} mainText={prd.projectGoal} onEditField={() => handleEdit(2, ['Цели'])} />
                )}
                {prd.businessGoal && (
                  <SmallBlockBody subtitle={'Бизнес цель'} mainText={prd.businessGoal} onEditField={() => handleEdit(2, ['Цели'])} />
                )}
              </div>

            </SmallBlock>
            {renderSeparator(true)}
          </>

        )}

        {(prd.keyFunctionality || prd.functional || prd.nonFunctional) && (
          <>
            <SmallBlock title={'Требования'} subtitle={'z'}>
              <div className={styles.grid}>
                {prd.keyFunctionality && (
                  <SmallBlockBody subtitle={'Ключевой функционал'} onEditField={() => handleEdit(2, ['Требования'])}>
                    <AllList list={prd.keyFunctionality} />
                  </SmallBlockBody>
                )}
                {prd.functional && (
                  <SmallBlockBody subtitle={'Функциональные требования'} onEditField={() => handleEdit(2, ['Требования'])}>
                    <AllList list={prd.functional} />
                  </SmallBlockBody>
                )}
                {prd.nonFunctional && (
                  <SmallBlockBody subtitle={'Нефункциональные требования'} onEditField={() => handleEdit(2, ['Требования'])}>
                    <AllList list={prd.nonFunctional} />
                  </SmallBlockBody>
                )}
              </div>
            </SmallBlock>
            {renderSeparator(!!(prd.problemStatement || prd.businessMetrics || prd.projectPlan))}
          </>
        )}

        {(prd.problemStatement || prd.businessMetrics) && (
          <>
            <SmallBlock title={'Реализация'} subtitle={'z'}>
              <div className={styles.grid}>
                {prd.problemStatement && (
                  <SmallBlockBody subtitle={'Постановка задачи'} mainText={prd.problemStatement} onEditField={() => handleEdit(2, ['Реализация', 'Постановка задачи'])} />
                )}
                {prd.businessMetrics && (
                  <SmallBlockBody subtitle={'Бизнес метрики'} onEditField={() => handleEdit(2, ['Реализация', 'Бизнес метрики'])}>
                    <AllList list={prd.businessMetrics} />
                  </SmallBlockBody>
                )}
              </div>
            </SmallBlock>
            {renderSeparator(!!prd.projectPlan)}
          </>
        )}

        {prd.projectPlan && (
           <SmallBlock title={'План проекта'} onEditField={() => handleEdit(2, ['План проекта'])}>
             <AllList list={prd.projectPlan} />
           </SmallBlock>
        )}
      </BigBlock>



      {/*Компетенции*/}

      <BigBlock bigTitle={'Команда и компетенции'}>
        <SmallBlock title={'Компетенции'} onEditField={() => handleEdit(3, ['Компетенции', 'Команда'])}>
          <div className={styles.competencyList}>
            {
              form.state.values.roles.map((role, index: number) => (
                <div className={styles.competency} key={role.meta.name}>
                  <p className={styles.competencyName}>
                    {index + 1}. {role.meta.name}
                  </p>
                  {
                    role.skills.length === 0 ? <p className={styles.invite}>Нет обязательных скиллов</p> :
                      <div className={styles.skillList}>
                        {
                          role.skills.map((skill) => (
                            <div key={skill.skillId} className={styles.skill}>
                              {skill.skillName}
                            </div>
                          ))
                        }
                      </div>
                  }
                  {
                    index === 0 && <p className={styles.invite}>
                      Приглашенный участник: идет нахуй
                    </p>
                  }
                </div>
              ))
            }
          </div>

        </SmallBlock>
      </BigBlock>

      {/*Даты и ресурсы*/}
      <BigBlock bigTitle={'Даты и ресурсы'}>
        <div className={styles.grid}>
          <SmallBlock title={'Таймлайн'} onEditField={() => handleEdit(4, ['Ключевые точки', 'Таймлайн'])}>
            <div className={styles.timelineList}>
              {
                form.state.values.checkpoints.map((checkpoint, index: number) => (
                  <div key={index} className={styles.checkpoint}>
                    <p className={styles.checkpointIndex}>
                      {index + 1}
                    </p>
                    <div className={styles.checkpointInfo}>
                      <p>
                        {checkpoint.title}
                      </p>
                      <p>
                        {checkpoint.deadline}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          </SmallBlock>

          <SmallBlock title={'Ресурсы'} onEditField={() => handleEdit(4, ['Ссылки', 'Ресурсы'])}>
              <div className={styles.linkList}>
                {
                  form.state.values.links.map((link, index) => (
                    <div key={index} className={styles.linkContainer}>
                      <div className={styles.innerContainer}>
                        <p>
                          {
                            link.name
                          }
                        </p>
                        <p>
                          {
                            link.link
                          }
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
          </SmallBlock>
        </div>

      </BigBlock>
    </div>

  );
}
