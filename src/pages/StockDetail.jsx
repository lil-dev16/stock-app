import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import finnhub from '../apis/finnhub'
import Charts from '../components/Charts'
import StockCompany from '../components/StockCompany'


const formatData = (data) => {
      return data.t.map((elem, index) => {
         return {
          x: elem * 1000,
          y: data.c[index]
         }
     })
}
const StockDetail = () => {
  const { symbol } = useParams();
  const [chartData, setChartData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const currentTime = Math.floor(new Date().getTime() / 1000)
      let oneDayAgo;
      if(new Date().getDay() == 6) {
        oneDayAgo = currentTime - 3600* 24 * 2
      }else if(new Date().getDay() == 0){
        oneDayAgo = currentTime - 3600 * 24 * 3
      }else{
        oneDayAgo = currentTime - 3600 * 24
      }
      const oneWeekAgo = currentTime - 3600* 24 * 7
      const oneYearAgo = currentTime - 3600* 24 * 365
      try {
        const res = await Promise.all([finnhub.get('/stock/candle', {
           params: {
             symbol,
             from: oneDayAgo,
             to: currentTime,
             resolution: 30
           }
          }),
          finnhub.get('/stock/candle', {
           params: {
             symbol,
             from: oneWeekAgo,
             to: currentTime,
             resolution: 60
           }
          }),
          finnhub.get('/stock/candle', {
           params: {
             symbol,
             from: oneYearAgo,
             to: currentTime,
             resolution: 'W'
           }
          })
        ])
        setChartData({
            day: formatData(res[0].data),
            week : formatData(res[1].data),
            year: formatData(res[2].data)
          })

        
      } catch (error) {
        console.log(error);
      }
    }
    fetchData()
  }, [symbol])
  
  console.log(chartData);
  return <div>
        {chartData && (
          <div>
            <Charts chartData={chartData} symbol={symbol}/>
            <div>
              <StockCompany symbol={symbol}/>
            </div>
          </div>
      ) }
      </div>
}
export default StockDetail