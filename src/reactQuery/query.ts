import {
  QueryClient, 
} from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus:false,
      retry:(failCount,error:any)=>{
        if(error?.response?.status===401){
          return false;
        } 
        return failCount<2;
      }
    }
  }
})
export default queryClient;






     