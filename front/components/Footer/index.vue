<template>
  <footer class="py-2 bg-lighter fixed-bottom">
    <div class="container text-center">
      <ul class="nav justify-content-center mb-3">
        <li class="nav-item">
          <NuxtLink to="/terms_of_service">
            利用規約
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/contact">
            お問い合わせ
          </NuxtLink>
        </li>
      </ul>
      <small>Copyright &copy;上場企業ランキング</small>
    </div>
  </footer>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup () {
    return {
    }
  }
})
</script>

<style lang="scss" scoped>
.nav {
  gap: 3rem;
}
</style>
