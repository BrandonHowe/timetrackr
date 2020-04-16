<template>
    <div class="login">
        <v-tabs
            :grow="true"
        >
            <v-tab>
                Log in
            </v-tab>
            <v-tab>
                Create user
            </v-tab>
            <v-tab-item>
                <LoginPage></LoginPage>
            </v-tab-item>
            <v-tab-item>
                <CreateUser></CreateUser>
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script>
    import CreateUser from "../components/Login/CreateUser.vue";
    import LoginPage from "../components/Login/LoginPage.vue";
    export default {
        name: "login",
        components: {
            LoginPage,
            CreateUser
        },
    }
</script>

<style scoped>

</style>
