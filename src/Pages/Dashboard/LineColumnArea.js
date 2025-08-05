import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from 'react-redux';

const LineColumnArea = () => {
  const stats = useSelector((state) => state.stats.stats);

  // Debug: Log stats and monthly data
  console.log('Stats from Redux:', stats);
  if (stats && stats.monthly) {
    console.log('Monthly total_patients:', stats.monthly.total_patients);
    console.log('Monthly activated_patients:', stats.monthly.activated_patients);
    console.log('Monthly patients_with_scans:', stats.monthly.patients_with_scans);
  } else {
    console.log('No monthly data in stats');
  }

  // Use months from API if available, otherwise fallback to Jan-Dec
  const months = (stats && stats.monthly && Array.isArray(stats.monthly.months) && stats.monthly.months.length === 12)
    ? stats.monthly.months
    : [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  // Fallback to overview values for all months if monthly is missing
  const getMonthly = (key) => {
    if (stats && stats.monthly && Array.isArray(stats.monthly[key]) && stats.monthly[key].length === 12) {
      return stats.monthly[key];
    }
    if (stats && stats.overview && typeof stats.overview[key] === 'number') {
      return Array(12).fill(stats.overview[key]);
    }
    return Array(12).fill(0);
  };

  const chartData = {
    series: [
      {
        name: "Total Patients",
        type: "column",
        data: getMonthly('total_patients'),
      },
      {
        name: "Activated Patients",
        type: "area",
        data: getMonthly('activated_patients'),
      },
      {
        name: "Patients with Scans",
        type: "line",
        data: getMonthly('patients_with_scans'),
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
      colors: ["#0ab39c", "rgba(212, 218, 221, 0.18)", "#0dcaf0"],
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
        },
      },
      labels: months,
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
        labels: {
          formatter: function(value) {
            // value is e.g. '2025-07' or '2024-06'
            if (typeof value === 'string' && value.length === 7 && value.includes('-')) {
              const monthNum = parseInt(value.split('-')[1], 10);
              // Map 1-12 to Jan-Dec
              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return monthNames[monthNum - 1] || value;
            }
            return value;
          }
        }
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
  };

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
