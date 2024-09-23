<template>
  <div ref="container" class="preview-contain"></div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, WatchStopHandle, watch } from "vue";

import srcdoc from "./srcdoc.html?raw";
import { PreviewProxy } from "./PreviewProxy";
import { debounce } from "../utils";

defineOptions({
  name: "Preview",
});


const props = defineProps<{ files: any[]}>()

const el = useTemplateRef("container");

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

  proxy = new PreviewProxy(sandbox, {})

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
    console.log('更新。。。')
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
}
</style>
