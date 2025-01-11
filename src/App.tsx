import React, { useState, useEffect } from 'react';
import { AdCard } from './components/AdCard';
import { FinalButton } from './components/FinalButton';
import { AdCard as AdCardType } from './types';

// Ad scripts configuration
const AD_SCRIPTS = [
  `(function(bymxi){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = bymxi || {};
s.src = "//luminoustry.com/b/X.VpsJdWG/l/0-YQWJd/iUYIWy5bu/ZvXWIJ/Jedmt9fu-ZeUPlYkaPgTvU/5zOqDOE/wnMzTDgEtONPT/k/4fMtTHAmxUOQQR";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`,
  `(function(matj){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = matj || {};
s.src = "//luminoustry.com/bpXQV.sjdFG/lx0lYZWndbiCYaWt5AuNZbXxIC/gebmY9/uqZXUZlPkEP/TUUd5bNCzDgq1/N/jAEdttNnT-ks3/OkDNU/2gMYgV";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`,
  `(function(pscbq){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = pscbq || {};
s.src = "//luminoustry.com/bhXZVFsGd.GXle0wY/WPdAi/YfWx5vu_Z-XeID/GeKma9yu/ZNUml/kjPgT/UR5/NjzlgO1AMnzLM/tpNSTMkA3yOKDfUYzYNdAr";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`,
  `(function(hktl){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = hktl || {};
s.src = "//luminoustry.com/bvXLV/skd.GMli0vYRWgdbi/YHW/5XuPZkXnIx/te/mk9WuzZ-UElIklP/T/YEweMTDrchxYMxzHUwtHNXjIABw/NMzHEtzgN/gd";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`,
  `(function(zaign){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = zaign || {};
s.src = "//luminoustry.com/baX.V/s/dCGUlQ0yYdWvdyihYSWt5/usZGXsIr/Zeem/9UuyZGUsl/k-PKT/YnwXM/DVcixmN/DrUJtxNCjeAowrNXzjE/0pNvgx";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`,
];

function App() {
  const [ads, setAds] = useState<AdCardType[]>(() => {
    const saved = localStorage.getItem('adStates');
    return saved ? JSON.parse(saved) : Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      isUnlocked: false,
      title: `Advertisement ${i + 1}`,
      adScript: AD_SCRIPTS[i]
    }));
  });

  useEffect(() => {
    localStorage.setItem('adStates', JSON.stringify(ads));
  }, [ads]);

  const handleUnlock = (id: number) => {
    setAds(prev => prev.map(ad => 
      ad.id === id ? { ...ad, isUnlocked: true } : ad
    ));
  };

  const allUnlocked = ads.every(ad => ad.isUnlocked);

  const handleFinalButtonClick = () => {
    if (allUnlocked) {
      window.location.href = 'https://example.com';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          Interactive Ads
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-12">
          {ads.map(ad => (
            <AdCard
              key={ad.id}
              id={ad.id}
              isUnlocked={ad.isUnlocked}
              title={ad.title}
              adScript={ad.adScript}
              onUnlock={handleUnlock}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <FinalButton
            isUnlocked={allUnlocked}
            onClick={handleFinalButtonClick}
          />
        </div>
      </div>
    </div>
  );
}

export default App;