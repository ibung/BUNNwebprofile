<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  footerText?: string | null
  siteTitle?: string | null
}>()

const currentYear = new Date().getFullYear()

const copyright = computed(() => {
  if (props.footerText) return props.footerText
  return `© ${currentYear} ${props.siteTitle || 'Ibnu Hilmi Athaillah'}`
})
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <p>{{ copyright }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--red);
  color: #fbe9d6;
  font-size: 14px;
  padding: 0 var(--pad) 36px;
}

.footer-content {
  border-top: 1px solid rgba(251, 233, 214, 0.25);
  padding-top: 24px;
}
</style>
