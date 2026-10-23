'use client';

import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight, BatteryFull, Bell, Bug, Check, CheckCheck, ChevronRight, Circle, Home, Leaf, MoreHorizontal, Pause, Play, RotateCcw, Settings2, ShieldCheck, Signal, Sparkles, Wifi} from 'lucide-react';

const scenes=[
 {name:'Explore the app',label:'01 / EXPLORE',title:'Every feature. A fresh perspective.',copy:'A tester works through the app’s everyday flows.',notice:'Testing the everyday details',detail:'Onboarding → habits → reminders',icon:Sparkles},
 {name:'Spot the friction',label:'02 / DISCOVER',title:'Small friction. Useful feedback.',copy:'A reminder setting fails to save. The tester records it.',notice:'One detail worth a closer look',detail:'Reminder setting does not persist',icon:Bug},
 {name:'Verify the fix',label:'03 / RETEST',title:'Fix it. Try it. Be sure.',copy:'The updated reminder is tested again after the fix.',notice:'Retested with a fresh build',detail:'Reminder preference now saves',icon:CheckCheck},
 {name:'Review the learnings',label:'04 / REVIEW',title:'A better picture of launch readiness.',copy:'Feedback and retest results come together in a summary.',notice:'Useful learnings, all together',detail:'Feedback → improvements → summary',icon:ShieldCheck}
];

export default function TestingAnimation(){
 const [phase,setPhase]=useState(0),[playing,setPlaying]=useState(false),[reduced,setReduced]=useState(true),[visible,setVisible]=useState(false),[foreground,setForeground]=useState(true),[restart,setRestart]=useState(0);
 const container=useRef<HTMLDivElement>(null);
 useEffect(()=>{
   const motion=matchMedia('(prefers-reduced-motion: reduce)');
   const sync=()=>{setReduced(motion.matches);setPlaying(!motion.matches)};sync();motion.addEventListener('change',sync);
   const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.12});if(container.current)observer.observe(container.current);
   const visibility=()=>setForeground(!document.hidden);visibility();document.addEventListener('visibilitychange',visibility);
   return()=>{motion.removeEventListener('change',sync);observer.disconnect();document.removeEventListener('visibilitychange',visibility)};
 },[]);
 const active=playing&&!reduced&&visible&&foreground;
 useEffect(()=>{if(!active)return;const timer=setInterval(()=>setPhase(p=>(p+1)%scenes.length),4200);return()=>clearInterval(timer)},[active,restart]);
 const scene=scenes[phase],Icon=scene.icon;
 function select(index:number){setPhase(index);setPlaying(false)}
 return <div ref={container} className="testing-stage" data-phase={phase} data-playing={active}>
   <div className="stage-ambient" aria-hidden="true"><i/><i/><i/></div>
   <div className="stage-topline"><span><i/> THE TESTING EXPERIENCE</span><span className="simulation-label">ILLUSTRATIVE DEMO</span></div>
   <div className="device-scene" aria-hidden="true">
     <div className="device-orbit orbit-a"/><div className="device-orbit orbit-b"/>
     <div className="device-pedestal"/>
     <div className="phone-float"><div className="phone-body">
       <div className="phone-side side-one"/><div className="phone-side side-two"/>
       <div className="phone-screen"><div className="phone-camera"/>
         <div className="phone-status"><b>9:41</b><span><Signal size={10}/><Wifi size={11}/><BatteryFull size={14}/></span></div>
         <div className="phone-content">
           <div className="phone-appbar"><span><Leaf size={13}/> habit garden<span className="app-dot">.</span></span><span className="phone-profile">A</span></div>
           <div className="phone-greeting"><small>MAKE A LITTLE ROOM TO GROW</small><h3>A good day<br/>starts small.</h3></div>
           <div className="garden-panel"><div className="garden-copy"><span>YOUR DAILY GROWTH</span><b>{phase>1?'3':'2'}<small>/ 3 habits</small></b><div className="growth-track"><i style={{width:phase>1?'100%':'66%'}}/></div><small>{phase>1?'Look at you growing.':'A little progress, every day.'}</small></div>
             <svg className="garden-flower" width="76" height="110" viewBox="0 0 76 110" fill="none"><path d="M38 102V38" stroke="#5a7953" strokeWidth="3" strokeLinecap="round"/><path d="M37 83C15 86 8 67 10 59c18-1 28 8 27 24Z" fill="#92af7b"/><path d="M39 69c20 1 28-15 27-24-17-1-27 8-27 24Z" fill="#658b5d"/><g className="flower-head"><ellipse cx="38" cy="23" rx="12" ry="21" fill="#bca4e0"/><ellipse cx="38" cy="23" rx="12" ry="21" transform="rotate(60 38 30)" fill="#c7b2e8"/><ellipse cx="38" cy="23" rx="12" ry="21" transform="rotate(120 38 30)" fill="#b69ada"/><circle cx="38" cy="30" r="10" fill="#f7e9ae"/></g><ellipse cx="38" cy="104" rx="25" ry="3" fill="#7c9361" fillOpacity=".16"/></svg>
           </div>
           <div className="habits-heading"><b>Today's little wins</b><MoreHorizontal size={15}/></div>
           <div className="phone-habit"><span className="habit-emoji">☀</span><span><b>A moment outside</b><small>10 minutes · Mindful living</small></span><span className="habit-check"><Check size={12}/></span></div>
           <div className="phone-habit"><span className="habit-emoji water">◒</span><span><b>Stay hydrated</b><small>8 glasses · Feeling good</small></span><span className="habit-check"><Check size={12}/></span></div>
           <div className={'phone-habit reminder-habit '+(phase===1?'issue':'')}><span className="habit-emoji reminder"><Bell size={13}/></span><span><b>Evening wind-down</b><small>{phase===1?'Reminder not saved':phase>1?'Reminder saved · 9:30 PM':'Add a gentle reminder'}</small></span><span className={'habit-check '+(phase<2?'unchecked':'')}>{phase>1?<Check size={12}/>:<ChevronRight size={12}/>}</span></div>
           <div className="phone-toast" key={phase}>{phase===1?<Bug size={12}/>:phase>1?<CheckCheck size={12}/>:<Sparkles size={12}/>}<span>{phase===1?'A detail to improve':phase===2?'Reminder saved successfully':phase===3?'A little better than yesterday':'Small habits. Real progress.'}</span></div>
           <div className="phone-week"><div><span>A LITTLE EVERY DAY</span><b>{phase>1?'5':'4'}-day streak <span>✦</span></b></div><div className="week-days">{['M','T','W','T','F','S','S'].map((d,i)=><span key={i}><i className={i<(phase>1?5:4)?'done':''}>{i<(phase>1?5:4)?<Check size={8}/>:<span/>}</i><small>{d}</small></span>)}</div></div>
         </div>
         <div className="phone-nav"><span className="selected"><Home size={15}/><small>Today</small></span><span><Circle size={15}/><small>Progress</small></span><span><Settings2 size={15}/><small>Settings</small></span></div>
         <div className="phone-homebar"/>
         <div className="touch-cursor"><div className="touch-ripple"/><div className="touch-center"/></div>
       </div>
     </div></div>
     <div className="enrollment-float"><div className="float-card-heading"><span className="float-icon"><ShieldCheck size={15}/></span><span>THE CLOSED-TEST GROUP</span></div><div className="enrollment-count">12<span>real testers</span></div><div className="mini-faces">{['JD','AM','SK','RL'].map((s,i)=><i key={s} className={'face-'+i}>{s}</i>)}<i>+8</i></div><div className="enrollment-line"><span/>One coordinated test.</div></div>
     <div className="testing-notice" key={phase}><span className={'notice-icon notice-'+phase}><Icon size={18}/></span><div><b>{scene.notice}</b><span>{scene.detail}</span></div><span className="notice-spark">✳</span></div>
     <div className="session-chip"><span className="session-dot"/>14-day testing journey <ArrowUpRight size={12}/></div>
   </div>
   <div className="stage-bottom"><div className="scene-description"><span className="scene-step">{scene.label}</span><p>{scene.title}</p></div><div className="playback-controls"><button type="button" aria-label={reduced?'Next testing scene':playing?'Pause testing animation':'Play testing animation'} onClick={()=>{if(reduced){setPhase((phase+1)%scenes.length)}else setPlaying(!playing)}} title={reduced?'Next testing scene':playing?'Pause animation':'Play animation'}>{playing&&!reduced?<Pause size={13}/>:<Play size={13}/>}</button><button type="button" aria-label="Replay testing animation" title="Replay" onClick={()=>{setPhase(0);setRestart(r=>r+1);if(!reduced)setPlaying(true)}}><RotateCcw size={13}/></button></div></div>
   <div className="scene-controls" aria-label="Choose a testing scene">{scenes.map((s,i)=><button key={s.name} type="button" aria-pressed={phase===i} aria-label={s.name} onClick={()=>select(i)}><span className="scene-progress" key={restart+'-'+phase+'-'+i}/><span>{String(i+1).padStart(2,'0')}</span></button>)}</div>
   <p className="sr-only">Example testing simulation: {scene.copy} No real app activity is being tracked.</p>
 </div>
}
