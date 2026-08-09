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
}

export function AllTab({ form }: TabProps) {
  const prd = form.state.values.prdMeta as PrdMeta;

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
      <BigBlock  bigTitle={'Основкая информация'}>
        <div className={styles.grid}>
          <SmallBlock title={'Название проекта'} >
            <SmallBlockBody
              mainText={form.state.values.meta.title}
            />
          </SmallBlock>
          <SmallBlock title={'Заказчик'} >
            <SmallBlockBody
              mainText={form.state.values.extraFieldsForAll?.partnerName}
            />
          </SmallBlock>
        </div>

        <SmallBlock title={'Описание'} >
          <SmallBlockBody
            mainText={form.state.values.meta.description}
          />
        </SmallBlock>

        <SmallBlock title={'Трек теги'} >
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
                    <Tag title={tag}/>
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
              <SmallBlock title={'Предпосылки'}>
                <SmallBlockBody mainText={prd.prerequisites} />
              </SmallBlock>
            )}
            {prd.productVision && (
              <SmallBlock title={'Product vision'}>
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
                    <SmallBlockBody key={index} subtitle={`Сегмент ${index + 1}`} mainText={segment.description} />
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
                  <SmallBlockBody subtitle={'Цель проекта'} mainText={prd.projectGoal} />
                )}
                {prd.businessGoal && (
                  <SmallBlockBody subtitle={'Бизнес цель'} mainText={prd.businessGoal} />
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
                  <SmallBlockBody subtitle={'Ключевой функционал'}>
                    <AllList list={prd.keyFunctionality} />
                  </SmallBlockBody>
                )}
                {prd.functional && (
                  <SmallBlockBody subtitle={'Функциональные требования'}>
                    <AllList list={prd.functional} />
                  </SmallBlockBody>
                )}
                {prd.nonFunctional && (
                  <SmallBlockBody subtitle={'Нефункциональные требования'}>
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
                  <SmallBlockBody subtitle={'Постановка задачи'} mainText={prd.problemStatement} />
                )}
                {prd.businessMetrics && (
                  <SmallBlockBody subtitle={'Бизнес метрики'}>
                    <AllList list={prd.businessMetrics} />
                  </SmallBlockBody>
                )}
              </div>
            </SmallBlock>
            {renderSeparator(!!prd.projectPlan)}
          </>
        )}

        {prd.projectPlan && (
           <SmallBlock title={'План проекта'}>
             <AllList list={prd.projectPlan} />
           </SmallBlock>
        )}
      </BigBlock>



      {/*Компетенции*/}

      <BigBlock bigTitle={'Команда и компетенции'}>
        <SmallBlock title={'Компетенции'}>
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
                            <div className={styles.skill}>
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
    </div>

  );
}
