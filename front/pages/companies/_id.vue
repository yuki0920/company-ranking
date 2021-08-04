<template>
  <div v-if="company" class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb pl-0">
        <li class="breadcrumb-item">
          <NuxtLink to="/">
            トップ
          </NuxtLink>
        </li>
        <li class="breadcrumb-item" aria-current="page">
          <NuxtLink :to="`/industries/${company.industry_id}`">
            {{ company.industry_name }}
          </NuxtLink>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ company.security_name }}
        </li>
      </ol>
    </nav>
    <h1>{{ company.security_name }} の企業データ</h1>
    <company :company="company" />
  </div>
</template>

<script lang='ts'>
import { defineComponent, useContext, useRoute, computed, ref, useMeta, onMounted } from '@nuxtjs/composition-api'
import { Company, ResponseCompany } from '~/types/typescript-angular/model/models'

export default defineComponent({
  setup () {
    const { $axios } = useContext()
    const route = useRoute()
    const id = computed(() => route.value.params.id)
    const company = ref<Company | null>(null)
    const { title, meta } = useMeta()

    const fetchCompany = () => {
      return $axios.get(`/api/v1/companies/${id.value}`)
    }

    onMounted(async () => {
      const { data }:{ data: ResponseCompany } = await fetchCompany()
      company.value = data.company
      const securityName = company.value.security_name || '企業詳細'
      title.value = `[${company.value.security_code}]${securityName} - 売上・年収`
      meta.value = [
        { hid: 'description', name: 'description', content: `${securityName}の企業情報です。年収、従業員数、平均年齢、業績、売上、利益を掲載しています。` }
      ]
    })

    return {
      company
    }
  },
  head: {}
})
</script>
