import axios from 'axios';


export const getFetcher=async (url:string)=>{
    if(url){
        const res=await axios.get(url);
        return  res.data;
    }

};
