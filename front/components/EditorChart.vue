<template>
    <div class="editorChart">
        <DoughnutChart
            :chart-data="datacollection"
            :options="options"
            :height="250"
            :width="300"
        ></DoughnutChart>
    </div>
</template>

<script>
    import DoughnutChart from "./ChartData/DoughnutChart";

    export default {
        name: "EditorChart",
        components: {
            DoughnutChart
        },
        props: {
            editorData: Object
        },
        data () {
            return {
                datacollection: this.editorData,
                options: {
                    responsive: false,
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        fontSize: 20,
                        text: 'Editors'
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
                                    let seconds = Math.floor((duration / 1000) % 60),
                                        minutes = Math.floor((duration / (1000 * 60)) % 60),
                                        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

                                    hours = (hours < 10) ? "0" + hours : hours;
                                    minutes = (minutes < 10) ? "0" + minutes : minutes;
                                    seconds = (seconds < 10) ? "0" + seconds : seconds;
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
        mounted () {
            console.log(this.editorData);
        }
    }
</script>

<style scoped>

</style>
