<template>
    <div class="dailyChart">
        <DoughnutChart
            :chart-data="datacollection"
            :options="options"
            :height="300"
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
                options: {
                    responsive: false,
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Today'
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
            async getLanguages (user, timestamp, days) {
                const resp = await fetch(`${currentUrl}userData/timeTodayComparedToDays/${user}/${timestamp}/${days}`);
                return await resp.json();
            },
            getTimeOnDayAgo (daysAgo = 0) {
                let d = new Date();
                d.setDate(d.getDate() - daysAgo + 1);
                d.setUTCHours(0, 0, 0, 0);
                return Number(d);
            },
            async fillData () {
                this.datacollection = await this.getLanguages(1, this.getTimeOnDayAgo(0), 7);
                console.log(this.datacollection);
            },
        },
        mounted () {
            this.fillData();
        }
    }
</script>

<style scoped>

</style>
