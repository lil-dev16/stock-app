import React, { useContext, useEffect, useState } from 'react'
import finnhub from '../apis/finnhub'
import {IoMdArrowDropup} from 'react-icons/io'
import {IoMdArrowDropdown} from 'react-icons/io'
import { WatchListContext } from '../context/watchListContext'
import { useNavigate } from 'react-router-dom'

const StockList = () => {
    const [stocks, setstocks] = useState([])
    const {watchedStock, deleteItem} = useContext(WatchListContext)

    const getColor = (change) => {
         return change > 0 ? '#00FF00' : '#FF0000'
    }
    const getIcon = (change) => {
        return change > 0 ? <IoMdArrowDropup />  : <IoMdArrowDropdown />
    }

    
    const navigate = useNavigate()
    const handleStockSelect =(sym) => {
      navigate(`detail/${sym}`)
    }
    useEffect(() =>{
      let isMounted = true;

        const fetchFinn = async () => {
            try {
               const respo = await Promise.all(
                watchedStock.map((stocks) => {
                  return finnhub.get('/quote', {
                    params: {
                      symbol: stocks
                    }
                   })
                })
               )
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
        
    }, [watchedStock])
  return (
    <div className='mx-auto w-fit'>
       <table className='w-[100%]'>
        <thead className=''>
          <tr>
            <th className='h-[70px]'>Name</th>
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
            return <tr className='h-[50px] cursor-pointer border trr' onClick={()=>handleStockSelect(stock.symbol)} key={stock.symbol}>
              <td className=' w-[70px]'>{stock.symbol}</td>
              <td className=' w-[70px]'>{stock.data.c}</td>
              <td className=' w-[70px]'><p className={`text-[${getColor(stock.data.d)}] flex items-center`} >{stock.data.d}{getIcon(stock.data.d)}</p></td>
              <td className=' w-[70px]'><p className={`text-[${getColor(stock.data.d)}] flex items-center`}>{stock.data.dp}{getIcon(stock.data.d)}</p></td>
              <td className=' w-[70px]'>{stock.data.h}</td>
              <td className=' w-[70px]'>{stock.data.l}</td>
              <td className=' w-[70px]'>{stock.data.o}</td>
              <td className='flex items-center h-[50px] w-[120px] justify-between'><p>{stock.data.pc}</p><button onClick={(e)=>{
                e.stopPropagation()
                deleteItem(stock.symbol)
              }} className="p-1 bg-[red] text-white rounded-lg hidden del-btn">Delete</button></td>
            </tr>
          })}
        </tbody>
        </table> 

        <i>Built by <a href="https://segunojo.netlify.app" className='text-[blue]'>Segun Ojo</a></i>
    </div>
  )
}

export default StockList