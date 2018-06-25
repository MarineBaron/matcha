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
    computed: {
        getImages() {
            let images = []
            if (this.user.avatar) {
                images.push({
                    name: this.user.avatar.image.name,
                    alt: this.user.avatar.alt,
                })
                images.push({
                    name: '02.png',
                    alt: 'ALT sur la deuxieme image',
                })
                images.push({
                    name: '03.png',
                    alt: 'ALT sur la troisieme image',
                })
                images.push({
                    name: '04.png',
                    alt: 'ALT sur la deuxieme image',
                })
                images.push({
                    name: '05.png',
                    alt: 'ALT sur la deuxieme image',
                })
            }
            return images
        }
    }
  }
</script>
