<template>
    <div class="data" v-if="loaded">
        <LineChart
            class="chart"
        ></LineChart>
        <LanguageChart
            class="chart"
            :languageData="languageData"
        ></LanguageChart>
        <EditorChart
            class="chart"
            :editorData="editorData"
        ></EditorChart>
        <ProjectChart
            class="chart"
            :projectData="projectData"
        ></ProjectChart>
        <DailyChart
            class="chart"
        ></DailyChart>
        <DataBox></DataBox>
    </div>
</template>

<script>
    import LineChart from "../components/TimeChart.vue";
    import LanguageChart from "../components/LanguageChart.vue";
    import EditorChart from "../components/EditorChart.vue";
    import ProjectChart from "../components/ProjectChart.vue";
    import DailyChart from "../components/DailyChart.vue";
    import DataBox from "../components/DataBox.vue";
    import { currentUrl } from "../assets/config";
    import ColorHash from "color-hash";

    export default {
        name: 'data',
        components: {
            DailyChart,
            EditorChart,
            LanguageChart,
            LineChart,
            ProjectChart,
            DataBox,
        },
        data: () => ({
            loaded: false,
            apiData: [],
            languageData: {},
            editorData: {},
            projectData: {},
            user: 1,
        }),
        methods: {
            getTimeOnDayAgo (daysAgo = 0) {
                let d = new Date();
                d.setDate(d.getDate() - daysAgo + 1);
                d.setUTCHours(0, 0, 0, 0);
                return Number(d);
            },
        },
        async mounted () {
            const timestamp = this.getTimeOnDayAgo(0);
            const days = 7;
            const resp = await fetch(`${currentUrl}api/user/events/${this.user}/${timestamp}/${days}`);
            this.apiData = await resp.json();
            this.languageData = Object.entries(this.apiData.reduce((acc, cur) => {
                const currentLang = cur.language === "PLAIN_TEXT" ? "Other" : cur.language;
                if (acc[currentLang]) {
                    acc[currentLang] += cur.timeend - cur.timestart;
                } else {
                    acc[currentLang] = cur.timeend - cur.timestart;
                }
                return acc;
            }, {}))
                .reduce((acc, cur) => {
                    acc.datasets[0].data.push(cur[1]);
                    acc.datasets[0].backgroundColor.push(new ColorHash().hex(cur[0]));
                    acc.labels.push(cur[0]);
                    return acc;
                }, {
                    datasets: [{
                        label: "Projects",
                        backgroundColor: [],
                        data: [],
                    }],
                    labels: [],
                });
            this.editorData = Object.entries(this.apiData.reduce((acc, cur) => {
                const currentEditor = cur.editor;
                if (acc[currentEditor]) {
                    acc[currentEditor] += cur.timeend - cur.timestart;
                } else {
                    acc[currentEditor] = cur.timeend - cur.timestart;
                }
                return acc;
            }, {}))
                .reduce((acc, cur) => {
                    const currentIdx = cur[0] === "idea" ? "IntelliJ IDEA" : cur[0];
                    acc.datasets[0].data.push(cur[1]);
                    acc.datasets[0].backgroundColor.push(new ColorHash().hex(currentIdx));
                    acc.labels.push(currentIdx);
                    return acc;
                }, {
                    datasets: [{
                        label: "Editors",
                        backgroundColor: [],
                        data: [],
                    }],
                    labels: [],
                });
            this.projectData = Object.entries(this.apiData.reduce((acc, cur) => {
                const currentProject = cur.project;
                if (acc[currentProject]) {
                    acc[currentProject] += cur.timeend - cur.timestart;
                } else {
                    acc[currentProject] = cur.timeend - cur.timestart;
                }
                return acc;
            }, {}))
                .reduce((acc, cur) => {
                    acc.datasets[0].data.push(cur[1]);
                    acc.datasets[0].backgroundColor.push(new ColorHash().hex(cur[0]));
                    acc.labels.push(cur[0]);
                    return acc;
                }, {
                    datasets: [{
                        label: "Projects",
                        backgroundColor: [],
                        data: [],
                    }],
                    labels: [],
                });
            this.loaded = true;
        },
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
