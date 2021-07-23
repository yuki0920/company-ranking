<template>
  <div v-if="company">
    <b-breadcrumb class="bg-white mb-0">
      <b-breadcrumb-item to="/">
        トップ
      </b-breadcrumb-item>
      <b-breadcrumb-item to="/companies">
        企業
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

<script>
import { defineComponent, useContext, useRoute, computed, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  setup () {
    const { $axios } = useContext()
    const route = useRoute()
    const id = computed(() => route.value.params.id)
    const company = ref(null)
    const fetchCompany = async () => {
      const { data } = await $axios.get(`/api/v1/companies/${id.value}`)
      company.value = data.company
    }
    fetchCompany()

    return {
      company
    }
  }
})
</script>
