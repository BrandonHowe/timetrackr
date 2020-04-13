<template>
    <div class="dataBox">
        <h3>Today - {{ todayAmount }}</h3>
        <h4>Average per day - {{ averageAmount }}</h4>
    </div>
</template>

<script>
    import { currentUrl } from "../assets/config";

    export default {
        name: "DataBox",
        data () {
            return {
                averageAmount: "",
                todayAmount: ""
            }
        },
        methods: {
            async getDaily (user, timestamp) {
                const resp = await fetch(`${currentUrl}api/user/timeSpent/${user}/${timestamp}/7`);
                return this.msToTime(Math.floor((await resp.json()) / 7));
            },
            async getTotalToday (user, timestamp) {
                const resp = await fetch(`${currentUrl}api/user/timeSpent/${user}/${timestamp}/1`);
                return await resp.json();
            },
            msToTime (duration) {
                let seconds = Math.floor((duration / 1000) % 60),
                    minutes = Math.floor((duration / (1000 * 60)) % 60),
                    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

                return `${hours > 0 ? `${hours}h ` : ``}${minutes > 0 ? `${minutes}m ` : ``}${seconds}s`
            },
            getTimeOnDayAgo (daysAgo = 0) {
                let d = new Date();
                d.setDate(d.getDate() - daysAgo + 1);
                d.setUTCHours(0, 0, 0, 0);
                return Number(d);
            },
            async getTodayAmount() {
                this.averageAmount = await this.getDaily(1, this.getTimeOnDayAgo(0), 7);
                this.todayAmount = this.msToTime(await this.getTotalToday(1, this.getTimeOnDayAgo(0)));
            }
        },
        mounted () {
            this.getTodayAmount();
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
