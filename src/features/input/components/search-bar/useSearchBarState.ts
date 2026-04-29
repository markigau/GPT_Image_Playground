import { useEffect, useMemo, useState } from 'react'
import {
  createCategory,
  deleteCategory,
  removeTasks,
  renameCategory,
  useStore,
} from '../../../../store'
import {
  ALL_CATEGORY_FILTER,
  FAVORITES_CATEGORY_FILTER,
  UNCATEGORIZED_CATEGORY_FILTER,
  isTaskInRecycleBin,
  resolveCategoryFilterName,
} from '../../../../types'
import { type CategoryChipItem, type CategoryEditorMode } from './shared'
import { useCategoryLooping } from './useCategoryLooping'

export function useSearchBarState() {
  const tasks = useStore((state) => state.tasks)
  const categories = useStore((state) => state.categories)
  const activeCategoryFilter = useStore((state) => state.activeCategoryFilter)
  const setActiveCategoryFilter = useStore((state) => state.setActiveCategoryFilter)
  const searchQuery = useStore((state) => state.searchQuery)
  const setSearchQuery = useStore((state) => state.setSearchQuery)
  const filterStatus = useStore((state) => state.filterStatus)
  const setFilterStatus = useStore((state) => state.setFilterStatus)
  const taskView = useStore((state) => state.taskView)
  const setTaskView = useStore((state) => state.setTaskView)
  const setConfirmDialog = useStore((state) => state.setConfirmDialog)
  const showToast = useStore((state) => state.showToast)

  const [editorMode, setEditorMode] = useState<CategoryEditorMode>('idle')
  const [categoryInput, setCategoryInput] = useState('')
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [mobileControlsCollapsed, setMobileControlsCollapsed] = useState(() => window.innerWidth < 768)

  const activeGalleryTasks = useMemo(
    () => tasks.filter((task) => !isTaskInRecycleBin(task)),
    [tasks],
  )
  const recycleBinCount = useMemo(
    () => tasks.filter((task) => isTaskInRecycleBin(task)).length,
    [tasks],
  )
  const failedActiveTasks = useMemo(
    () => tasks.filter((task) => !isTaskInRecycleBin(task) && task.status === 'error'),
    [tasks],
  )
  const categoryIdSet = useMemo(
    () => new Set(categories.map((category) => category.id)),
    [categories],
  )
  const favoriteCount = useMemo(
    () => activeGalleryTasks.filter((task) => Boolean(task.isFavorite)).length,
    [activeGalleryTasks],
  )
  const uncategorizedCount = useMemo(
    () =>
      activeGalleryTasks.filter(
        (task) => !task.categoryId || !categoryIdSet.has(task.categoryId),
      ).length,
    [activeGalleryTasks, categoryIdSet],
  )
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()

    for (const category of categories) {
      counts.set(category.id, 0)
    }

    for (const task of activeGalleryTasks) {
      if (task.categoryId && counts.has(task.categoryId)) {
        counts.set(task.categoryId, (counts.get(task.categoryId) ?? 0) + 1)
      }
    }

    return counts
  }, [activeGalleryTasks, categories])

  const activeCategory = categories.find((category) => category.id === activeCategoryFilter) ?? null
  const activeCategoryLabel = resolveCategoryFilterName(activeCategoryFilter, categories)
  const generationTargetLabel =
    activeCategoryFilter === ALL_CATEGORY_FILTER ||
    activeCategoryFilter === FAVORITES_CATEGORY_FILTER
      ? '未分类'
      : activeCategoryLabel
  const currentViewCount = taskView === 'trash' ? recycleBinCount : activeGalleryTasks.length

  const categoryChipItems = useMemo<CategoryChipItem[]>(
    () => [
      { label: '全部', value: ALL_CATEGORY_FILTER, count: activeGalleryTasks.length },
      { label: '收藏', value: FAVORITES_CATEGORY_FILTER, count: favoriteCount },
      { label: '未分类', value: UNCATEGORIZED_CATEGORY_FILTER, count: uncategorizedCount },
      ...categories.map((category) => ({
        label: category.name,
        value: category.id,
        count: categoryCounts.get(category.id) ?? 0,
      })),
    ],
    [activeGalleryTasks.length, categories, categoryCounts, favoriteCount, uncategorizedCount],
  )
  const categoryChipLayoutSignature = useMemo(
    () => categoryChipItems.map((item) => `${item.value}:${item.label}:${item.count}`).join('|'),
    [categoryChipItems],
  )

  const {
    categoryViewportRef,
    categorySegmentRef,
    categoryLoopEnabled,
    handleCategoryTrackScroll,
  } = useCategoryLooping({
    isMobile,
    taskView,
    categoryChipItems,
    categoryChipLayoutSignature,
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (taskView !== 'gallery') {
      setEditorMode('idle')
      setCategoryInput('')
    }
  }, [taskView])

  useEffect(() => {
    setMobileControlsCollapsed(isMobile)
  }, [isMobile])

  useEffect(() => {
    if (editorMode === 'rename') {
      setCategoryInput(activeCategory?.name ?? '')
    }
  }, [activeCategory, editorMode])

  const resetEditor = () => {
    setEditorMode('idle')
    setCategoryInput('')
  }

  const handleSubmitCategory = async () => {
    try {
      if (editorMode === 'create') {
        createCategory(categoryInput)
      } else if (editorMode === 'rename' && activeCategory) {
        await renameCategory(activeCategory.id, categoryInput)
      }

      resetEditor()
    } catch (error) {
      showToast(error instanceof Error ? error.message : String(error), 'error')
    }
  }

  const handleDeleteCategory = () => {
    if (!activeCategory) return

    setConfirmDialog({
      title: '删除分类',
      message: `确定删除分类「${activeCategory.name}」吗？该分类下的项目会移入未分类。`,
      confirmText: '删除分类',
      action: () => {
        void deleteCategory(activeCategory.id).catch((error) => {
          showToast(error instanceof Error ? error.message : String(error), 'error')
        })
      },
    })
  }

  const handleClearFailedTasks = () => {
    setConfirmDialog({
      title: '清理失败项目',
      message: `确定将全部 ${failedActiveTasks.length} 条失败项目移入回收站吗？它们的提示词、配置和图片会暂时保留，可在回收站恢复。`,
      confirmText: '移入回收站',
      action: () => removeTasks(failedActiveTasks),
    })
  }

  return {
    isMobile,
    taskView,
    activeCategoryFilter,
    activeCategory,
    activeCategoryLabel,
    currentViewCount,
    filterStatus,
    searchQuery,
    editorMode,
    categoryInput,
    generationTargetLabel,
    mobileControlsCollapsed,
    activeGalleryCount: activeGalleryTasks.length,
    recycleBinCount,
    failedActiveCount: failedActiveTasks.length,
    hasSearchQuery: Boolean(searchQuery.trim()),
    categoryChipItems,
    categoryViewportRef,
    categorySegmentRef,
    categoryLoopEnabled,
    handleCategoryTrackScroll,
    setTaskView,
    setActiveCategoryFilter,
    setFilterStatus,
    setSearchQuery,
    setMobileControlsCollapsed,
    setCategoryInput,
    handleStartCreate: () => {
      setEditorMode('create')
      setCategoryInput('')
    },
    handleStartRename: () => {
      if (!activeCategory) return
      setEditorMode('rename')
      setCategoryInput(activeCategory.name)
    },
    handleDeleteCategory,
    handleSubmitCategory,
    handleClearFailedTasks,
    resetEditor,
  }
}
