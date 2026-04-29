import { useEffect, useRef, useState } from 'react'
import { ALL_CATEGORY_FILTER, UNCATEGORIZED_CATEGORY_FILTER, type CategoryConfig, type TaskRecord } from '../../../../types'
import { INITIAL_VISIBLE_TASK_COUNT, type TaskContextMenuState } from './shared'

interface UseTaskGridUiStateOptions {
  categories: CategoryConfig[]
  activeCategoryFilter: string
  searchQuery: string
  filterStatus: string
  taskView: 'gallery' | 'trash'
}

export function useTaskGridUiState(options: UseTaskGridUiStateOptions) {
  const {
    categories,
    activeCategoryFilter,
    searchQuery,
    filterStatus,
    taskView,
  } = options
  const gridRef = useRef<HTMLDivElement | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_TASK_COUNT)
  const [batchCategoryTarget, setBatchCategoryTarget] = useState(UNCATEGORIZED_CATEGORY_FILTER)
  const [movingTask, setMovingTask] = useState<TaskRecord | null>(null)
  const [moveCategoryTarget, setMoveCategoryTarget] = useState(UNCATEGORIZED_CATEGORY_FILTER)
  const [contextMenuState, setContextMenuState] = useState<TaskContextMenuState | null>(null)

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_TASK_COUNT)
  }, [activeCategoryFilter, searchQuery, filterStatus, taskView])

  useEffect(() => {
    const nextTarget =
      activeCategoryFilter !== ALL_CATEGORY_FILTER &&
      activeCategoryFilter !== UNCATEGORIZED_CATEGORY_FILTER &&
      categories.some((category) => category.id === activeCategoryFilter)
        ? activeCategoryFilter
        : UNCATEGORIZED_CATEGORY_FILTER

    setBatchCategoryTarget(nextTarget)
  }, [activeCategoryFilter, categories])

  useEffect(() => {
    if (!movingTask) return
    if (moveCategoryTarget === UNCATEGORIZED_CATEGORY_FILTER) return
    if (categories.some((category) => category.id === moveCategoryTarget)) return
    setMoveCategoryTarget(UNCATEGORIZED_CATEGORY_FILTER)
  }, [categories, moveCategoryTarget, movingTask])

  return {
    gridRef,
    loadMoreRef,
    visibleCount,
    setVisibleCount,
    batchCategoryTarget,
    setBatchCategoryTarget,
    movingTask,
    setMovingTask,
    moveCategoryTarget,
    setMoveCategoryTarget,
    contextMenuState,
    setContextMenuState,
  }
}
