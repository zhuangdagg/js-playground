import { basicLight } from "./basic-light"
import { basicDark } from "./basic-dark"
import { gruvboxLight } from "./gruvbox-light"
import { gruvboxDark } from "./gruvbox-dark"
import { solarizedLight } from "./solarized-light"
import { solarizedDark } from "./solarized-dark"
import { nord } from "./nord"

export const EditorThemes = [
    {
        name: 'Basic Light',
        extension: basicLight
    },{
        name: 'Basic Dark',
        extension: basicDark
    },{
        name: 'Gruvbox Light',
        extension: gruvboxLight
    },{
        name: 'Gruvbox Dark',
        extension: gruvboxDark
    },{
        name: 'Solarized Light',
        extension: solarizedLight
    },{
        name: 'Solarized Dark',
        extension: solarizedDark
    },{
        name: 'Nord',
        extension: nord
    }
]