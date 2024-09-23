import type { InjectionKey, ToRefs, ComputedRef } from 'vue'

export type EditorMode = 'js' | 'css' | 'html'
export interface EditorProps {
  value: string
  filename: string
  readonly?: boolean
  mode?: EditorMode
}
export interface EditorEmits {
  (e: 'change', code: string): void
}

export const injectKeyProps: InjectionKey<ToRefs<Required<{ 
    autoSave: boolean,
    autoResize: boolean,
    splitPaneOptions?: {
      codeTogglerText?: string
      outputTogglerText?: string
    }
}>>> = Symbol('props')

export const injectKeyPreviewRef: InjectionKey<
  ComputedRef<HTMLDivElement | null>
> = Symbol('preview-ref')