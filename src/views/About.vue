<template>
  <div id="about-view">
    <div class="wrapper-header">
      <h1>ABOUT ME</h1>
      <div class="settings">
        <button id="btn-edit" @click="toggleEditMode" :class="{ active: editMode }">
          {{ editMode ? 'Cancel' : 'Edit Form' }}
        </button>
        <button id="btn-save" v-if="editMode" @click="saveInfo">Save Form</button>
      </div>
    </div>
    <form>
      <div class="wrapper-input">
        <label>NAME</label>
        <input v-if="editMode" v-model="userInfo.name" id="input-name" />
        <p v-else id="txt-name">{{ userInfo.name }}</p>
      </div>
      <div class="wrapper-input">
        <label>SURNAME</label>
        <input v-if="editMode" v-model="userInfo.surname" id="input-surname" />
        <p v-else id="txt-surname">{{ userInfo.surname }}</p>
      </div>
      <div class="wrapper-input">
        <label>STUDENT CODE</label>
        <input v-if="editMode" v-model="userInfo.code" id="input-code" />
        <p v-else id="txt-code">{{ userInfo.code }}</p>
      </div>
      <div class="wrapper-songs">
        <label>FAVORITE SONGS</label>
        <ul v-if="favoriteList && favoriteList.length">
          <li v-for="(song, index) in favoriteList" :key="index">
            <img id="img-album" :src="getAlbumImage(song)" alt="Album Cover" />
            <div class="song-info">
              <p id="txt-song" class="song-name">{{ song.name }}</p>
              <p id="txt-artist" class="song-artists">{{ getArtists(song.artists) }}</p>
            </div>
          </li>
        </ul>
        <div id="txt-empty" class="empty" v-else>NO SONGS FOUND</div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.js';

export default {
  data() {
    return {
      editMode: false,
      userInfo: {},
      favoriteList: []
    };
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    saveInfo() {
      const authStore = useAuthStore();
      this.editMode = false;
      Object.assign(authStore.user, this.userInfo);
    },
    fetchFavoriteSongs() {
      const authStore = useAuthStore();
      this.favoriteList = authStore.getFavoriteSongs();
    },
    getAlbumImage(song) {
      return song.album?.images?.[1]?.url || '';
    },
    getArtists(artists) {
      return Array.isArray(artists) ? artists.map(artist => artist.name).join(', ') : 'Fav song';
    }
  },
  mounted() {
    const authStore = useAuthStore();
    this.userInfo = { ...authStore.user };
    this.fetchFavoriteSongs();
  }
};
</script>

