<template>
    <div class="small">
        <line-chart :chart-data="datacollection" :options="options" :height="400" :width="400"></line-chart>
        <button @click="fillData()">Randomize</button>
    </div>
</template>

<script>
    import LineChart from './LineChart'
    import { currentUrl } from '../assets/config';

    export default {
        name: "RandomChart",
        components: {
            LineChart
        },
        data () {
            return {
                datacollection: null,
                options: {
                    responsive: false,
                    legend: {
                        labels: {
                            fontSize: 14
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                // Include a dollar sign in the ticks
                                callback: () => ""
                            }
                        }],
                        y: {
                            beginAtZero: true
                        }
                    },
                    tooltips: {
                        mode: 'index',
                        callbacks: {
                            // Use the footer callback to display the sum of the items showing in the tooltip
                            label: (tooltipItems) => {
                                const duration = Number(tooltipItems.yLabel);
                                let seconds = Math.floor((duration / 1000) % 60),
                                    minutes = Math.floor((duration / (1000 * 60)) % 60),
                                    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

                                hours = (hours < 10) ? "0" + hours : hours;
                                minutes = (minutes < 10) ? "0" + minutes : minutes;
                                seconds = (seconds < 10) ? "0" + seconds : seconds;
                                return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds > 0 ? `${seconds}s` : ""}`;
                            },
                        },
                        footerFontStyle: 'normal'
                    },
                },
            }
        },
        mounted () {
            this.fillData()
        },
        methods: {
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
                d.setDate(d.getDate() - daysAgo);
                d.setUTCHours(0, 0, 0, 0);
                return Number(d);
            },
            async getDays (user, timestamp, days) {
                const resp = await fetch(`${currentUrl}userData/projectDaysData/${user}/${timestamp}/${days}`);
                return await resp.json();
            },
            async generateDays (dayCount = 1) {
                let labels = [];
                for (let i = 0; i < dayCount; i++) {
                    labels.push(`${dayCount - i} ${i === dayCount - 1 ? "day" : "days"} ago`);
                }
                const datasets = await this.getDays(1, this.getTimeOnDayAgo(0), 7);
                console.log(datasets);
                return {
                    labels,
                    datasets
                }
            },
            async fillData () {
                this.datacollection = await this.generateDays(7);
            },
            getRandomInt () {
                return Math.floor(Math.random() * (50 - 5 + 1)) + 5
            }
        }
    }
</script>

<style>
    .small {
        max-width: 600px;
        margin:  150px auto;
    }
</style>
