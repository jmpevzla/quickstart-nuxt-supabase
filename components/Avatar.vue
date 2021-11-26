<template>
  <div>
    <img
      v-if="src"
      :src="src"
      alt="Avatar"
      class="avatar image"
      :style="{ height: size, width: size }"
    />
    <div
      v-else
      class="avatar no-image"
      :style="{ height: size, width: size }"
    />

    <div :style="{ width: size }">
      <label class="button primary block" for="single">
        {{ uploading ? "Uploading ..." : "Upload" }}
      </label>
      <input
        style="visibility: hidden; position: absolute"
        type="file"
        id="single"
        accept="image/*"
        @change="uploadAvatar($event)"
        :disabled="uploading"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    path: String,
  },
  // vue 3 (optional)
  emits: [
    "upload",
    "update:path"
  ],
  data: () => ({
    size: '10em',
    uploading: false,
    src: '',
    files: null
  }),
  watch: {
    path(value) {
      value ? this.downloadImage() : ""
    }
  },
  methods: {
    async downloadImage() {
      try {
        const { data, error } = await this.$supabase.storage
          .from("avatars")
          .download(this.path)
        if (error) throw error
        this.src = URL.createObjectURL(data)
      } catch (error) {
        console.error("Error downloading image: ", error.message)
      }
    },

    async uploadAvatar(evt) {
      this.files = evt.target.files
      try {
        this.uploading = true
        if (!this.files || this.files.length === 0) {
          throw new Error("You must select an image to upload.")
        }

        const file = this.files[0]
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        let { error: uploadError } = await this.$supabase.storage
          .from("avatars")
          .upload(filePath, file)

        if (uploadError) throw uploadError
        this.$emit("update:path", filePath)
        this.$emit("upload")

      } catch (error) {
        alert(error.message)
      } finally {
        this.uploading = false
      }
    }
  }
}
</script>
