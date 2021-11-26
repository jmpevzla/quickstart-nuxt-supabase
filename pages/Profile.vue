<template>
  <form class="form-widget" @submit.prevent="updateProfile">

    <Avatar :path="avatar_url" @update:path="(path) => avatar_url = path" @upload="updateProfile" />

    <div>
      <label for="email">Email</label>
      <input id="email" type="text" :value="user.email" disabled />
    </div>
    <div>
      <label for="username">Name</label>
      <input id="username" type="text" v-model="username" />
    </div>
    <div>
      <label for="website">Website</label>
      <input id="website" type="website" v-model="website" />
    </div>

    <div>
      <input
        type="submit"
        class="button block primary"
        :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading"
      />
    </div>

    <div>
      <button class="button block" @click="signOut" :disabled="loading">
        Sign Out
      </button>
    </div>
  </form>
</template>

<script>
import Avatar from '../components/Avatar.vue'

export default {
  components: {
    Avatar
  },
  data: () => ({
    loading: true,
    username: '',
    website: '',
    avatar_url: ''
  }),
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  watch: {
    user(data) {
      this.checkUser(data)
    }
  },
  mounted() {
    this.checkUser(this.$supabase.auth.user() || {}).then((value) => {
      value && this.getProfile()
    })
  },
  methods: {
    async checkUser(data) {
      if(Object.keys(data).length === 0) {
        await this.$router.replace('/auth')
        return false
      }
      return true
    },
    async getProfile() {
      try {
        this.loading = true
        this.$store.commit('setUser', this.$supabase.auth.user() || {})

        let { data, error, status } = await this.$supabase
          .from("profiles")
          .select(`username, website, avatar_url`)
          .eq("id", this.user.id)
          .single()

        if (error && status !== 406) throw error

        if (data) {
          this.username = data.username
          this.website = data.website
          this.avatar_url = data.avatar_url
        }

      } catch (error) {
        //alert(error.message)
        console.error(error.message)
      } finally {
        this.loading = false
      }
    },

    async updateProfile() {
      try {
        this.loading = true
        this.$store.commit('setUser', this.$supabase.auth.user() || {})

        const updates = {
          id: this.user.id,
          username: this.username,
          website: this.website,
          avatar_url: this.avatar_url,
          updated_at: new Date(),
        }

        let { error } = await this.$supabase.from("profiles").upsert(updates, {
          returning: "minimal", // Don't return the value after inserting
        })

        if (error) throw error
      } catch (error) {
        alert(error.message)
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      try {
        this.loading = true
        let { error } = await this.$supabase.auth.signOut()
        if (error) throw error
      } catch (error) {
        alert(error.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
