import { useCallback } from 'react'
import { useSetProjectStatus } from '@/entities/project'
import { FilledButton } from '@/shared'

interface ApproveProjectButtonProps {
  projectId: string
}

export function ApproveProjectButton({ projectId }: ApproveProjectButtonProps) {
  const { mutate: setProjectStatus, isPending } = useSetProjectStatus()
  const approve = useCallback(() => setProjectStatus({ projectId, status: 'Recruiting' }), [projectId])
  return <FilledButton textButton='Опубликовать проект' disabled={isPending} onClick={approve} />
}
