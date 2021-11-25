export const state = () => ({
  user: {},
})

export const mutations = {
  setUser(state, user){
    state.user = user;
  }
}

export const actions = {
  async authUser({commit}, userPayload){
    try{
        // const authUserData = await this.$axios.$post('/register/', userPayload)
        // const avatar = `http://gravatar.com/avatar/${md5(authUserData.email)}?d=robohash`
        // const user = {email: authUserData.email, avatar}

        // commit('setUser', user)
        // commit('setToken', authUserData.idToken)
    } catch(err){
      console.error(err)
    }
  }
}

export const getters = {
  user: state => state.user
}
