'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, Bug, CheckCircle2, Smartphone, Users} from 'lucide-react';

const steps = [
  {title: 'Share your test', label: 'POST', Icon: Smartphone, copy: 'Add your closed-testing link and tell volunteers which flows to try.', screen: 'Testing link added'},
  {title: 'Meet your testers', label: 'INVITE', Icon: Users, copy: 'Approve requests and add those testers in Google Play Console.', screen: 'Volunteers ready to join'},
  {title: 'Put feedback to work', label: 'IMPROVE', Icon: Bug, copy: 'See where testers get stuck, fix the issue, and ask them to try the new build.', screen: 'Usability · Keyboard hides Save'},
  {title: 'Prepare for production', label: 'APPLY', Icon: ArrowUpRight, copy: 'Summarize what you learned and apply for production access when eligible.', screen: 'Testing summary ready'},
];

function DemoScreen({index}: {index: number}) {
  const {Icon, screen} = steps[index];
  return <div className="journey-phone">
    <span className="eyebrow">HABIT GARDEN · DEMO</span>
    <Icon size={38} aria-hidden="true"/>
    <strong>{screen}</strong>
  </div>;
}

export function TestingStory() {
  const story = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const cards = story.current?.querySelectorAll('article');
    if (!cards || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) setActive(Array.from(cards).indexOf(visible.target as HTMLElement));
    }, {rootMargin: '-32% 0px -42% 0px'});
    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);
  return <section id="how-it-works" className="section wrap">
    <div className="eyebrow">HOW IT WORKS</div><h2>From first link to fresh build.</h2>
    <div className="testing-story" ref={story}>
      <div className="story-display" aria-hidden="true"><DemoScreen index={active}/></div>
      <div className="story-cards">{steps.map(({title,label,copy}, index) =>
        <article key={label} className="panel" data-active={index === active}>
          <div className="story-mobile" aria-hidden="true"><DemoScreen index={index}/></div>
          <div className="eyebrow">{String(index + 1).padStart(2,'0')} / {label}</div>
          <h3>{title}</h3><p>{copy}</p>
        </article>)}</div>
    </div>
  </section>;
}

export function TestingTimeline() {
  const [day, setDay] = useState(1);
  return <section className="section wrap">
    <div className="panel timeline-panel">
      <div className="eyebrow">THE 14-DAY JOURNEY · PREVIEW</div>
      <h2>One day at a time.</h2>
      <div className="journey-dots" aria-hidden="true">{Array.from({length:14}, (_, index) =>
        <span key={index} data-filled={index < day}/>)}</div>
      <label htmlFor="journey-day">Explore the timeline <strong>· Day {day}</strong></label>
      <input id="journey-day" type="range" min={1} max={14} value={day}
        aria-valuetext={'Day ' + day} onChange={event => setDay(event.currentTarget.valueAsNumber)}/>
      <div className="journey-labels"><span>Day 1 · Start</span><span>Day 7 · Check feedback</span><span>Day 14 · Review progress</span></div>
      {day === 14 && <p className="journey-complete"><CheckCircle2 size={17} aria-hidden="true"/> Review what changed during the test.</p>}
    </div>
  </section>;
}
