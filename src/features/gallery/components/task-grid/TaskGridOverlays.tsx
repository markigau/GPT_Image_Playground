import { editOutputs, retryTask, reuseConfig, toggleTaskFavorite } from '../../../../store'
import type { CategoryConfig, TaskRecord, TaskView } from '../../../../types'
import MoveCategoryModal from '../MoveCategoryModal'
import TaskContextMenu from '../TaskContextMenu'
import SelectionBoxOverlay from './SelectionBoxOverlay'
import type { SelectionBox, TaskContextMenuState } from './shared'

interface TaskGridOverlaysProps {
  movingTask: TaskRecord | null
  categories: CategoryConfig[]
  moveCategoryTarget: string
  selectionBox: SelectionBox | null
  contextMenuState: TaskContextMenuState | null
  taskView: TaskView
  onMoveCategoryTargetChange: (value: string) => void
  onCloseMoveCategory: () => void
  onConfirmMoveCategory: () => void
  onCloseContextMenu: () => void
  onOpenTask: (taskId: string) => void
  onMoveTaskCategory: (task: TaskRecord) => void
  onDeleteTask: (task: TaskRecord) => void
  onPurgeTask: (task: TaskRecord) => void
  onRestoreTask: (task: TaskRecord) => void
}

export default function TaskGridOverlays(props: TaskGridOverlaysProps) {
  const {
    movingTask,
    categories,
    moveCategoryTarget,
    selectionBox,
    contextMenuState,
    taskView,
    onMoveCategoryTargetChange,
    onCloseMoveCategory,
    onConfirmMoveCategory,
    onCloseContextMenu,
    onOpenTask,
    onMoveTaskCategory,
    onDeleteTask,
    onPurgeTask,
    onRestoreTask,
  } = props

  return (
    <>
      <MoveCategoryModal
        task={movingTask}
        categories={categories}
        targetCategory={moveCategoryTarget}
        onTargetCategoryChange={onMoveCategoryTargetChange}
        onClose={onCloseMoveCategory}
        onConfirm={onConfirmMoveCategory}
      />

      <SelectionBoxOverlay selectionBox={selectionBox} />

      <TaskContextMenu
        task={contextMenuState?.task ?? null}
        x={contextMenuState?.x ?? 0}
        y={contextMenuState?.y ?? 0}
        isInRecycleBin={taskView === 'trash'}
        onClose={onCloseContextMenu}
        onOpen={() => {
          if (contextMenuState?.task) {
            onOpenTask(contextMenuState.task.id)
          }
        }}
        onReuse={() => {
          if (contextMenuState?.task) {
            void reuseConfig(contextMenuState.task)
          }
        }}
        onEdit={() => {
          if (contextMenuState?.task) {
            void editOutputs(contextMenuState.task)
          }
        }}
        onRetry={() => {
          if (contextMenuState?.task) {
            void retryTask(contextMenuState.task)
          }
        }}
        onToggleFavorite={() => {
          if (contextMenuState?.task) {
            void toggleTaskFavorite(contextMenuState.task)
          }
        }}
        onMoveCategory={() => {
          if (contextMenuState?.task) {
            onMoveTaskCategory(contextMenuState.task)
          }
        }}
        onDelete={() => {
          if (contextMenuState?.task) {
            onDeleteTask(contextMenuState.task)
          }
        }}
        onPurge={() => {
          if (contextMenuState?.task) {
            onPurgeTask(contextMenuState.task)
          }
        }}
        onRestore={() => {
          if (contextMenuState?.task) {
            onRestoreTask(contextMenuState.task)
          }
        }}
      />
    </>
  )
}
