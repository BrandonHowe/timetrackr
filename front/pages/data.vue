<template>
    <div class="data">
        <LineChart
            class="chart"
        ></LineChart>
        <LanguageChart
            class="chart"
        ></LanguageChart>
        <EditorChart
            class="chart"
        ></EditorChart>
        <ProjectChart
            class="chart"
        ></ProjectChart>
        <DailyChart
            class="chart"
        ></DailyChart>
    </div>
</template>

<script>
    import LineChart from "../components/TimeChart.vue";
    import LanguageChart from "../components/LanguageChart.vue";
    import EditorChart from "../components/EditorChart.vue";
    import ProjectChart from "../components/ProjectChart.vue";
    import DailyChart from "../components/DailyChart.vue";

    export default {
        name: 'data',
        components: {
            DailyChart,
            EditorChart,
            LanguageChart,
            LineChart,
            ProjectChart
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .data {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
    }
    .chart {
        display: inline-block;
        background-color: #ddd;
        border-radius: 10px;
        padding: 10px;
        margin: 10px;
    }
</style>
