'use client'
import {useEffect,useState} from 'react'
import {Clock3,MapPin} from 'lucide-react'

type Geo={city:string;region:string;country:string;timezone:string}
function clock(tz:string){
  try{return new Intl.DateTimeFormat('pt-BR',{timeZone:tz,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())}
  catch{return new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())}
}
export function VisitorLocalClock(){
 const [geo,setGeo]=useState<Geo|null>(null)
 const [time,setTime]=useState('--:--')
 const [browserTz,setBrowserTz]=useState('UTC')
 useEffect(()=>{
   const localTz=Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
   setBrowserTz(localTz)
   let active=true
   const controller=new AbortController()
   const timeout=window.setTimeout(()=>controller.abort(),5000)
   try{
     const value=sessionStorage.getItem('b3-visitor-clock')
     if(value){const cached=JSON.parse(value) as Geo;if(cached.city&&cached.timezone){setGeo(cached);return}}
   }catch{}
   fetch('https://ipapi.co/json/',{signal:controller.signal,cache:'no-store'})
    .then(r=>{if(!r.ok)throw Error('region unavailable');return r.json()})
    .then(data=>{
      if(!active||data.error||typeof data.city!=='string')return
      const place:Geo={city:data.city.slice(0,55),region:String(data.region_code||'').slice(0,12),country:String(data.country_code||'').slice(0,5),timezone:String(data.timezone||localTz).slice(0,100)}
      try{clock(place.timezone)}catch{place.timezone=localTz}
      setGeo(place)
      try{sessionStorage.setItem('b3-visitor-clock',JSON.stringify(place))}catch{}
    }).catch(()=>{}).finally(()=>window.clearTimeout(timeout))
   return()=>{active=false;controller.abort();window.clearTimeout(timeout)}
 },[])
 useEffect(()=>{
   const tick=()=>setTime(clock(geo?.timezone||browserTz))
   tick()
   const timer=window.setInterval(tick,15000)
   return()=>window.clearInterval(timer)
 },[geo?.timezone,browserTz])
 return <span className="b3-footer-location-badge b3-visitor-place" title="Localização aproximada por IP; o horário considera o fuso detectado.">
   <MapPin size={14} aria-hidden="true"/>
   <span>{geo?`${geo.city.toLocaleUpperCase('pt-BR')}${geo.region?' · '+geo.region:''}`:'LOCALIZAÇÃO APROXIMADA INDISPONÍVEL'}</span>
   <span className="b3-visitor-clock-separator">·</span>
   <Clock3 size={13} aria-hidden="true"/>
   <time suppressHydrationWarning>{time}</time>
 </span>
}
