import React, { useEffect, useState } from 'react'
import finnhub from '../apis/finnhub'

const StockList = () => {
    const [stocks, setstocks] = useState([])
    const [watchedStocks, setWatchedStocks] = useState(['GOOGL', 'MSFT', 'AMZN'])

    const getColor = (change) => {
         if(change > 0) {
          return 'green'
         }else{
          return 'red'
         }
    }
    useEffect(() =>{
      let isMounted = true;

        const fetchFinn = async () => {
            try {
               const respo = await Promise.all(
                watchedStocks.map((stocks) => {
                  return finnhub.get('/quote', {
                    params: {
                      symbol: stocks
                    }
                   })
                })
               )
                console.log(respo);
               const data = respo.map((dat) => {
                return {
                  data: dat.data,
                  symbol: dat.config.params.symbol
                }
              })
              console.log(data);
               if(isMounted) {
                 setstocks(data);
               }
            } catch (error) {
                console.log(error);
            }
        }
        fetchFinn()
        return () => (isMounted = false)
        
    }, [])
  return (
    <div>
       <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last</th>
            <th>Chg</th>
            <th>Chg%</th>
            <th>High</th>
            <th>Low</th>
            <th>Open</th>
            <th>Pclose</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            return <tr>
              <td>{stock.symbol}</td>
              <td>{stock.data.c}</td>
              <td className={`text-[${getColor(stock.data)}]`}>{stock.data.d}</td>
              <td>{stock.data.dp}</td>
              <td>{stock.data.h}</td>
              <td>{stock.data.l}</td>
              <td>{stock.data.o}</td>
              <td>{stock.data.pc}</td>
            </tr>
          })}
        </tbody>
        </table> 
    </div>
  )
}

export default StockList