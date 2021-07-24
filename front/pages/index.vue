<template>
  <div class="container mt-3">
    <p>全ての企業から探す</p>
    <section class="industries">
      <h5>業種から探す</h5>
      <ul class="row list-unstyled">
        <li v-for="industry in industries" :key="`industry-${industry.id}`" class="col-6 col-md-3" :class="{ 'border': isMobile }">
          {{ industry.name }}
        </li>
      </ul>
    </section>
    <section class="markets">
      <h5>市場から探す</h5>
      <ul class="row list-unstyled">
        <li v-for="market in markets" :key="`market-${market.id}`" class="col-6 col-md-3" :class="{ 'border': isMobile }">
          {{ market.name }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import industries from '~/lib/industries'
import markets from '~/lib/markets'
import { useUtility } from '~/lib/utility'

export default defineComponent({
  setup () {
    const { isMobile } = useUtility()
    return {
      isMobile,
      industries,
      markets
    }
  }
})
</script>
