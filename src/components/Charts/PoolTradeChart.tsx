import React, { useEffect, useState } from 'react'
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
const pink = 'rgba(200, 0, 200, .6)'
const yellow = 'rgba(255, 187, 0, .7)'
const black = 'rgba(0, 0, 0, .8)'
const red = 'rgba(255, 0, 0, .8)'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

export const options = {
  responsive: true,
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

export function PoolTradeChart(props) {
  const [mounted, setMounted] = useState(false)
  const labelsLeft = [...Array(+props.amountToBuy + 1).keys()].slice(1).reverse()
  const labelsRight = [...Array(+props.amountToSell + 1).keys()].slice(1)
  const chartLabels = labelsLeft.concat(labelsRight)
  const pricePoints = props.spotPricesBuy.concat(props.spotPricesSell)
  const gradientMidpoint = (props.spotPricesBuy.length / pricePoints.length) * 100
  let pointColorsLeft = []
  let pointColorsRight = []

  // const [ctx, setCtx] = useState(null)
  // const [x, setX] = useState(null)

  // useEffect(() => {
  //   setMounted(true)
  //   setCtx(document.getElementById('canvas') as HTMLCanvasElement)
  //   // setX(ctx.getContext('2d'))
  // }, [])

  // useEffect(() => {
  //   if (ctx) setX(ctx.getContext('2d'))
  // }, [ctx])

  // useEffect(() => {
  //   console.log(ctx)
  //   console.log(x)
  // }, [ctx, x])

  for (let i = 0; i < labelsLeft.length; i++) {
    if (i < props.selectedPurchases) pointColorsLeft.push(pink)
    else pointColorsLeft.push(black)
  }

  for (let i = 0; i < labelsRight.length; i++) {
    if (i < props.selectedSales) pointColorsRight.push(yellow)
    else pointColorsRight.push(black)
  }

  const pointColors = pointColorsLeft.reverse().concat(pointColorsRight)

  const data = {
    labels: chartLabels,
    datasets: [
      {
        id: 1,
        fill: true,
        label: 'price',
        data: pricePoints,
        borderColor: cyan,
        backgroundColor: purple,
        pointBorderColor: chartLabels.map((_, index) => (pricePoints[index] > 0 ? blue : red)),
        pointBackgroundColor: chartLabels.map((_, index) => pointColors[index]),
      },
    ],
  }

  return (
    <div className="w-full h-[14rem] p-3">
      <Line
        id="canvas"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(142, 220, 220, 0.2) ${gradientMidpoint}%, rgba(219, 112, 147, 0.2) 0%)`,
        }}
        options={options}
        data={data}
        datasetIdKey="id"
      />
    </div>
  )
}
