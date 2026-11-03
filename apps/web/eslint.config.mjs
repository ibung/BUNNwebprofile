// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Sanitasi markdown dilakukan di server oleh MarkdownService
    'vue/no-v-html': 'off',
  },
})
