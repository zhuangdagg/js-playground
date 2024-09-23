<template>
    <div class="playground">
        <SplitPane>
            <template #left>
                <div class="files">
                    <button v-for="(file, index) in files" @click="activeIndex = index">{{ file.filename }}</button>
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
import { reactive, ref } from 'vue';
import CodeMirror from './codemirror/CodeMirror.vue'
import SplitPane from './SplitPane.vue';
import Preview from './output/Preview.vue';

const files = ref([
    {
        filename: 'index.html',
        value: `<div id="app">666</div>`
    },
    {
        filename: 'main.js',
        value: 'document.querySelector(\'#app\')'
    },
    {
        filename: 'style.css',
        value: `#app { color: red; }`
    }
])
const activeIndex = ref<any>(0)

const onChange = (val: string) => {
    files.value[activeIndex.value].value = val
    console.log('change')
}
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
}
</style>