<template>
    <div class="data">
        <LineChart></LineChart>
        <LanguageChart></LanguageChart>
    </div>
</template>

<script>
    import LineChart from "../components/TimeChart.vue";
    import LanguageChart from "../components/LanguageChart.vue";

    export default {
        name: 'data',
        components: {
            LanguageChart,
            LineChart
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
