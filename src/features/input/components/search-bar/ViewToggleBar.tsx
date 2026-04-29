import type { TaskView } from '../../../../types'
import { ACTION_BUTTON_CLASS, SEGMENTED_BUTTON_CLASS } from './shared'

interface ViewToggleBarProps {
  taskView: TaskView
  activeGalleryCount: number
  recycleBinCount: number
  failedActiveCount: number
  onSetTaskView: (view: TaskView) => void
  onClearFailed: () => void
}

export default function ViewToggleBar({
  taskView,
  activeGalleryCount,
  recycleBinCount,
  failedActiveCount,
  onSetTaskView,
  onClearFailed,
}: ViewToggleBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center rounded-full border border-gray-200/80 bg-white/90 p-1 shadow-[0_14px_36px_-30px_rgba(15,23,42,0.6)] backdrop-blur-sm dark:border-white/[0.08] dark:bg-gray-900/80">
        <button
          type="button"
          onClick={() => onSetTaskView('gallery')}
          className={`${SEGMENTED_BUTTON_CLASS} ${
            taskView === 'gallery'
              ? 'bg-blue-500 text-white shadow-[0_12px_24px_-16px_rgba(37,99,235,0.9)]'
              : 'text-gray-600 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-white/[0.06]'
          }`}
        >
          <span>画廊</span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[11px] leading-none ${
              taskView === 'gallery'
                ? 'bg-white/[0.16] text-white/90'
                : 'bg-gray-100 text-gray-500 dark:bg-white/[0.05] dark:text-gray-400'
            }`}
          >
            {activeGalleryCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSetTaskView('trash')}
          className={`${SEGMENTED_BUTTON_CLASS} ${
            taskView === 'trash'
              ? 'bg-blue-500 text-white shadow-[0_12px_24px_-16px_rgba(37,99,235,0.9)]'
              : 'text-gray-600 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-white/[0.06]'
          }`}
        >
          <span>回收站</span>
          {recycleBinCount > 0 && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-[11px] leading-none ${
                taskView === 'trash'
                  ? 'bg-white/[0.16] text-white/90'
                  : 'bg-gray-100 text-gray-500 dark:bg-white/[0.05] dark:text-gray-400'
              }`}
            >
              {recycleBinCount}
            </span>
          )}
        </button>
      </div>

      {taskView === 'gallery' && failedActiveCount > 0 && (
        <button
          type="button"
          onClick={onClearFailed}
          className={`${ACTION_BUTTON_CLASS} border-red-200/80 bg-red-50 text-red-500 hover:-translate-y-px hover:bg-red-100/80 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20`}
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7H5m5 4v6m4-6v6M9 7V4h6v3m-7 0h8m-9 0-.867 12.142A2 2 0 008.128 21h7.744a2 2 0 001.995-1.858L18.733 7"
            />
          </svg>
          一键删除失败项目
        </button>
      )}

      {taskView === 'trash' && (
        <span className="text-xs text-gray-400 dark:text-gray-500">
          回收站项目会每 10 分钟轮询一次，自动清理 15 天前的记录
        </span>
      )}
    </div>
  )
}
