import { defineConfig } from "vite"


export default defineConfig({
    base:'./',
    build:{
        // install terser
        minify:'terser'
    }
})