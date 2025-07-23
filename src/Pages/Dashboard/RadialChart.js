import React from "react";
import ReactApexChart from "react-apexcharts";

const RadialChart = ({ labels = [], series = [], colors = [] }) => {
  const total = series.reduce((a, b) => a + (parseInt(b) || 0), 0);
  const options = {
    chart: {
      height: 350,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 10,
          size: "45%",
        },
        track: {
          show: true,
          strokeWidth: "70%",
          margin: 12,
        },
        dataLabels: {
          name: {
            fontSize: "16px",
          },
          value: {
            fontSize: "14px",
          },
          total: {
            show: true,
            label: "Total",
            formatter: function () {
              return total;
            },
          },
        },
      },
    },
    labels: labels,
    colors: colors.length ? colors : ["#099680", "#4aa3ff", "#f0ad4e"],
  };
  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height="350"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default RadialChart;
