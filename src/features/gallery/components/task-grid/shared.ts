import type { TaskRecord } from '../../../../types'

export const INITIAL_VISIBLE_TASK_COUNT = 24
export const LOAD_MORE_TASK_COUNT = 24
export const BOX_SELECT_THRESHOLD = 6

export interface SelectionBox {
  left: number
  top: number
  width: number
  height: number
}

export interface TaskContextMenuState {
  task: TaskRecord
  x: number
  y: number
}

export interface CategoryOption {
  label: string
  value: string
}

export function isSelectableGridTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (
    target.closest('button, input, textarea, select, a, [role="button"], [data-task-menu-root]')
  ) {
    return false
  }
  return true
}

export function rectsIntersect(a: DOMRect, b: DOMRect) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
}
