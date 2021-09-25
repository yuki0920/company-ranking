<template>
  <div>
    <b-navbar toggleable="sm" type="dark" variant="gray-dark">
      <div class="container">
        <b-navbar-brand to="/">
          <b-icon-bar-chart />
          上場企業ランキング
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse" />
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/companies">
              すべての企業
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>
  </div>
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
