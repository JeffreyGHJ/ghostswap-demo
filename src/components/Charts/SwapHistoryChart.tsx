import React, { useEffect, useState } from 'react'
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import Web3 from 'web3'

const cyan = 'rgba(0, 190, 255, .4)'
const blue = 'rgba(0, 136, 255, .9)'
const purple = 'rgba(140, 0, 194, .3)'
const pink = 'rgba(200, 0, 200, .4)'
const yellow = 'rgba(255, 187, 0, .7)'
const black = 'rgba(0, 0, 0, .8)'
const red = 'rgba(255, 0, 0, .8)'

const lengthDayInMillis = 1000 * 60 * 60 * 24

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

export const options = (min, max, numDays) => {
  return {
    clip: false as const,
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 100,
    },
    scales: {
      x: {
        type: 'linear' as const,
        ticks: {
          source: 'auto',
          display: true,
          count: Math.max(numDays, 2),
          callback: function (value, index, ticks) {
            return new Date(value).toDateString().slice(4).slice(0, -4)
          },
        },
        min: min,
        max: max,
      },
    },
    elements: {
      point: {
        radius: 8,
        pointBorderWidth: 1,
      },
      line: {
        tension: 0.2,
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
      tooltip: {
        callbacks: {
          title: function (context) {
            if (context !== null) {
              // hover over point on chart to make this print out
              // console.log(context)
              if (context[0].label !== undefined) {
                // console.log(context[0].label)
                let date = new Date(+context[0].label.replace(/,/g, ''))
                let day = date.toDateString().slice(4).split(' ').join(', ')
                let time = date.toLocaleTimeString()
                return day + ', ' + time
              }
            }
          },
          label: function (context) {
            if (context?.raw?.z) return context.raw.z
          },
        },
      },
    },
  }
}

export function SwapHistoryChart({ swaps }) {
  const [points, setPoints] = useState([])
  const [numDays, setNumDays] = useState(0)
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)

  useEffect(() => {
    if (!swaps) return
    let points = []
    let minTime = +swaps[0]?.timestamp * 1000
    let maxTime = minTime
    let prevY = null
    for (let swap of [...swaps].sort((a, b) => +a.timestamp - +b.timestamp)) {
      let x = new Date(+swap.timestamp * 1000)
      let y = null
      let z = null
      if (swap.eventType === 'SWAP_NFT_IN_POOL' || swap.eventType === 'SWAP_NFT_OUT_POOL') {
        y = (+Web3.utils.fromWei(swap.data.amountT)).toFixed(3)
        prevY = y
      } else {
        y = prevY || 0
        if (swap.eventType === 'NEW_POOL') z = 'Pool Created'
        else if (swap.eventType === 'NFT_DEPOSIT') z = 'NFT Deposit'
        else if (swap.eventType === 'NFT_WITHDRAWAL') z = 'NFT Withdraw'
        else if (swap.eventType === 'TOKEN_DEPOSIT') z = 'Token Deposit'
        else if (swap.eventType === 'TOKEN_WITHDRAWAL') z = 'Token Withdraw'
        else if (swap.eventType === 'SPOT_PRICE_UPDATE') z = 'Price Update'
        else if (swap.eventType === 'DELTA_UPDATE') z = 'Delta Update'
        else if (swap.eventType === 'FEE_UPDATE') z = 'Fee Update'
      }
      points.push({ x, y, z })
      // console.log(points)
      minTime = Math.min(minTime, +swap.timestamp * 1000)
      maxTime = Math.max(maxTime, +swap.timestamp * 1000)
    }
    if (maxTime === minTime) maxTime = Date.now()
    setMax(maxTime)
    setMin(minTime)
    setPoints(points)
  }, [swaps])

  useEffect(() => {
    let timeIntervalInMillis = max - min
    setNumDays(Math.ceil(timeIntervalInMillis / lengthDayInMillis))
  }, [min, max])

  const data = {
    datasets: [
      {
        id: 1,
        fill: true,
        label: 'Price',
        data: points,
        borderColor: cyan,
        backgroundColor: purple,
        pointBorderColor: blue,
        pointBackgroundColor: points.map((point) => (point.z ? 'white' : yellow)),
        pointStyle: points.map((point) => (point.z ? 'rectRot' : 'circle')),
      },
    ],
  }

  return (
    <div className="w-full h-full p-3">
      <Line options={options(min, max, numDays)} data={data} datasetIdKey="id" />
    </div>
  )
}
