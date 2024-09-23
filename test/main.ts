import { createApp, h } from 'vue'
import Playground from '../src/Playground.vue'


const App = {
    setup() {


        return () => h(Playground, null)
    }
}

createApp(App).mount('#app')



