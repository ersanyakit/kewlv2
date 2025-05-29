import React from 'react';
import { motion } from 'framer-motion';
import { useAppKitAccount } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';

const TestPage = () => {
    // Token context'inden verileri al


    var levelInfo= {"index":"5","price":"500000000","baseLiquidity":3,"quoteLiquidity":"0","orderCount":"0","exists":true,"totalAmount":"900000000","totalPrice":"4500000000","amount":"900000000","baseTotalPrice":"0","quoteTotalPrice":"0","head":"0","tail":"0","tick":"0","nextTick":"0","prevTick":"0","sequence":"0"}
    
    var orders = [
      {"id":"6","sequence":"5","price":"500000000","amount":8,"total":"0","filled":"0","remaining":8,"trader":"0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65","entrypoint":0,"kind":3,"status":2,"createdAt":"1748414391","updatedAt":"0","cancelledAt":"0","filledAt":"0"},
      {"id":"5","sequence":"5","price":"500000000","amount":2,"total":"0","filled":"0","remaining":2,"trader":"0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65","entrypoint":0,"kind":3,"status":2,"createdAt":"1748414355","updatedAt":"0","cancelledAt":"0","filledAt":"0"}
    ]

    const calculate = () => {
      
 
      const liquidity = levelInfo.baseLiquidity

      orders.forEach(order => {

        var amount = order.amount; 
        var remaining = order.remaining;

        var filled = (remaining ) / liquidity;

        console.log("order:",order.remaining,"filled:",filled);



       
      
        
        
        
      })


    }

    

  return (
    <div className={"w-full h-full min-h-[73dvh] mx-auto flex items-center justify-center p-8"}>
        <button onClick={calculate}>Calculate</button>
    </div>
  );
};

export default TestPage; 