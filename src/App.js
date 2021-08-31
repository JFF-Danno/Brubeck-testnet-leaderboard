import logo from './logo.svg';
import './App.css';
import React, { useState , useEffect } from "react";
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

function App() {

   const [results,          setResults       ] = useState('')
   const [rewardPool,       setRewardPool    ] = useState('')
   const [claimStats,       setClaimStats    ] = useState('')
   const [chartData,        setChartData     ] = useState([])
   const [chart,            setChart         ] = useState([]);

    useEffect( async () => {
        if ( chart.length === 0 ) {
          await getStatsData(); 
          await getFeed();       }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart])

    const getStatsData = async () => {

         const stats = await axios( 'https://testnet1.streamr.network:3013/stats' );    
     //    setClaimStats( stats.data.lastRewards.map((row,index) => <li className='myItem' key={index}><Paper className="stats"><h4>{row.code}</h4><h4>size: {row.topologySize}</h4><h4>claims: {row.receivedClaims}</h4><h4>delay: {row.meanPropagationDelay}</h4></Paper></li> ));
         const data = stats.data.lastRewards.reverse();
         setChart( data );
    }

    const getFeed = async () => {
        try {
         const res = await axios( 'https://testnet1.streamr.network:3013/leaderboard'  );    
         setResults( res.data.map((row,index) => <li key={index}><div className='nodeAddress' ><div className='address' >{row.nodeAddress}</div><div className='count' >{row.count}</div></div></li> ));

         const rewardpool = await axios( 'https://testnet1.streamr.network:3013/rewardpool'  );    
         setRewardPool( <div className='rewardpool'><h2>Pool size </h2> {rewardpool.data.poolSize} <br/><br/><h2>Most Nodes Seen</h2> {rewardpool.data.mostNodesSeen}</div> );
    }
    catch(e){console.log(e);}
}
  return (
    <div className="App">
       {( chart.length > 0 && ( <LineChart width={800} height={300} data={chart}>
        <Line type="monotone" dataKey="topologySize" stroke="#0000ff" />
        <Line type="monotone" dataKey="receivedClaims" stroke="#ff0000" />
        <CartesianGrid stroke="#ccc" />
 <Tooltip />
  <Legend />
        <XAxis />
        <YAxis />
      </LineChart> ) )}

        {( chart.length > 0 && ( <LineChart width={800} height={300} data={chart}>
        <Line type="monotone" dataKey="meanPropagationDelay" stroke="#000022" />
        <CartesianGrid stroke="#ccc" />
 <Tooltip />
  <Legend />
        <XAxis />
        <YAxis  />
      </LineChart> ) )}


<hr/>
    <div className='leaderboard' >
    <div className='outerleaderboard' >
    <h1>Leader Board</h1>
    <ul>
      <li><div className='nodeAddress' >Address<div className='count' > Count</div></div></li>
      {results}
    </ul>
    </div><div className='outerpool' ><h1>Reward Pool</h1>
    {rewardPool}</div>
    </div></div>
  );
}

export default App;
