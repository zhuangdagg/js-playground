<template>
  <div ref="container" class="preview-contain">
    <Transition name="fade">
      <div title="双击移除" v-show="sandboxMsg" class="console-msg" @dblclick="sandboxMsg = ''">{{ sandboxMsg }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, WatchStopHandle, watch, ref } from "vue";

import srcdoc from "./srcdoc.html?raw";
import { PreviewProxy } from "./PreviewProxy";
import { debounce } from "../utils";

defineOptions({
  name: "Preview",
});


const props = defineProps<{ files: any[]}>()

const el = useTemplateRef("container");

const sandboxMsg = ref<any>('')

let sandbox: HTMLIFrameElement;
let proxy: PreviewProxy;
let stopUpdateWatcher: WatchStopHandle | undefined;

onMounted(createSanbox);

function createSanbox() {
  if (sandbox) {
    proxy.destroy();
    stopUpdateWatcher?.();
    el.value?.removeChild(sandbox);
  }

  sandbox = document.createElement("iframe");
  sandbox.setAttribute(
    "sandbox",
    [
      "allow-forms",
      "allow-modals",
      "allow-pointer-lock",
      "allow-popups",
      "allow-scripts",
      "allow-top-navigation-by-user-activation",
    ].join(" ")
  );

  // TODO: replace import-map
  const importMap = {};
  const sandboxSrc = srcdoc.replace(
    /<!--IMPORT_MAP-->/,
    JSON.stringify(importMap)
  );

  sandbox.srcdoc = sandboxSrc
  el.value?.appendChild(sandbox)

  proxy = new PreviewProxy(sandbox, {
    on_ready: () => {

    },
    on_console: (msg: any) => {
      sandboxMsg.value = msg
    }
  })

  sandbox.addEventListener('load', () => {
    // proxy.handle_links()
    const editorContent: any = {}
    props.files.forEach(file => {
        const key = file.filename.split('.')[1]
        editorContent[key] = file.value
    })
    proxy.init(editorContent)
    // stopUpdateWatcher = watch(() => props.files, updatePreview)

  })
}

const updatePreview = debounce(() => {
    createSanbox()
}, 500)

watch(props.files, updatePreview)


</script>

<style>
.preview-contain {
  height: 100%;
}

.preview-contain > iframe {
    height: 100%; width: 100%;
    border:none;
}

.preview-contain .console-msg {
  position: absolute;
  left: 10px; right: 10px;
  bottom: 10px;
  border: 2px solid var(--border);
  border-radius: 0.5em;
  box-shadow: 0 0 1px var(--border);
  padding: 4px 10px;
  min-height: 60px;
  /* transition: bottom 0.5s ease; */
}

.preview-contain .console-msg:hover {
  box-shadow: 0 0 2px rgba(255, 0, 0, 0.638);
}

.fade-enter-active, .fade-leave-active {
  transition: transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  transform: translateY(100px);
}
</style>
