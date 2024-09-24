import { createApp, h, ref } from 'vue'
import Playground from '../src/Playground.vue'


const App = {
    setup() {
        const defaultFiles = ref<any>([
            { filename: 'index.html', value: ''},
                { filename: 'main.js', value: '' },
                { filename: 'style.css', value: '' },
        ])

        setTimeout(() => {
            defaultFiles.value = [
                { filename: 'index.html', value: '<div>666</div>'},
                    { filename: 'main.js', value: 'const t = 666; console.log("test")' },
                    { filename: 'style.css', value: 'div { color: red }' },
            ]
        }, 1000)

        return () => h(Playground, {
            defaultFiles: defaultFiles.value
        })
    }
}

createApp(App).mount('#app')



