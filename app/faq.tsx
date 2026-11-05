'use client';

export const questions=[
  ['Why do I need 12 testers for 14 days?', 'Google Play requires personal developer accounts created after November 13, 2023 to run a closed test with at least 12 testers opted in continuously for the preceding 14 days before applying for production access. This requirement does not apply identically to every developer account.'],
  ['Does completing the test guarantee approval?', 'No. Google reviews your production-access application, including tester engagement, feedback, and app readiness. Meeting the minimum tester count and duration lets you apply; Google may request more testing.'],
  ['When does the 14-day period start?', 'It starts after setup is confirmed and the qualifying tester group has opted in, not when you submit a request. Play Console is the source of truth for eligibility; the website timeline is a coordination aid.'],
  ['Do you need access to my Google account?', 'No Google password is needed. You share your closed-testing link and add the tester email list or group in Play Console. If your app requires sign-in, use dedicated test accounts with limited permissions.'],
  ['What if a tester leaves early?', 'A tester who opts out loses their continuous qualifying period. A replacement needs their own 14 continuous days. Developers should monitor opt-in and recruit replacement testers if needed.'],
  ['Is Testlane free?', 'Yes. You can post an app or request to test for free. You do not need to post an app to become a tester.']
];

export function FAQ() {
  return <div className="faq-list">{questions.map(([question, answer]) =>
    <details key={question} onPointerLeave={({currentTarget: row}) => {
      if (row.dataset.hoverPreview === 'true') {
        row.open = false;
        delete row.dataset.hoverPreview;
      }
    }}>
      <summary onPointerEnter={({currentTarget, pointerType}) => {
        const row = currentTarget.parentElement as HTMLDetailsElement;
        if (pointerType !== 'mouse' || !matchMedia('(hover: hover)').matches || row.open) return;
        row.dataset.hoverPreview = 'true';
        row.open = true;
      }} onClick={event => {
        const row = event.currentTarget.parentElement as HTMLDetailsElement;
        if (row.dataset.hoverPreview !== 'true') return;
        event.preventDefault();
        delete row.dataset.hoverPreview;
      }}>{question}<span className="faq-plus" aria-hidden="true">+</span></summary>
      <p>{answer}</p>
    </details>
  )}</div>;
}
