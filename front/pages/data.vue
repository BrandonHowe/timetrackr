<template>
    <div class="data">
        <LineChart></LineChart>
    </div>
</template>

<script>
    import LineChart from "../components/RandomChart.vue";

    export default {
        name: 'data',
        components: {
            LineChart
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
