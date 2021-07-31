<template>
  <div class="container mt-3">
    <div v-if="industryCategories.length > 1">
      <NuxtLink to="/companies" class="d-block mb-2">
        <p>全ての企業から探す</p>
      </NuxtLink>
      <section>
        <h2>
          <b-icon-building />
          業種から探す
        </h2>
        <div v-for="industryCategory in industryCategories" :key="`industry-category-${industryCategory.id}`">
          <h3>{{ industryCategory.name }}</h3>
          <ul class="row list-unstyled">
            <li v-for="industry in industryCategory.industries" :key="`industry-${industry.id}`" class="col-6 col-sm-2">
              <NuxtLink :to="`/industries/${industry.id}`">
                {{ industry.name }}({{ industry.count }})
              </NuxtLink>
            </li>
          </ul>
        </div>
      </section>
    </div>
    <div v-else class="text-center mt-5">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, useMeta, onMounted } from '@nuxtjs/composition-api'
import { useIndustries } from '~/compositions'
import { ResponseIndustries } from '~/types/typescript-angular/model/models'

export default defineComponent({
  setup () {
    const { fetchIndustries, industryCategories } = useIndustries()
    const { title, meta } = useMeta()
    title.value = 'トップ'
    meta.value = [
      { hid: 'description', name: 'description', content: '上場企業ランキングのトップページです。売上、利益、年収を掲載しています。' }
    ]

    onMounted(async () => {
      const { data }:{ data: ResponseIndustries } = await fetchIndustries()
      industryCategories.value = data.industry_categories
    })

    return {
      industryCategories
    }
  },
  head: {}
})
</script>
