import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import NavBar from "../components/NavBar";

export default function Demo() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBLSData() {
      try {
        setLoading(true);

        // Build query parameters for GET request
        const params = new URLSearchParams({
          seriesid: "CEU3100000001", // Manufacturing employment
          startyear: "2015",
          endyear: "2024",
          registrationkey: process.env.REACT_APP_BoLS_API_KEY || ""
        });

        const url = `https://resumedemobls-a7cja7bchqc7a8em.chilecentral-01.azurewebsites.net/api/bls/employment?${params}`;

        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          headers: {
            "Accept": "application/json"
          }
        }).catch(err => {
          throw new Error(`Network error: ${err.message}. This might be a CORS issue or the API is unreachable.`);
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const json = await response.json();
        console.log("API Response:", json);

        if (json.status !== "REQUEST_SUCCEEDED") {
          throw new Error(`API error: ${json.message || "Unknown error"}`);
        }

        if (!json.Results?.series?.[0]?.data) {
          throw new Error("Unexpected API response structure");
        }

        const series = json.Results.series[0].data.map(item => ({
          date: `${item.year}-${String(item.period.replace("M", "")).padStart(2, "0")}`,
          displayDate: `${item.periodName.slice(0, 3)} ${item.year}`,
          value: Number(item.value)
        }));

        setData(series.reverse()); // reverse so earliest date is first
        setError(null);
      } catch (error) {
        console.error("Error fetching BLS data:", error);
        setError(error.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBLSData();
  }, []);

  return (
    <>
    <NavBar />
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>Manufacturing Employment (Thousands)</h2>

      {loading && <p>Loading data...</p>}

      {error && (
        <div style={{ color: "red", padding: "10px", backgroundColor: "#fee" }}>
          Error: {error}
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="displayDate"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={Math.floor(data.length / 12)} // Show ~12 labels
            />
            <YAxis
              label={{ value: "Employment (Thousands)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
              name="Employment"
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {!loading && !error && data.length === 0 && (
        <p>No data available</p>
      )}
    </div>
    </>
  );
}
