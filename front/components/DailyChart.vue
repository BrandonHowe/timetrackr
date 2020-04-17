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

    export default {
        name: "DailyChart",
        components: {
            DoughnutChart
        },
        props: {
            total: Number,
            today: Number,
            days: Number
        },
        data () {
            return {
                datacollection: {
                    labels: ["Time coded today", "Time not coded"],
                    datasets: [
                        {
                            label: "Time spent",
                            backgroundColor: ["#1E90FF"],
                            data: [Math.floor(this.today / this.total * 100), (100 - Math.floor(this.today / this.total * 100) > 0 ? 100 - Math.floor(this.today / this.total * 100) : 0)]
                        }
                    ]
                },
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
        }
    }
</script>

<style scoped>

</style>
