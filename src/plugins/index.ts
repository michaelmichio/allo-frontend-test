/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import { registerPinia } from './pinia'
import router from '../router'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  registerPinia(app)
  app
    .use(vuetify)
    .use(router)
}
