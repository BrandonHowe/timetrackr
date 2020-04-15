<template>
    <div class="about">
        <h2 class="welcome">Welcome to TimeTrackr!</h2>
        <div class="mission">
            <h3>TimeTrackr's mission</h3>
            <p>TimeTrackr is committed to making time tracking easy and simple. By making an open source platform to automatically log and review the time you spend coding, we will ensure that you can focus all your time on the thing that matters most: coding.</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "about",
    }
</script>

<style scoped>
    .welcome {
        text-align: center;
        padding: 20px;
        background-color: #ddd;
        border-radius: 10px;
        margin: 50px 0 50px 0;
    }

    .mission {
        padding: 20px;
        background-color: #333;
        color: white;
        border-radius: 10px;
        margin: 50px 0 50px 0;
    }
</style>
