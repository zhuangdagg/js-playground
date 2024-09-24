<template>
    <div class="playground">
        <SplitPane>
            <template #left>
                <div class="files-tab">
                    <button :class="{ 'active-btn': index === activeIndex}" :key="file.filename" v-for="(file, index) in files" @click="activeIndex = index">{{ file.filename }}</button>
                    <button title="清空" style="margin-left: auto;" @click="onClear">清空</button>
                </div>
                <CodeMirror v-bind="files[activeIndex]" @change="onChange"/>
            </template>
            <template #right>
                <Preview :files="files" />
            </template>
        </SplitPane>
    </div>
    
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CodeMirror from './codemirror/CodeMirror.vue'
import SplitPane from './SplitPane.vue';
import Preview from './output/Preview.vue';
import type { File } from './types';

type DefaultFile = {
    filename: 'index.html'|'main.js'|'style.css',
    value: string
}

const props = defineProps<{ defaultFiles?: DefaultFile[]}>()

const files = ref<File[]>([
    {
        filename: 'index.html',
        value: `<div id="app"></div>`
    },
    {
        filename: 'main.js',
        value: 'document.querySelector(\'#app\')'
    },
    {
        filename: 'style.css',
        value: `#app { }`
    }
])

const activeIndex = ref<any>(0)

watch(() => props.defaultFiles, (defaultFiles) => {
    if(defaultFiles && defaultFiles.length) {
        const temp: any = {}
        for (let file of defaultFiles) {
            temp[file.filename] = file.value
        }

        files.value = files.value.map(file => {
            if(temp[file.filename] != undefined) {
                file.value = temp[file.filename]
            }
            return file
        })
    }
}, { immediate: true })

const onChange = (val: string) => {
    files.value[activeIndex.value].value = val
}

const onClear = () => {
    files.value = files.value.map((file) => {
        file.value = ''
        return file
    })
}

const getFiles = () => {
    return files.value
}

defineExpose({ getFiles }) 
</script>

<style>
.playground {
  --bg: #fff;
  --bg-soft: #f8f8f8;
  --border: #ddd;
  --text-light: #888;
  --font-code: Menlo, Monaco, Consolas, 'Courier New', monospace;
  --color-branding: #42b883;
  --color-branding-dark: #416f9c;
  --header-height: 38px;

  height: 100%;
  margin: 0;
  overflow: hidden;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--bg-soft);
}

.dark .playground {
  --bg: #1a1a1a;
  --bg-soft: #242424;
  --border: #383838;
  --text-light: #aaa;
  --color-branding: #42d392;
  --color-branding-dark: #89ddff;
}

.playground button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
  padding: 4px 8px;
  color: var(--color-branding);
}
.files-tab {
    display: flex;
    background-color: #dddd;
}
.files-tab .active-btn {
    background-color: #42b8838d; 
    color: #008855;
}
</style>