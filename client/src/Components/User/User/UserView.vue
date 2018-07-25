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
    import ProfileViewImages from '../Profile/ProfileView/ProfileViewImages.vue'
    import ProfileViewInfos from '../Profile/ProfileView/ProfileViewInfos.vue'
    import ProfileViewField from '../Profile/ProfileView/ProfileViewField.vue'
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
              let isSelected = false
              this.user.gallery.forEach(i => {
                let image = {
                    name: i.image.name,
                    alt: i.alt,
                }
                if (!isSelected
                  && this.user.avatar.image
                  && this.user.avatar.image._id === i.image._id ) {
                    image.selected = true
                    isSelected = true
                  }
                images.push(image)
              })
            }
            return images
        }
    }
  }
</script>
