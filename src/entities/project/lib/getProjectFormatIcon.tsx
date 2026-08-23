import type { ReactElement } from "react"
import type { ProjectFormat } from "../model/types"
import { FolderIcon, StudyIcon, CodeIcon, assertNever } from "@/shared"

export function getProjectFormatIcon(format: ProjectFormat): ReactElement {
  switch (format) {
    case 'Case':
      return <FolderIcon />
    case 'Study':
      return <StudyIcon />
    case 'Real':
      return <CodeIcon />
    default:
      return assertNever(format)
  }
}