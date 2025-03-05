"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaRedo } from "react-icons/fa";
import clsx from "clsx";
import { Tables } from "@/database.types";
import fetcher from "@/utils/swr/fetcher";
import useSWR from 'swr'
import { differenceInHours, endOfDay, fromUnixTime, startOfDay } from "date-fns";
import { CircleHelp, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, Haze, Snowflake, Sun } from "lucide-react";

interface DailyForecastResponse {
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
  };
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    sunrise: number;
    sunset: number;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feels_like: {
      day: number;
      night: number;
      eve: number;
      morn: number;
    };
    pressure: number;
    humidity: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    speed: number;
    deg: number;
    gust: number;
    clouds: number;
    pop: number;
    rain?: number;
    snow?: number;
  }>;
}


export default function CompetitionEventWeather(
  { track, competitionEvent }:
  {
    track: Tables<'Tracks'>,
    competitionEvent: Tables<'CompetitionEvents'> & {
      Competitions: Tables<'Competitions'>,
      Events: Tables<'Events'> | null,
      Tracks: Tables<'Tracks'>
    }
  }
) {
  if (!competitionEvent.Events) return;
  const now = new Date();
  const startOfEvent = new Date(competitionEvent.Events.startsAt);
  const endOfEvent = new Date(competitionEvent.Events.endsAt);

  if (now > endOfEvent) return;

  if (Math.trunc(differenceInHours(now, startOfEvent)/24)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
          <CardDescription>Forecast will be available when event is less than 5 days away.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Forecast</CardTitle>
        <CardDescription>Forecasting is currently under development and is not available.</CardDescription>
      </CardHeader>
    </Card>
  )

  // const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  // const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${track.lat}&lon=${track.long}&units=metric&appid=${apiKey}`;
  // const { data, error, isLoading } = useSWR<DailyForecastResponse>(url, fetcher)
  //
  // let cardContent = undefined;
  //
  // if (error || !data) {
  //   cardContent = <span>Error loading weather data.</span>
  // } else {
  //   const startOfEventDay = startOfDay(startOfEvent);
  //   const endOfEventDay = endOfDay(endOfEvent);
  //
  //   // find forecast for date of event in response
  //   const relevantForecasts = data.list.filter((f) => {
  //     const fcDate = fromUnixTime(f.dt);
  //
  //     return (startOfEvent <= fcDate && fcDate <= endOfEvent)
  //   })
  //   console.log("relevantForecasts", relevantForecasts)
  //
  //   cardContent = relevantForecasts.map((f) => (
  //     <>
  //       <div>
  //         {(() => {
  //           switch (f.weather[0]?.main) {
  //             case "Thunderstorm":
  //               return <CloudLightning />;
  //             case "Snow":
  //               return <Snowflake />;
  //             case "Haze":
  //               return <Haze />;
  //             case "Fog":
  //               return <CloudFog />;
  //             case "Drizzle":
  //               return <CloudDrizzle />;
  //             case "Clouds":
  //               return <Cloud />;
  //             case "Rain":
  //               return <CloudRain />;
  //             case "Clear":
  //               return <Sun />;
  //             default:
  //               return <CircleHelp />;
  //           }
  //         })()}
  //         <strong>{f.temp.day}°</strong>
  //       </div>
  //       <div>
  //         <span>Cloud Cover: {f.clouds}%</span>
  //         <span>Humidity: {f.humidity}</span>
  //         <span>High: {f.temp.max}°</span>
  //         <span>Low: {f.temp.min}°</span>
  //       </div>
  //     </>
  //   ));
  // }
  //
  // return (
  //   <Card>
  //     <CardHeader className={"flex flex-row gap-2 items-center justify-between"}>
  //       <CardTitle>Weather Forecast</CardTitle>
  //       <Button
  //         variant={"outline"}
  //         disabled={isLoading || (!track.lat || !track.long)}
  //       >
  //         <FaRedo className={clsx({ "animate-spin": isLoading })} />
  //       </Button>
  //     </CardHeader>
  //     {
  //       (track.lat || track.long) && data && (
  //         <CardContent>
  //           {cardContent}
  //         </CardContent>
  //       )
  //     }
  //   </Card>
  // )
}