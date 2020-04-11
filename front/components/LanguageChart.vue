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
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Languages'
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    },
                    tooltips: {
                        // mode: 'index',
                        callbacks: {
                            label: (tooltipItem, data) => {
                                const duration = Number(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
                                let seconds = Math.floor((duration / 1000) % 60),
                                    minutes = Math.floor((duration / (1000 * 60)) % 60),
                                    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

                                hours = (hours < 10) ? "0" + hours : hours;
                                minutes = (minutes < 10) ? "0" + minutes : minutes;
                                seconds = (seconds < 10) ? "0" + seconds : seconds;
                                return `${`${data.labels[tooltipItem.index]}:` || ''} ${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds > 0 ? `${seconds}s` : ""}`;
                            },
                        },
                        footerFontStyle: 'normal',
                    },
                }
            }
        },
        methods: {
            async getLanguages (user, timestamp, days) {
                const resp = await fetch(`${currentUrl}userData/languageData/${user}/${timestamp}/${days}`);
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
