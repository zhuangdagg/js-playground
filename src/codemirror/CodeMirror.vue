<template>
  <div ref="container" class="editor" />
</template>

<script setup lang="ts">
import {
  inject,
  ref,
  computed,
  onMounted,
  useTemplateRef,
  watch,
  watchEffect,
  type ComputedRef,
  type Ref,
  onUnmounted,

} from "vue";

import { EditorProps, EditorEmits } from "../types";

import { minimalSetup } from "codemirror";
import {
  EditorView,
  keymap,
  highlightActiveLine,
  lineNumbers
} from "@codemirror/view";
import {
  Compartment,
  EditorState,
  StateEffect,
  type Transaction,
  type Extension,
  type Text,
} from "@codemirror/state";
import { indentWithTab, defaultKeymap } from '@codemirror/commands';
import { type LanguageSupport } from '@codemirror/language'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { vue } from '@codemirror/lang-vue'
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { EditorThemes } from './themes'

defineOptions({
  name: "CodeMirror",
  editorType: "codemirror",
});

const props = withDefaults(defineProps<EditorProps & { themeIndex?: number }>(), {
  value: "",
  readonly: false,
  themeIndex: 0
});

const modes: Record<string, LanguageSupport> = {
  css: css(),
  html: html(),
  js: javascript(),
  json: json(),
  vue: vue(),
};

const activeMode = computed(() => {
  const { mode: forcedMode, filename } = props;
  const mode = modes[forcedMode || filename.split(".").pop()!];
  return filename.lastIndexOf(".") !== -1 && mode ? mode : modes.html;
});

const emit = defineEmits<EditorEmits>();

const doc: Ref<string | Text> = ref(props.value);

const el = useTemplateRef("container");
// const { autoResize, autoSave } = inject(injectKeyProps) || {}

// codemirror
let editor: EditorView = new EditorView();

let extensions: ComputedRef<Extension[]> = computed(() => {
  const language = new Compartment()
  const themeConfig = new Compartment()

  return [
    minimalSetup,
    lineNumbers(),
    highlightActiveLine(),
    closeBrackets(),
    autocompletion(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...completionKeymap,
      indentWithTab
    ]),
    EditorState.allowMultipleSelections.of(true),
    EditorState.readOnly.of(props.readonly),
    EditorView.editable.of(!props.readonly),
    language.of(activeMode.value),
    themeConfig.of(EditorThemes[props.themeIndex])
  ];
});



onMounted(() => {
  init();
});

onUnmounted(() => {
  editor.destroy()
})

function init() {
  if(!el.value) return

  editor = new EditorView({
    state: EditorState.create({ doc: props.value }),
    parent: el.value,
    dispatch: (tr: Transaction) => {
      editor.update([tr])
      if(tr.changes.empty || !tr.docChanged) return
      emit('change', tr.state.doc.toString() ?? '')
    }
  });

  watchEffect(() => {
    if(editor.composing || editor.state.doc.toJSON().join('\n') === props.value) return
    editor.dispatch({
        changes: {
            from: 0,
            to: editor.state.doc.length,
            insert: props.value
        }
    })
  })

  watchEffect(() => {
      editor.dispatch({
        effects: StateEffect.reconfigure.of(extensions.value)
      })
  })

  // setTimeout(() => {
  //     editor.refresh()
  // }, 50)

}
</script>

<style>
.editor {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.cm-editor {
  font-family: var(--font-code);
  line-height: 1.5;
  height: 100%;
}
</style>
