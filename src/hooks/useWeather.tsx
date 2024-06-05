import axios from 'axios';
import { SearchType } from '../types';
import { string , object , number , InferInput , parse } from 'valibot'
// import { z } from 'zod'

// Zod
// const Weather = z.object({
//     name: z.string(),
//     main: z.object({ 
//         temp: z.number(),
//         temp_max: z.number(),
//         temp_min: z.number()
//     })
// })
// type Weather = z.infer< typeof Weather >

//Valibot

const WeatherSchema = object({
    name: string(),
    main: object({ 
        temp: number(),
        temp_max: number(),
        temp_min: number()
    })
})
type Weather = InferInput< typeof WeatherSchema >

export default function useWeather(){
    
    const fetchWeather = async( search: SearchType ) => { 
        const appId = import.meta.env.VITE_API_KEY;
        try {
            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${ search.country}&appid=${appId}`;
            console.log('Consultando....')
            const { data } = await axios.get( geoUrl )
            const lat = data[0].lat;
            const lon = data[0].lon;
            const wheatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`
            const { data: weatherResult } = await axios.get( wheatherUrl );
            //ZOD
            // const result = Weather.safeParse( weatherResult )
            // if( result.success ){
            //     console.log( result.data.name )
            //     console.log( result.data.main.temp )
            // }
            //Valibot
            const result = parse( WeatherSchema,  weatherResult );
            console.log( result )
            if( result ){
                console.log( result.name )
            }

            
        } catch (error) {
            console.log( error )
        }
    }
    return { 
        fetchWeather
    }
}