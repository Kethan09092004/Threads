import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/provider';

import { extendTheme } from '@chakra-ui/theme-utils'
import { ColorModeScript } from '@chakra-ui/color-mode'
import { mode } from '@chakra-ui/theme-tools'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil';
import { Toaster } from "react-hot-toast"
import { SocketContextProvider } from './context/SocketContext.jsx';
const styles={
  global:(props)=>({
    body:{
      color:mode('gray.800','withAlpha.900')(props),
      bg:mode('gray:100',"#1D123D ")(props),
    }
  })
};
const config={
  initialColorMode:"dark",
  useSystemColorMode:true
};
const colors={
  
  gray:{
    light:"#616161",
    dark:"#212121"
  },
  primary:"#007bff"

}
const theme=extendTheme({config,styles,colors})
createRoot(document.getElementById('root')).render(
  
    <RecoilRoot>
     
    <BrowserRouter>
    <ChakraProvider theme={theme}>
     
      <ColorModeScript initialColorMode={theme.config.initalColorMode}/>
      <SocketContextProvider>
      <App />
      </SocketContextProvider>
      
      
     
    </ChakraProvider>
    </BrowserRouter>
    
    </RecoilRoot>
   
    
 
)
