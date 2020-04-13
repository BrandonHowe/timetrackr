<template>
    <div class="dailyChart">
        <DoughnutChart
            ref="doughnutChart"
            :chart-data="datacollection"
            :options="options"
            :height="250"
            :width="300"
        ></DoughnutChart>
    </div>
</template>

<script>
    import DoughnutChart from "./ChartData/DoughnutChart";
    import { currentUrl } from "../assets/config";

    export default {
        name: "DailyChart",
        components: {
            DoughnutChart
        },
        data () {
            return {
                datacollection: {},
                amountToday: "",
                options: {
                    responsive: false,
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        fontSize: 20,
                        text: `Today`
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    },
                    tooltips: {
                        // mode: 'index',
                        callbacks: {
                            label: (tooltipItem, data) => {
                                return `${data.labels[tooltipItem.index]}: ${data.datasets[0].data[tooltipItem.index]}% of average`
                            },
                        },
                        footerFontStyle: 'normal',
                    },
                }
            }
        },
        methods: {
            async getDaily (user, timestamp, days) {
                const resp = await fetch(`${currentUrl}userData/timeTodayComparedToDays/${user}/${timestamp}/${days}`);
                return await resp.json();
            },
            async getTotalToday (user, timestamp) {
                const resp = await fetch(`${currentUrl}api/user/timeSpent/${user}/${timestamp}/1`);
                return await resp.json();
            },
            msToTime (duration) {
                let seconds = Math.floor((duration / 1000) % 60),
                    minutes = Math.floor((duration / (1000 * 60)) % 60),
                    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

                hours = (hours < 10) ? "0" + hours : hours;
                minutes = (minutes < 10) ? "0" + minutes : minutes;
                seconds = (seconds < 10) ? "0" + seconds : seconds;
                return hours + ":" + minutes + ":" + seconds;
            },
            getTimeOnDayAgo (daysAgo = 0) {
                let d = new Date();
                d.setDate(d.getDate() - daysAgo + 1);
                d.setUTCHours(0, 0, 0, 0);
                return Number(d);
            },
            async fillData () {
                this.datacollection = await this.getDaily(1, this.getTimeOnDayAgo(0), 7);
                this.amountToday = this.msToTime(await this.getTotalToday(1, this.getTimeOnDayAgo(0)));
            },
        },
        mounted () {
            this.fillData();
        }
    }
</script>

<style scoped>

</style>
