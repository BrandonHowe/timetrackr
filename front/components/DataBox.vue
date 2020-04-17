<template>
    <div class="dataBox">
        <h3>Today - {{ msToTime(today) }}</h3>
        <h4>Average per day - {{ msToTime(Math.floor(average)) }}</h4>
    </div>
</template>

<script>
    export default {
        name: "DataBox",
        props: {
            today: Number,
            average: Number
        },
        methods: {
            msToTime (duration) {
                const seconds = Math.floor((duration / 1000) % 60),
                    minutes = Math.floor((duration / (1000 * 60)) % 60),
                    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
                return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds > 0 || minutes === 0 && hours === 0 ? `${seconds}s` : ""}`;
            }
        }
    }
</script>

<style scoped>
    .dataBox {
        width: 320px;
        height: 280px;
        padding: 20px;
        text-align: center;
        display: inline-block;
        background-color: #ddd;
        border-radius: 10px;
        margin: 10px;
        color: #666;
        font-size: 18px;
        user-select: none;
    }
</style>
