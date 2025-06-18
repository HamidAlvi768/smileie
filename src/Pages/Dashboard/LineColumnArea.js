import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const LineColumnArea = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Appointments",
        type: "column",
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 18],
      },
      {
        name: "Follow-ups",
        type: "area",
        data: [44, 55, 41, 42, 22, 43, 21, 41, 56, 27, 43, 27],
      },
      {
        name: "New Patients",
        type: "line",
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
      },
      stroke: {
        width: [0, 1, 1],
        dashArray: [0, 0, 5],
        curve: "smooth",
      },
      plotOptions: {
        bar: {
          columnWidth: "18%",
        },
      },
      legend: {
        show: false,
      },
      colors: ["#0ab39c", "rgba(212, 218, 221, 0.18)", "rgb(251, 77, 83)"],
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
        },
      },
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      markers: {
        size: 0,
      },
      xaxis: {
        type: "category",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: true,
        labels: {
          show: true,
          formatter: function (value) {
            return value.toFixed(0);
          }
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " patients";
            }
            return y;
          },
        },
      },
      grid: {
        borderColor: "#f1f1f1",
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
    },
  });

  useEffect(() => {
    // Ensure chart is properly initialized
    const timer = setTimeout(() => {
      setChartData(prevData => ({
        ...prevData,
        series: [...prevData.series]
      }));
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <React.Fragment>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={350}
          className="apex-charts"
        />
      </div>
    </React.Fragment>
  );
};

export default LineColumnArea;
