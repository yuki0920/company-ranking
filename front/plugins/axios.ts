export default ({ $axios }: {$axios: any}) => {
  $axios.onRequest((config: any) => {
    console.log(config)
  })
  $axios.onResponse((config: any) => {
    console.log(config)
  })
  $axios.onError((e: any) => {
    console.log(e.response)
  })
}
