import React, { useEffect, useRef } from "react";
import { Chart, ChartOptions } from "chart.js/auto";

interface Metrics {
  accuracy: number;
  hallucination_rate: number;
  relevance: number;
  coherence: number;
  response_completeness: number;
  response_length: {
    expected: number;
    real: number;
  };
}

interface MetricsChartProps {
  metrics: Metrics;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ metrics }) => {
  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const pieChartRef = useRef<HTMLCanvasElement | null>(null);
  const barChartInstance = useRef<Chart | null>(null);
  const pieChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Destroy existing bar chart before creating a new one
    if (barChartInstance.current) {
      barChartInstance.current.destroy();
    }

    if (barChartRef.current) {
      barChartInstance.current = new Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels: ["Accuracy", "Hallucination Rate", "Relevance", "Coherence", "Completeness"],
          datasets: [
            {
              label: "Metrics",
              data: [
                metrics.accuracy,
                metrics.hallucination_rate,
                metrics.relevance * 10,
                metrics.coherence * 10,
                metrics.response_completeness,
              ],
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(153, 102, 255, 0.6)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
            },
          },
        } as ChartOptions,
      });
    }

    // Destroy existing pie chart before creating a new one
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
    }

    if (pieChartRef.current) {
      pieChartInstance.current = new Chart(pieChartRef.current, {
        type: "pie",
        data: {
          labels: ["Expected Length", "Real Length"],
          datasets: [
            {
              label: "Response Length",
              data: [metrics.response_length.expected, metrics.response_length.real],
              backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" },
          },
        } as ChartOptions,
      });
    }

    // Cleanup on unmount
    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }
    };
  }, [metrics]);

  return (
    <div className="chart-container">
      <div style={{ width: "100%", maxWidth: "600px", height: "400px", margin: "0 auto" }}>
        <canvas ref={barChartRef}></canvas>
      </div>
      <div className="mt-4" style={{ width: "100%", maxWidth: "400px", height: "400px", margin: "0 auto" }}>
        <canvas ref={pieChartRef}></canvas>
      </div>
    </div>
  );
};

export default MetricsChart;
