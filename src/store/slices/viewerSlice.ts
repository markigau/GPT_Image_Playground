export function createViewerSlice(set: any) {
  return {
    imageEditSession: null as any,
    setImageEditSession(imageEditSession: any) { set({ imageEditSession }) },
    detailTaskId: null as string | null,
    setDetailTaskId(detailTaskId: string | null) { set({ detailTaskId }) },
    lightboxImageId: null as string | null,
    lightboxImageList: [] as string[],
    setLightboxImageId(lightboxImageId: string | null, list?: string[]) {
      set({ lightboxImageId, lightboxImageList: list ?? (lightboxImageId ? [lightboxImageId] : []) })
    },
    showSettings: false,
    setShowSettings(showSettings: boolean) {
      set((state: any) => ({ showSettings, showPromptLibrary: showSettings ? false : state.showPromptLibrary }))
    },
    showPromptLibrary: false,
    setShowPromptLibrary(showPromptLibrary: boolean) {
      set((state: any) => ({ showPromptLibrary, showSettings: showPromptLibrary ? false : state.showSettings }))
    },
  }
}
