<template>

</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  watch: {
    user(data) {
      if(Object.keys(data).length > 0) {
        this.$router.replace('/profile')
      } else {
        this.$router.replace('/auth')
      }
    }
  },
  mounted() {
    this.$store.commit('setUser', this.$supabase.auth.user() || {})
    this.$supabase.auth.onAuthStateChange((_, session) => {
      this.$store.commit('setUser', session.user || {})
    })
  }
}
</script>
