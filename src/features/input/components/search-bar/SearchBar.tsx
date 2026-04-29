import CategoryEditorActions from './CategoryEditorActions'
import CategoryTrack from './CategoryTrack'
import MobileControlsSummary from './MobileControlsSummary'
import SearchFilters from './SearchFilters'
import ViewToggleBar from './ViewToggleBar'
import { useSearchBarState } from './useSearchBarState'

export default function SearchBar() {
  const state = useSearchBarState()

  return (
    <div className="sticky top-12 z-30 space-y-2.5 bg-gradient-to-b from-gray-50 via-gray-50/95 to-gray-50/80 pt-3 pb-3 backdrop-blur-sm dark:from-gray-950 dark:via-gray-950/95 dark:to-gray-950/80">
      {state.isMobile && (
        <MobileControlsSummary
          taskView={state.taskView}
          activeCategoryLabel={state.activeCategoryLabel}
          currentViewCount={state.currentViewCount}
          filterStatus={state.filterStatus}
          hasSearchQuery={state.hasSearchQuery}
          mobileControlsCollapsed={state.mobileControlsCollapsed}
          onToggle={() => state.setMobileControlsCollapsed((collapsed) => !collapsed)}
        />
      )}

      <div
        className={
          state.isMobile ? `collapse-section ${state.mobileControlsCollapsed ? 'collapsed' : ''}` : undefined
        }
      >
        <div className={state.isMobile ? 'collapse-inner space-y-2.5' : 'space-y-2.5'}>
          <ViewToggleBar
            taskView={state.taskView}
            activeGalleryCount={state.activeGalleryCount}
            recycleBinCount={state.recycleBinCount}
            failedActiveCount={state.failedActiveCount}
            onSetTaskView={state.setTaskView}
            onClearFailed={state.handleClearFailedTasks}
          />

          {state.taskView === 'gallery' && (
            <div className="rounded-2xl border border-gray-200/80 bg-white/[0.88] px-3 py-3 shadow-[0_18px_36px_-30px_rgba(15,23,42,0.55)] backdrop-blur-sm dark:border-white/[0.08] dark:bg-gray-900/[0.72]">
              <CategoryTrack
                isMobile={state.isMobile}
                activeCategoryFilter={state.activeCategoryFilter}
                categoryChipItems={state.categoryChipItems}
                categoryViewportRef={state.categoryViewportRef}
                categorySegmentRef={state.categorySegmentRef}
                categoryLoopEnabled={state.categoryLoopEnabled}
                onScroll={state.handleCategoryTrackScroll}
                onSelectCategory={state.setActiveCategoryFilter}
              />

              <CategoryEditorActions
                generationTargetLabel={state.generationTargetLabel}
                editorMode={state.editorMode}
                categoryInput={state.categoryInput}
                activeCategory={state.activeCategory}
                onStartCreate={state.handleStartCreate}
                onStartRename={state.handleStartRename}
                onDeleteCategory={state.handleDeleteCategory}
                onCategoryInputChange={state.setCategoryInput}
                onSubmitCategory={() => {
                  void state.handleSubmitCategory()
                }}
                onCancel={state.resetEditor}
              />
            </div>
          )}

          <SearchFilters
            filterStatus={state.filterStatus}
            searchQuery={state.searchQuery}
            taskView={state.taskView}
            onFilterStatusChange={state.setFilterStatus}
            onSearchQueryChange={state.setSearchQuery}
          />
        </div>
      </div>
    </div>
  )
}
