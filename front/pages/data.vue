<template>
    <div class="data" v-if="loaded">
        <LineChart
            class="chart"
            :data="daysData"
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
            :total="totalAverage"
            :today="totalToday"
        ></DailyChart>
        <DataBox
            :today="totalToday"
            :average="totalAverage"
        ></DataBox>
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
            daysData: {},
            totalOverDays: 0,
            totalToday: 0,
            totalAverage: 0,
            days: 7
        }),
        methods: {
            getTimeOnDayAgo (daysAgo = 0) {
                let d = new Date();
                d.setDate(d.getDate() - daysAgo + 1);
                d.setUTCHours(0, 0, 0, 0);
                return Number(d);
            },
            async loadData(user) {
                const timestamp = this.getTimeOnDayAgo(0);
                const oneDayAgo = this.getTimeOnDayAgo(1);
                const days = this.days;
                const resp = await fetch(`${currentUrl}api/user/events/${user}/${timestamp}/${days}`);
                this.apiData = await resp.json();
                this.totalOverDays = this.apiData.reduce((acc, cur) => {
                    return acc + Number(cur.timeend - cur.timestart);
                }, 0);
                this.totalToday = this.apiData.reduce((acc, cur) => {
                    if (cur.timeend > oneDayAgo) {
                        return acc + Number(cur.timeend - cur.timestart);
                    } else {
                        return acc;
                    }
                }, 0);
                this.totalAverage = this.totalOverDays / days;
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
                let tempData = this.apiData.reduce((acc, cur) => {
                    if (acc[Math.floor((cur.timestart - this.getTimeOnDayAgo(days)) / 86400000)]) {
                        acc[Math.floor((cur.timestart - this.getTimeOnDayAgo(days)) / 86400000)].push(cur);
                    } else {
                        acc[Math.floor((cur.timestart - this.getTimeOnDayAgo(days)) / 86400000)] = [cur];
                    }
                    return acc;
                }, {});
                for (let i = 0; i < days; i++) {
                    if (!this.daysData[i]) {
                        this.daysData[i] = [];
                    }
                }
                const todayDatasetsData = Object.values(tempData).map(l => {
                    let total = {};
                    for (const event of l) {
                        if (total[event.project]) {
                            total[event.project] += event.timeend - event.timestart;
                        } else {
                            total[event.project] = event.timeend - event.timestart;
                        }
                    }
                    return total;
                })
                    .reduce((acc, cur, idx) => {
                        for (const i in cur) {
                            if (!cur.hasOwnProperty(i)) {
                                continue;
                            }
                            const event = cur[i];
                            if (acc.findIndex(l => l.label === i) !== -1) {
                                acc[acc.findIndex(l => l.label === i)].data[idx] += event;
                            } else {
                                acc.push({
                                    label: i,
                                    borderColor: new ColorHash({lightness: 0.48}).hex(i),
                                    backgroundColor: new ColorHash().hex(i),
                                    borderWidth: 2.5,
                                    data: [],
                                });
                                for (let j = 0; j < days; j++) {
                                    acc[acc.length - 1].data.push(0);
                                }
                                acc[acc.length - 1].data[idx] = event;
                            }
                        }
                        return acc;
                    }, []);
                let labels = [];
                for (let i = 0; i < days; i++) {
                    if (i === days - 1) {
                        labels.push("Today");
                    } else if (i === days - 2) {
                        labels.push("Yesterday");
                    } else {
                        labels.push(`${days - i - 1} ${i === days - 2 ? "day" : "days"} ago`);
                    }
                }
                this.daysData = {
                    labels,
                    datasets: todayDatasetsData
                };
                this.loaded = true;
            },
            async checkLogin () {
                const seshkey = localStorage.getItem("seshkey");
                if (seshkey) {
                    const resp = await fetch(`${currentUrl}loginSeshkey/${seshkey}`);
                    return await resp.json();
                } else {
                    return {status: false};
                }
            },
        },
        async mounted () {
            const loginData = await this.checkLogin();
            if (loginData.status) {
                this.loadData(loginData.userid);
            } else {
                this.$router.push('/login');
            }
        }
    };
</script>

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
