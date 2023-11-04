import { defineStore } from 'pinia'
import router from '@/router'

function setLocalStorageItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorageItem(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        user: {
            name: 'Kristaps',
            surname: 'Ciguzis',
            code: 'IT22018',
            favorite_songs: getLocalStorageItem('favorite_songs') || [],
        },
        authenticated: getLocalStorageItem('is_authenticated') || false,
    }),
    actions: {
        setUserData(name, surname, code) {
            this.user = { ...this.user, name, surname, code };
        },
       authenticate(email, password) {
            if (email === 'kristaps.ciguzis@va.lv' && password === '123456') {
                setLocalStorageItem('is_authenticated', true);
                this.authenticated = true;
                router.push({ name: 'Songs' });
            } else {
                alert('Wrong email or password!');
            }
        },
        logout() {
            localStorage.clear();
            this.$reset(); 
            router.push({ name: 'Login' });
        },
        toggleFavorite(songID) {
            const index = this.user.favorite_songs.indexOf(songID);
            if (index === -1) {
                this.user.favorite_songs.push(songID);
            } else {
                this.user.favorite_songs.splice(index, 1);
            }
            setLocalStorageItem('favorite_songs', this.user.favorite_songs);
        },
        getFavoriteSongs() {
            return this.user.favorite_songs;
        },
        getUserData() {
            return this.user;
        }
    },
    getters: {
        is_authenticated: (state) => state.authenticated
    },
})
