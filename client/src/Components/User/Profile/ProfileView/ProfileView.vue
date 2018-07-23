<template>
<b-row>
    <b-col cols="6">
        <profile-view-images :images="getImages" />
    </b-col>
    <b-col cols="6">
        <profile-view-infos :user="user" />

    </b-col>
        <profile-view-field :field="{name: 'Annonce', value: user.resume}" />
</b-row>
</template>

<script>
    import ProfileViewImages from './ProfileViewImages.vue'
    import ProfileViewInfos from './ProfileViewInfos.vue'
    import ProfileViewField from './ProfileViewField.vue'
export default {
    props: ['user'],
    components: {
        ProfileViewImages,
        ProfileViewInfos,
        ProfileViewField
    },
    computed: {
        getImages() {
            let images = []
            if (this.user.gallery) {
                this.user.gallery.forEach(i => {
                  images.push({
                      name: i.image.name,
                      alt: i.alt,
                      selected: this.user.avatar && this.user.avatar.image && this.user.avatar.image._id === i.image._id ? true : false 
                  })
                })
            }
            return images
        }
    }
  }
</script>
