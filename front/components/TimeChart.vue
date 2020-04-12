<template>
    <div class="small">
        <LineChart
            :chart-data="datacollection"
            :options="options"
            :height="300"
            :width="300"
        ></LineChart>
    </div>
</template>

<script>
    import LineChart from './ChartData/LineChart'
    import { currentUrl } from '../assets/config';

    export default {
        name: "RandomChart",
        components: {
            LineChart,
        },
        data () {
            return {
                datacollection: {},
                options: {
                    responsive: false,
                    legend: {
                        labels: {
                            fontSize: 14,
                        },
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false
                            },
                            stacked: true,
                            barPercentage: 1,
                        }],
                        yAxes: [{
                            ticks: {
                                // Include a dollar sign in the ticks
                                callback: () => "",
                            },
                            stacked: true,
                        }],
                        y: {
                            beginAtZero: true,
                        },
                    },
                    tooltips: {
                        mode: 'index',
                        callbacks: {
                            label: (tooltipItem, data) => {
                                if (tooltipItem.yLabel > 0) {
                                    const duration = Number(tooltipItem.yLabel);
                                    let seconds = Math.floor((duration / 1000) % 60),
                                        minutes = Math.floor((duration / (1000 * 60)) % 60),
                                        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

                                    hours = (hours < 10) ? "0" + hours : hours;
                                    minutes = (minutes < 10) ? "0" + minutes : minutes;
                                    seconds = (seconds < 10) ? "0" + seconds : seconds;
                                    return `${`${data.datasets[tooltipItem.datasetIndex].label}:` || ''} ${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds > 0 ? `${seconds}s` : ""}`;
                                } else {
                                    return "";
                                }
                            },
                        },
                        footerFontStyle: 'normal',
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
                d.setDate(d.getDate() - daysAgo + 1);
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
                    if (i === dayCount - 1) {
                        labels.push("Today");
                    } else if (i === dayCount - 2) {
                        labels.push("Yesterday");
                    } else {
                        labels.push(`${dayCount - i - 1} ${i === dayCount - 2 ? "day" : "days"} ago`);
                    }
                }
                const datasets = await this.getDays(1, this.getTimeOnDayAgo(0), 7);
                return {
                    labels,
                    datasets,
                }
            },
            async fillData () {
                this.datacollection = await this.generateDays(7);
            },
        },
    }
</script>
