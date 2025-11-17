import timelineData from '../components/data/Timeline.data';

// Simulated API: returns a Promise that resolves to the timeline data after a short delay.
export function fetchTimelineData({ delay = 300 } = {}) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(timelineData))), delay);
  });
}
