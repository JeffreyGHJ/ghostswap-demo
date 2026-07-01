import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

const cyan = 'rgba(0, 190, 255, .4)'
const blue = 'rgba(0, 136, 255, .9)'
const purple = 'rgba(140, 0, 194, .3)'
const pink = 'rgba(200, 0, 200, .4)'
const yellow = 'rgba(255, 187, 0, .7)'
const black = 'rgba(0, 0, 0, .8)'
const red = 'rgba(255, 0, 0, .8)'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

export const options = {
  responsive: true,
  clip: false as const,
  maintainAspectRatio: false,
  animation: {
    duration: 100,
  },
  elements: {
    point: {
      radius: 8,
      pointBorderWidth: 1,
    },
    line: {
      tension: 0.4,
      segment: {
        borderWidth: 2,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
}

export function MintReserveChart(props) {
  const labels = [...Array(+props.amount + 1).keys()].slice(1)
  const data = {
    labels: labels,
    datasets: [
      {
        id: 1,
        fill: true,
        label: 'price',
        data: props.spotPrices,
        borderColor: cyan,
        backgroundColor: purple,
        pointBorderColor: labels.map((label) => (props.spotPrices[label - 1] > 0 ? blue : red)),
        pointBackgroundColor: labels.map((label) => (label <= props.selectedPoints ? yellow : black)),
      },
    ],
  }

  return (
    <div className="w-full h-full p-3 ">
      <Line options={options} data={data} datasetIdKey="id" />
    </div>
  )
}
