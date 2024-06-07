import axios from 'axios';
import { SearchType } from '../types';
import { string , object , number , InferInput , parse } from 'valibot'
import { useMemo, useState } from 'react';
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
export type Weather = InferInput< typeof WeatherSchema >

const initialState = { 
    name: '',
    main: { 
        temp: 0,
        temp_max: 0,
        temp_min: 0
    }
}
export default function useWeather(){
    const [ weather , setWeather ] = useState<Weather>(initialState)
    const [ loading , setLoading ] = useState( false )
    const [ notFound , setNotFound ] = useState( false )
    const fetchWeather = async( search: SearchType ) => { 
        const appId = import.meta.env.VITE_API_KEY;
        setLoading( true )
        setWeather( initialState )
        try {
            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${ search.country}&appid=${appId}`;
            console.log('Consultando....')
            const { data } = await axios.get( geoUrl )
            if( !data ){ 
                setNotFound( true )
                return
            }
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
                setWeather( result )
            }

            
        } catch (error) {
            console.log( error )
        } finally { 
            setLoading( false )
        }
    }

    const hasDataWeather = useMemo( ( ) =>  weather.name , [ weather ])
    return { 
        weather,
        fetchWeather,
        hasDataWeather,
        loading, 
        notFound
    }
}