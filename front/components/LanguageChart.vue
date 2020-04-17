<template>
    <div class="languageChart">
        <DoughnutChart
            :chart-data="datacollection"
            :options="options"
            :height="250"
            :width="300"
        ></DoughnutChart>
    </div>
</template>

<script>
    import DoughnutChart from './ChartData/DoughnutChart'

    export default {
        name: "LanguageChart",
        components: {
            DoughnutChart,
        },
        props: {
            languageData: Object
        },
        data () {
            return {
                datacollection: this.languageData,
                options: {
                    responsive: false,
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        fontSize: 20,
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
                                if (duration > 0) {
                                    const seconds = Math.floor((duration / 1000) % 60),
                                        minutes = Math.floor((duration / (1000 * 60)) % 60),
                                        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
                                    return `${`${data.labels[tooltipItem.index]}:` || ''} ${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds > 0 ? `${seconds}s` : ""}`;
                                } else {
                                    return "";
                                }
                            },
                        },
                        footerFontStyle: 'normal',
                    },
                }
            }
        },
    }
</script>

<style scoped>

</style>
