<template>
  <div id="album-view">
      <div class="wrapper-header">
          <h1>ALBUMS</h1>
          <div class="settings">
              <button id="btn-grid" :class="{ active: isGrid }" @click="toggleGrid(true)">
                  <IconGrid />
              </button>
              <button id="btn-list" :class="{ active: !isGrid }" @click="toggleGrid(false)">
                  <IconList />
              </button>
          </div>
      </div>
      <ul id="list-albums" :class="{ grid: isGrid }">
          <li class="album" v-for="album in albums" :key="album.id" @click="selectAlbum(album.id)" :class="{ active: album.id === getCurrentAlbumId }">
              <img id="img-album" :src="album.images[1].url" />
              <div class="album-info">
                  <h4 id="txt-album-name">{{ album.name }}</h4>
                  <p id="txt-album-artists">{{ getArtists(album.artists) }}</p>
                  <div class="album-year">
                      <p id="txt-album-year">{{ getYear(album.release_date) }}</p>
                      <p id="txt-album-tracks">{{ getTrackCount(album.tracks.length) }}</p>
                  </div>
              </div>
          </li>
      </ul>
  </div>
</template>

<script>
import IconGrid from '../components/icons/IconGrid.vue'
import IconList from '../components/icons/IconList.vue'
import { usePlayerStore } from '@/stores/player'
import Songs from '../data/songs'

export default {
  components: {
      IconGrid,
      IconList
  },
  data() {
      return {
          isGrid: true,
          click: 0,
      }
  },
  methods: {
      toggleGrid(value) {
          this.isGrid = value;
      },
      selectAlbum(albumID) {
          this.click++;
          setTimeout(() => {
              if (this.click === 2) {
                  const player = usePlayerStore();
                  player.setPlaylist(this.albums[albumID].tracks);
                  player.setNowPlaying(this.albums[albumID].tracks[0]);
              }
              this.click = 0;
          }, 500);
      },
      getArtists(artists) {
          return artists.map(artist => artist.name).join(', ');
      },
      getYear(release_date) {
          return new Date(release_date).getFullYear();
      },
      getTrackCount(trackCount) {
          return `${trackCount} ${trackCount > 1 ? 'songs' : 'song'}`;
      },
  },
  computed: {
       albums() {
      const songs = Songs || []
      const albums = {}
      songs.forEach((song) => {
        if (!albums[song.album.id]) {
          albums[song.album.id] = {
            id: song.album.id,
            name: song.album.name,
            images: song.album.images,
            artists: song.album.artists,
            release_date: song.album.release_date,
            tracks: []
          }
        }
        albums[song.album.id].tracks.push(song)
      })
      return albums
    },
  },
      getCurrentAlbumId() {
          const player = usePlayerStore();
          return player.getNowPlayingAlbumID;
      }
  }

</script>
