<template>
  <div class="container mt-3">
    <NuxtLink to="/companies" class="d-block mb-2">
      <span>全ての企業から探す</span>
    </NuxtLink>
    <section class="industries">
      <h5>
        <b-icon-building />
        業種から探す
      </h5>
      <ul class="row list-unstyled">
        <li v-for="industry in industries" :key="`industry-${industry.id}`" class="col-6 col-md-3">
          <NuxtLink :to="`/industries/${industry.id}`">
            {{ industry.name }}({{ industry.count }})
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { defineComponent, useMeta } from '@nuxtjs/composition-api'
import { useIndustries } from '~/compositions'

export default defineComponent({
  setup () {
    const { industries } = useIndustries()
    const { title, meta } = useMeta()
    title.value = 'トップ'
    meta.value = [
      { hid: 'description', name: 'description', content: '上場企業ランキングのトップページです。売上、利益、年収を掲載しています。' }
    ]

    return {
      industries
    }
  },
  head: {}
})
</script>
