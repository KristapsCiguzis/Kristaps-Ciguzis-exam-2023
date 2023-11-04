
<script>
export default {
    data() {
        return {
            paths: [
                { path: '/', name: 'SONGS' },
                { path: '/albums', name: 'ALBUMS' },
                { path: '/about', name: 'ABOUT' }
            ]
        }
    }
}
</script>

<template>
    <nav id="nav-main" class="wrapper-navigation">
        <ol>
            <li>
                <router-link v-for="p in paths" :to="p.path">{{ p.name }}</router-link>
            </li>
        </ol>
    </nav>
</template>