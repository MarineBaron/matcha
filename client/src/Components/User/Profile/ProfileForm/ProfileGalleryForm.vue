<template>
  <b-container id="form-gallery" fluid>
    <b-row>
      <b-col sm="4">
        <div v-if="avatar.image">
          <h4>Avatar</h4>
          <img :src="config.IMAGES_URL + '/' + avatar.image.name" class="img-responsive img-thumbnail" :alt="avatar.alt">
        </div>
        <div id="form-gallery-gallery">
          <h4>Gallerie</h4>
          <div>
            <div v-for="item in gallery">
              <img :src="config.IMAGES_URL + '/' + item.image.name" class="img-responsive img-thumbnail" :alt="item.originalName">
              <b-button variant="link"
                title="Supprimer"
                @click.prevent="deleteImage(item.image._id)"
              ><icon name="times" /></b-button>
              <input  type="radio" title="Avatar" name="choose-avatar"
                 :value="item._id"
                 :checked="avatar.image && item.image._id === avatar.image._id"
                 @click="chooseAvatar(item._id)"
              />
            </div>
          </div>
        </div>
      </b-col>
      <b-col sm="8">
        <div v-if="gallery.length < 5">
          <form enctype="multipart/form-data" novalidate v-if="(isInitial || isSaving) && gallery.length < 5">
            <h5>Ajouter des images</h5>
            <div class="dropbox">
              <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept="image/*" class="input-file">
                <p v-if="isInitial">
                  Déposez vos fichiers ici<br> ou cliquez pour parcourir vos dossiers
                </p>
                <p v-if="isSaving">
                  Chargement de  {{ fileCount }} fichier(s)...
                </p>
            </div>
          </form>
          <div v-if="isSuccess">
            <h2>Uploaded {{ uploadedFiles.length }} file(s) successfully.</h2>
            <p>
              <a href="javascript:void(0)" @click="reset()">Upload again</a>
            </p>
          </div>
          <div v-if="isFailed">
            <h2>Echec du chargement.</h2>
            <p>
              <a href="javascript:void(0)" @click="reset()">Try again</a>
            </p>
            <pre>{{ uploadError }}</pre>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import callApi from '../../../../Api/callApi'
  import config from '../../../../Config/config'
  import { USER_ACCOUNT_REQUEST, USER_ACCOUNT_ADDIMG, USER_ACCOUNT_REMIMG, USER_ACCOUNT_CHANGEAVATAR } from '../../../../Store/user/mutation-types'
  import axios from 'axios'
  //import { validationMixin } from "vuelidate"
  import { helpers } from 'vuelidate/lib/validators'
  import { mapState } from 'vuex'

   const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3

  export default {
    props: ['user'],
    data() {
      return {
        config: config,
        uploadedFiles: [],
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'gallery'
      }
    },
    mounted() {
      this.reset()
    },
    methods: {
      reset() {
        this.currentStatus = STATUS_INITIAL
        this.uploadedFiles = []
        this.uploadError = null
      },
      save(formData) {
        const fd = new FormData()
        this.currentStatus = STATUS_SAVING
        // appel de axios directement car le header est différent du header classique
        axios.post(config.SERVER_URL + '/user/gallery/' + this.user.username,
          formData,
          { headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        .then(x => x.data)
        .then(x => {
          this.$store.commit(USER_ACCOUNT_ADDIMG, x.data)
          this.currentStatus = STATUS_SUCCESS
          this.reset()
        })
        .catch(err => {
          this.uploadError = err.response
          this.currentStatus = STATUS_FAILED
        })

      },
      filesChange(fieldName, fileList) {
        let formData = new FormData()
        if (!fileList.length) {
          return
        }
        const nbFiles = this.gallery.length
        Array.from(Array(fileList.length).keys()).map(k => {
          if (nbFiles + k < 5) {
            formData.append(fieldName, fileList[k], fileList[k].name)
          }
        })
        this.save(formData)
      },
      deleteImage(id) {
        this.currentStatus === STATUS_SAVING
        callApi({url: '/user/gallerydelete/' + this.user.username + '/' + id})
        .then((resp) => {
          this.$store.commit(USER_ACCOUNT_REMIMG, resp.data.data)
          this.currentStatus === STATUS_SUCCESS
        })
        .catch((err) => {
            this.currentStatus === STATUS_FAILED
        })
      },
      chooseAvatar(id) {
        this.currentStatus === STATUS_SAVING
        callApi({url: '/user/avatar/' + this.user.username + '/' + id})
        .then((resp) => {
          this.$store.commit(USER_ACCOUNT_CHANGEAVATAR, resp.data.avatar)
          this.currentStatus === STATUS_SUCCESS
        })
        .catch((err) => {
            this.currentStatus === STATUS_FAILED
        })
      }
    },
    computed: {
      ...mapState({
        avatar: state => state.user.user.avatar ? state.user.user.avatar : {},
        gallery: state => state.user.user.gallery ? state.user.user.gallery : [],
      }),
      isInitial() {
        return this.currentStatus === STATUS_INITIAL
      },
      isSaving() {
        return this.currentStatus === STATUS_SAVING
      },
      isSuccess() {
        return this.currentStatus === STATUS_SUCCESS
      },
      isFailed() {
        return this.currentStatus === STATUS_FAILED
      }
    }
  }
</script>

<style scoped >
#form-gallery {
  margin-top: 30px;
}

#form-gallery-gallery {
  margin-top: 20px;
}

.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}

.img-thumbnail {
  width: 50px;
}
</style>
