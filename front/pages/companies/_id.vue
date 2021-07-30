<template>
  <div v-if="company">
    <b-breadcrumb class="bg-white mb-0">
      <b-breadcrumb-item to="/">
        トップ
      </b-breadcrumb-item>
      <b-breadcrumb-item to="/companies">
        <NuxtLink :to="`/industries/${company.industry_id}`">
          {{ company.industry_name }}
        </NuxtLink>
      </b-breadcrumb-item>
      <b-breadcrumb-item active>
        {{ company.security_name }}
      </b-breadcrumb-item>
    </b-breadcrumb>
    <div class="container">
      <company :company="company" />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, useContext, useRoute, computed, ref, useMeta, onMounted } from '@nuxtjs/composition-api'

export default defineComponent({
  setup () {
    // @ts-ignore
    const { $axios } = useContext()
    const route = useRoute()
    const id = computed(() => route.value.params.id)
    const company = ref(null)
    const { title, meta } = useMeta()

    const fetchCompany = () => {
      return $axios.get(`/api/v1/companies/${id.value}`)
    }

    onMounted(async () => {
      const { data } = await fetchCompany()
      company.value = data.company
      // @ts-ignore
      const securityName = company.value.security_name || '企業詳細'
      title.value = securityName
      meta.value = [
        { hid: 'description', name: 'description', content: `${securityName}の企業情報です。年収、従業員数、平均年齢、売上、利益を掲載しています。` }
      ]
    })

    return {
      company
    }
  },
  head: {}
})
</script>
