import { useApproveProject } from '../api/mutations'
import { FilledButton } from '@/shared'

interface ApproveProjectButtonProps {
  projectId: string
}

export function ApproveProjectButton({ projectId }: ApproveProjectButtonProps) {
  const { mutate: approve, isPending } = useApproveProject()
  return <FilledButton textButton='Опубликовать проект' disabled={isPending} onClick={() => approve(projectId)} />
}
