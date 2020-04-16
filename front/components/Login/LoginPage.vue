<template>
    <div class="create">
        <v-form>
            <v-text-field
                v-model="username"
                label="Username"
                required
            ></v-text-field>
            <v-text-field
                v-model="password"
                label="Password"
                required
            ></v-text-field>
            <v-btn
                class="mr-4"
                @click="submit"
                color="light-blue accent4 white--text"
                height="40"
                style="display: inline-block"
            >Login</v-btn>
        </v-form>
        <v-snackbar
            v-model="snackbarOpen"
            :top="true"
            color="error"
        >{{ status }}
            <v-btn
                color="white"
                text
                @click="status = ''"
            >
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import { currentUrl } from "../../assets/config";

    export default {
        name: "LoginPage",
        data () {
            return {
                username: "",
                password: "",
                status: ""
            }
        },
        methods: {
            async submit () {
                const data = {
                    username: this.username,
                    password: this.password
                };
                if (data.username === "" || data.password === "") {
                    this.status = "Make sure to fill in your username and password.";
                    return;
                }
                const resp = await fetch(`${currentUrl}login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                const status = await resp.json();
                if (status.status === true) {
                    localStorage.setItem("username", data.username);
                    localStorage.setItem("password", data.password);
                    localStorage.setItem("seshkey", status.seshkey);
                    this.status = "Success!";
                } else {
                    this.status = "Failed";
                }
            }
        },
        computed: {
            snackbarOpen: function () {
                return this.status !== '';
            }
        }
    }
</script>

<style scoped>
    .create {
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 2px;
        box-shadow: 0 2px 5px #ccc;
    }
</style>
