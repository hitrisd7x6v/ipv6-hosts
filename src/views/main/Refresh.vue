<template>
  <a-skeleton :loading="true" active />
</template>

<!--用于页面刷新中转-->
<script>
export default {
  name: "Refresh",
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$router.replace(from).then(() => {})
    })
  }
}
</script>

<style scoped>

</style>
