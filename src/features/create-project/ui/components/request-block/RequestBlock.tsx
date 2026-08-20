// import { useState } from 'react';
// import styles from './RequestBlock.module.css'
// import DownArrowIcon from '@/shared/ui/icons/down_arrow.svg?react'
//
// import CrossIcon from '@/shared/ui/icons/cross.svg?react'
// import CheckIcon from '@/shared/ui/icons/check.svg?react'
// import {TeamUserCard} from "@/shared/ui/team_user_card/TeamUserCard.tsx";
// import type {User} from "@/shared";

// type RequestBlockProps = {
//   requests: unknown
// }
//
// export const RequestBlock = ({requests}: RequestBlockProps)=> {
//   const [isOpen, setIsOpen] = useState(false);
//
//
//   return (
//     <div className={`${styles.body} ${isOpen ? styles.open : styles.closed}`}>
//       <div className={styles.innerBody}>
//         <div className={styles.header}>
//           {/*{*/}
//           {/*  requests?.total === 0 ?*/}
//           {/*    <p>*/}
//           {/*      Откликов пока нет*/}
//           {/*    </p> :*/}
//           {/*    <p>*/}
//           {/*      Откликов: {requests?.total || 0}*/}
//           {/*    </p>*/}
//           {/*}*/}
//           <button onClick={() => setIsOpen(!isOpen)} className={isOpen ? styles.arrowUp : ''}>
//             <DownArrowIcon/>
//           </button>
//
//         </div>
//         <div className={styles.mainBody}>
//           <RequestCard/>
//         </div>
//       </div>
//     </div>
//   )
// }

// interface RequestCardProps {
//   // data?: User,
//   onReject?: () => void,
//   onApprove?: () => void
// }
//
// const RequestCard = ({onReject, onApprove}: RequestCardProps ) => {
//   return (
//     <div className={styles.cardBody}>
//       <TeamUserCard
//         avatar_size='48px'
//         name={'Константинопольский Константин Константинович'}
//         course={"2"}
//         roles={['Backend', 'Frontend']}
//       />
//
//       <div className={styles.rightHalf}>
//         <div className={styles.smallHeader}>
//           <p>
//             {
//               '01.01.2004 12:00'
//             }
//           </p>
//         </div>
//
//         <div className={styles.buttonContainer}>
//           <button className={styles.rejectButton} onClick={onReject}>
//             <CrossIcon className={styles.crossIcon}/>
//             Отклонить
//           </button>
//           <button className={styles.approveButton} onClick={onApprove}>
//             <CheckIcon className={styles.checkIcon}/>
//             Принять
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
