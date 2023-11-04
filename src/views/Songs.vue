<template>
  <div id="songs-view" @scroll="handleScroll">
    <div class="wrapper-header">
      <h1>SONGS</h1>
      <div class="wrapper-search">
        <input id="input-search" placeholder="Search by title..." v-model="search" @input="searchSongs">
      </div>
      <div class="wrapper-settings">
        <button id="btn-show-favorites" :class="{ active: showFavorites }" @click="toggleFavorites">Show Favorites</button>
      </div>
    </div>
    <div class="wrapper-songs">
      <table cellspacing="0" cellpadding="0">
        <tr ref="header" style="background: var(--c-dark);">
          <th id="th-id">#</th>
       <IconCaretUp v-if="sort.by === 'title' && sort.order !== ''" color="var(--c-accent-secondary)"
                         :class="{ 'flip-vertical': sort.order === 'desc' }" />
          <th id="th-title" :class="{ active: isSortedBy('title') }" @click="sortBy('title')">Title {{ renderSortIcon('title') }}</th>
          <th id="th-artist">Artist</th>
          <th id="th-album">Album</th>
          <th id="th-duration" :class="{ active: isSortedBy('duration') }" @click="sortBy('duration')">Duration {{ renderSortIcon('duration') }}</th>
        </tr>
        <tr class="song" v-for="(song, index) in filteredSongs" :key="song.name" @click="handleSongClick(song)">
          <td id="td-index">
            <IconPlay :color="getIconColor(song)" />
            <span id="txt-index">{{ index + 1 }}</span>
          </td>
          <td id="td-title">
            <img :src="song.album.images[0].url" />
            {{ song.name }}
          </td>
          <td id="td-artist">{{ getArtistNames(song.artists) }}</td>
          <td id="td-album">{{ song.album.name }}</td>
          <td id="td-duration">
            {{ formatDuration(song.duration_ms) }}
            <IconHeart :class="{ active: authStore.getFavoriteSongs().includes(song.id) }" @click="authStore.toggleFavorite(song.id)" style="opacity: 1; color: white;" />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import IconCaretUp from '@/components/icons/IconCaretUp.vue';
import IconPlay from '@/components/icons/IconPlay.vue';
import IconHeart from '@/components/icons/IconHeart.vue';
import Songs from '../data/songs';
import { usePlayerStore } from '@/stores/player';
import { useAuthStore } from '../stores/auth';

export default {
  name: 'Songs',
  components: {
    IconPlay,
    IconHeart,
  },
  data() {
    return {
      search: '',
      showFavorites: false,
      sort: {
        by: '',
        order: 'asc',
      },
      songs: [],
      authStore: useAuthStore(),
      playerStore: usePlayerStore(),
      lastClicked: null, 
      doubleClick: false, 
    };
  },
  methods: {
    searchSongs() {
      if (this.search === '') {
        this.songs = [...Songs];
        return;
      }
      const searchRegex = new RegExp(this.search, 'i');
      this.songs = Songs.filter(song => searchRegex.test(song.name));
    },
    toggleFavorites() {
      this.showFavorites = !this.showFavorites;
    },
    formatDuration(duration_ms) {
      const minutes = Math.floor(duration_ms / 60000);
      const seconds = ((duration_ms % 60000) / 1000).toFixed(0);
      return `${minutes}:${seconds.padStart(2, '0')}`;
    },
    isSortedBy(by) {
      return this.sort.by === by;
    },
    renderSortIcon(by) {
      if (this.isSortedBy(by) && this.sort.order !== '') {
        return this.sort.order === 'asc' ? '▲' : '▼';
      }
      return '';
    },
    getIconColor(song) {
      return song === this.playerStore.getNowPlaying ? 'var(--c-accent-secondary)' : '';
    },
    handleSongClick(song) {
      if (this.lastClicked === song) {
        if (!this.doubleClick) {
         
          this.doubleClick = true;
          setTimeout(() => {
            if (this.doubleClick) {
              this.playSong(song);
            }
            this.doubleClick = false; 
          }, 300); 
        } else {
          
          this.doubleClick = false; 
          this.playSong(song);
        }
      } else {
        this.doubleClick = false;
        this.lastClicked = song;
      }
    },
    playSong(song) {
      this.playerStore.setNowPlaying(song);
    },
    toggleFavorite(song) {
      song.favorite = !song.favorite;
      if (song.favorite) {
        this.authStore.addToFavorites(song.id);
      } else {
        this.authStore.removeFromFavorites(song.id);
      }
    },
    getArtistNames(artists) {
      return artists?.map(artist => artist.name).join(', ') || '';
    },
    sortBy(by) {
      if (this.sort.by === by) {
        this.sort.order = this.sort.order === 'asc' ? 'desc' : '';
      } else {
        this.sort.by = by;
        this.sort.order = 'asc';
      }
      this.songs = [...Songs].filter(song => song.name.toLowerCase().includes(this.search.toLowerCase()));
      if (this.sort.by === 'title') {
        this.songs.sort((a, b) => (this.sort.order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
      } else if (this.sort.by === 'duration') {
        this.songs.sort((a, b) => (this.sort.order === 'asc' ? a.duration_ms - b.duration_ms : b.duration_ms - a.duration_ms));
      }
    },
  },
  mounted() {
    this.songs = [...Songs];
    this.playerStore.setPlaylist(this.songs);
  },
  computed: {
    filteredSongs() {
      const favoriteSongs = this.authStore.getFavoriteSongs();
      return this.songs.filter(song => {
        if (!this.showFavorites || favoriteSongs.includes(song.id)) {
          return song.name.toLowerCase().includes(this.search.toLowerCase());
        }
        return false;
      });
    },
  },
};
</script>
