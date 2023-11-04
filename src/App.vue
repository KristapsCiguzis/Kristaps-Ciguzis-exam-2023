

<script>
import { useAuthStore } from './stores/auth';
import NavigationComponent from './components/NavigationComponent.vue';
import AudioPlayerComponent from './components/AudioPlayerComponent.vue';

export default {
    components: { NavigationComponent, AudioPlayerComponent },
    setup() {
        const auth = useAuthStore();

        return { auth };
    }
}
</script>
<template>
    <Header v-if="auth.is_authenticated" />
    <div id="section-body">
        <NavigationComponent v-if="auth.is_authenticated" />
        <router-view class="section-router"></router-view>
    </div>
    <div id="section-player" v-if="auth.is_authenticated">
        <AudioPlayerComponent />
    </div>
</template>


