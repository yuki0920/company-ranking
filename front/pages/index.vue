<template>
  <div>
    <button
      type="button"
      name="button"
      @click="getMsg"
    >
      RailsからAPIを取得する
    </button>
    <div
      v-for="(msg, i) in msgs"
      :key="i"
    >
      {{ msg }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup () {
    const { $axios } = useContext()
    const msgs: Ref<string[]> = ref([])
    const getMsg = () => {
      $axios.$get('/api/v1/hello')
        .then(res => msgs.value.push(res))
    }

    return {
      msgs,
      getMsg
    }
  }
})
</script>
