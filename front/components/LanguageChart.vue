<template>
    <div class="doughnut">
        <DoughnutChart :chart-data="datacollection" :options="options" :height="400" :width="400"></DoughnutChart>
    </div>
</template>

<script>
    import DoughnutChart from './DoughnutChart'
    import { currentUrl } from "../assets/config";

    export default {
        name: "LanguageChart",
        components: {
            DoughnutChart,
        },
        data () {
            return {
                datacollection: null,
                options: {
                    responsive: false,
                    legend: {
                        labels: {
                            fontSize: 14,
                        },
                    },
                    scales: {
                        xAxes: [{
                            stacked: true,
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
                                const duration = Number(tooltipItem.yLabel);
                                let seconds = Math.floor((duration / 1000) % 60),
                                    minutes = Math.floor((duration / (1000 * 60)) % 60),
                                    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

                                hours = (hours < 10) ? "0" + hours : hours;
                                minutes = (minutes < 10) ? "0" + minutes : minutes;
                                seconds = (seconds < 10) ? "0" + seconds : seconds;
                                return `${`${data.datasets[tooltipItem.datasetIndex].label}:` || ''} ${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds > 0 ? `${seconds}s` : ""}`;
                            },
                        },
                        footerFontStyle: 'normal',
                    },
                },
            }
        },
        methods: {
            async Languages (user, timestamp, days) {
                const resp = await fetch(`${currentUrl}userData/projectDaysData/${user}/${timestamp}/${days}`);
                return await resp.json();
            },
        },
    }
</script>

<style scoped>

</style>
