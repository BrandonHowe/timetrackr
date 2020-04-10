import { HeartbeatData } from "../../helpers/heartbeats";

const findTotalDuration = (events: HeartbeatData[]): number => {
    let durationSum = 0;
    for (const event of events) {
        const eventDuration = event.timeend - event.timestart;
        durationSum += eventDuration;
    }
    return durationSum;
};

export { findTotalDuration }
