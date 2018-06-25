<template>
    <div>
        <profile-view-infos :user="user" />
        <profile-view-images :images="getImages" />
    </div>
</template>

<script>
    import ProfileViewInfos from './ProfileViewInfos.vue'
    import ProfileViewImages from './ProfileViewImages.vue'
  export default {
    props: ['user'],
    components: {
        ProfileViewInfos,
        ProfileViewImages
    },
    methods: {

    },
    computed: {
        getImages() {
            let images = []
            if (this.user.avatar) {
                images.push({
                    name: this.user.avatar.image.name,
                    alt: this.user.avatar.alt,
                })
            }
            if (this.user.gallery) {
                this.user.gallery.forEach(i => images.push({
                    name: i.image.name,
                    alt: i.alt,
                }))
            }
            
            return images
        }
    }
  }
</script>
