'use client';
import {useEffect} from 'react';
export default function MotionEnhancements(){useEffect(()=>{
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const elements=Array.from(document.querySelectorAll<HTMLElement>('.section,.benefits-section,.final-cta,.facts-strip'));
 let observer:IntersectionObserver|undefined;
 function setup(){observer?.disconnect();for(const el of elements)el.removeAttribute('data-reveal');if(preference.matches||!('IntersectionObserver' in window))return;
 observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){(entry.target as HTMLElement).dataset.reveal='visible';observer?.unobserve(entry.target)}},{threshold:.08,rootMargin:'0px 0px -25px 0px'});
 for(const el of elements){if(el.getBoundingClientRect().top>innerHeight){el.dataset.reveal='pending';observer.observe(el)}}
 }
 setup();preference.addEventListener('change',setup);return()=>{observer?.disconnect();preference.removeEventListener('change',setup);for(const el of elements)el.removeAttribute('data-reveal')};
 },[]);return null}
