import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext.jsx';
import { useReadingTime } from '../context/ReadingTimeContext.jsx';
import axios from 'axios';

/*  ─── KTH 2007 Study Constants ─────────────────────────────
    Source: "Life Cycle Assessment of Print and E-media"
    KTH Royal Institute of Technology, Stockholm, 2007
    https://at.twosides.info/wp-content/uploads/sites/7/2011/09/07-12-Life-cycle-of-print-and-e-media-KTH-Stockholm.pdf

    Key findings used:
    • Printed newspaper: 28 kg CO₂ / year / reader
      ≈ 0.25 kg (250 g) per daily copy
    • Digital (10 min/day): 14 kg CO₂ / year  (50% less than print)
    • Digital (30 min/day): 35 kg CO₂ / year  (25% more than print)
    • Per web page viewed: 0.1 – 0.7 g CO₂
    ────────────────────────────────────────────────────────── */

const KTH = {
  printPerYearKg: 28,            // kg CO₂ per year for a print newspaper reader
  printPerCopyG: 250,            // grams CO₂ per printed newspaper copy
  digitalPer10minYearKg: 14,     // kg CO₂ per year at 10 min/day digital reading
  digitalPerMinuteG: 14000 / 365 / 10, // ≈ 3.84 g CO₂ per minute of digital reading
  paperWeight: 0.3,              // kg per newspaper (average broadsheet)
  treesPerTonne: 17,             // average trees needed per tonne of newsprint
  waterPerKg: 10,                // liters of water per kg of newsprint
  energyPerCopy: 0.5,            // kWh per newspaper copy
};

// Calculate how much CO₂ a print reader would emit for same reading time
function printCO2ForMinutes(minutes) {
  // 1 newspaper per day ≈ 250 g CO₂
  // Average reading time for a newspaper ≈ 25 minutes
  // So per minute of reading: 250g / 25min = 10g CO₂ per minute
  return minutes * 10;  // grams
}

// Calculate digital reading CO₂ from KTH data
function digitalCO2ForMinutes(minutes) {
  return minutes * KTH.digitalPerMinuteG; // grams
}

// Papers saved estimate: 1 paper per 25 min of digital reading
function papersSavedFromMinutes(minutes) {
  return Math.floor(minutes / 25);
}

export default function SustainabilityPage() {
  const { articles, eco } = useNews();
  const { todaySeconds, todayMinutes, weeklyMinutes, monthlyMinutes, totalMinutes, formatTime } = useReadingTime();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);

  // Research-backed calculations
  const todayPrintCO2 = printCO2ForMinutes(todayMinutes);         // grams
  const todayDigitalCO2 = digitalCO2ForMinutes(todayMinutes);     // grams
  const todaySavedCO2 = Math.max(0, todayPrintCO2 - todayDigitalCO2); // grams saved

  const monthlyPrintCO2 = printCO2ForMinutes(monthlyMinutes);
  const monthlyDigitalCO2 = digitalCO2ForMinutes(monthlyMinutes);
  const monthlySavedCO2 = Math.max(0, monthlyPrintCO2 - monthlyDigitalCO2);

  const totalPrintCO2 = printCO2ForMinutes(totalMinutes);
  const totalDigitalCO2 = digitalCO2ForMinutes(totalMinutes);
  const totalSavedCO2 = Math.max(0, totalPrintCO2 - totalDigitalCO2);

  const totalPapersSaved = papersSavedFromMinutes(totalMinutes) + (eco?.papersSaved || 0);

  // Environmental impact from papers saved
  const treesSaved = ((totalPapersSaved * KTH.paperWeight) / 1000) * KTH.treesPerTonne;
  const waterSaved = totalPapersSaved * KTH.paperWeight * KTH.waterPerKg;
  const energySaved = totalPapersSaved * KTH.energyPerCopy;

  // Sustainability-related articles
  const sustainabilityArticles = articles.filter(a =>
    a.title?.toLowerCase().includes('green') ||
    a.title?.toLowerCase().includes('sustainable') ||
    a.title?.toLowerCase().includes('climate') ||
    a.title?.toLowerCase().includes('carbon') ||
    a.title?.toLowerCase().includes('renewable') ||
    a.summary?.toLowerCase().includes('environment')
  );

  useEffect(() => {
    fetchSustainabilityVideos();
  }, []);

  const fetchSustainabilityVideos = async () => {
    try {
      setVideoLoading(true);
      const response = await axios.get('http://localhost:4000/api/videos/sustainability');
      setVideos(response.data.videos || []);
    } catch (error) {
      console.error('Error fetching sustainability videos:', error);
      setVideos([]);
    } finally {
      setVideoLoading(false);
    }
  };

  const VideoModal = ({ video, onClose }) => {
    if (!video) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex justify-between items-center">
            <h2 className="font-serif text-xl font-bold text-foreground truncate">{video.title}</h2>
            <button onClick={onClose} className="text-muted hover:text-foreground transition text-2xl">✕</button>
          </div>
          <div className="p-6 space-y-4">
            {video.youtubeId && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  width="100%" height="100%"
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            <div className="space-y-3">
              <p className="text-sm text-muted">{video.description}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {video.channel && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">📺 {video.channel}</span>}
                {video.views && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">👁️ {parseInt(video.views).toLocaleString()} views</span>}
                {video.duration && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">⏱️ {video.duration}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <span className="text-white text-sm">🌱</span>
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Sustainability & Impact
            </h1>
            <p className="text-sm text-muted">
              Research-backed environmental impact tracking — powered by peer-reviewed data
            </p>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          LIVE READING IMPACT TRACKER
          ══════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⏱️</span>
          <h2 className="font-serif text-lg font-bold text-green-800">Your Reading Session — Live</h2>
          <span className="ml-auto px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">LIVE</span>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-white/80 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{formatTime(todaySeconds)}</p>
            <p className="text-xs text-muted">Reading Time Today</p>
          </div>
          <div className="bg-white/80 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{todaySavedCO2.toFixed(1)}g</p>
            <p className="text-xs text-muted">CO₂ Saved Today</p>
          </div>
          <div className="bg-white/80 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{totalPapersSaved.toLocaleString()}</p>
            <p className="text-xs text-muted">Papers Saved (All Time)</p>
          </div>
          <div className="bg-white/80 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{(totalSavedCO2 / 1000).toFixed(2)} kg</p>
            <p className="text-xs text-muted">Total CO₂ Saved</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          CO₂ COMPARISON DASHBOARD
          ══════════════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-serif text-lg font-semibold mb-4">📊 Carbon Footprint Comparison</h2>
        <p className="text-xs text-muted mb-4">
          Based on the KTH Royal Institute of Technology (Sweden) 2007 life-cycle assessment study
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Today */}
          <div className="border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 text-center">Today ({todayMinutes} min read)</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">📰 Print newspaper:</span>
                <span className="font-bold text-red-600">{todayPrintCO2.toFixed(1)}g CO₂</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">📱 Digital (BizAI):</span>
                <span className="font-bold text-green-600">{todayDigitalCO2.toFixed(1)}g CO₂</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-sm">
                <span className="font-semibold">✅ You saved:</span>
                <span className="font-bold text-green-600">{todaySavedCO2.toFixed(1)}g CO₂</span>
              </div>
            </div>
          </div>

          {/* Monthly */}
          <div className="border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 text-center">This Month ({monthlyMinutes} min)</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">📰 Print equivalent:</span>
                <span className="font-bold text-red-600">{(monthlyPrintCO2 / 1000).toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">📱 Digital actual:</span>
                <span className="font-bold text-green-600">{(monthlyDigitalCO2 / 1000).toFixed(2)} kg</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-sm">
                <span className="font-semibold">✅ You saved:</span>
                <span className="font-bold text-green-600">{(monthlySavedCO2 / 1000).toFixed(2)} kg</span>
              </div>
            </div>
          </div>

          {/* All-Time */}
          <div className="border border-green-300 bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 text-center text-green-800">All-Time Impact</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">📰 Print equivalent:</span>
                <span className="font-bold text-red-600">{(totalPrintCO2 / 1000).toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">📱 Digital actual:</span>
                <span className="font-bold text-green-600">{(totalDigitalCO2 / 1000).toFixed(2)} kg</span>
              </div>
              <div className="border-t border-green-200 pt-2 flex justify-between text-sm">
                <span className="font-bold text-green-800">✅ Total saved:</span>
                <span className="font-bold text-green-700">{(totalSavedCO2 / 1000).toFixed(2)} kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-muted mb-2">Print vs Digital CO₂ (today)</p>
          <div className="flex gap-2 items-center">
            <span className="text-xs w-16 text-right">Print</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div className="bg-red-400 h-4 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, todayPrintCO2 > 0 ? 100 : 0)}%` }}></div>
            </div>
            <span className="text-xs w-20 font-mono">{todayPrintCO2.toFixed(0)}g</span>
          </div>
          <div className="flex gap-2 items-center mt-1">
            <span className="text-xs w-16 text-right">Digital</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div className="bg-green-400 h-4 rounded-full transition-all duration-1000" style={{ width: `${todayPrintCO2 > 0 ? Math.min(100, (todayDigitalCO2 / todayPrintCO2) * 100) : 0}%` }}></div>
            </div>
            <span className="text-xs w-20 font-mono">{todayDigitalCO2.toFixed(0)}g</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          ENVIRONMENTAL IMPACT CARDS
          ══════════════════════════════════════════════════ */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🌳</div>
          <p className="text-2xl font-bold text-green-600">{treesSaved.toFixed(2)}</p>
          <p className="text-xs text-muted">trees</p>
          <p className="text-sm font-medium mt-1">Trees Saved</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">💧</div>
          <p className="text-2xl font-bold text-green-600">{Math.round(waterSaved).toLocaleString()}</p>
          <p className="text-xs text-muted">liters</p>
          <p className="text-sm font-medium mt-1">Water Saved</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <p className="text-2xl font-bold text-green-600">{Math.round(energySaved).toLocaleString()}</p>
          <p className="text-xs text-muted">kWh</p>
          <p className="text-sm font-medium mt-1">Energy Saved</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">♻️</div>
          <p className="text-2xl font-bold text-green-600">{(totalPapersSaved * KTH.paperWeight).toFixed(1)}</p>
          <p className="text-xs text-muted">kg</p>
          <p className="text-sm font-medium mt-1">Waste Reduced</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          RESEARCH & METHODOLOGY
          ══════════════════════════════════════════════════ */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h2 className="font-serif text-lg font-semibold mb-3 text-blue-800">📚 Research & Methodology</h2>
        <p className="text-sm text-blue-700 mb-4">
          Our carbon footprint calculations are based on peer-reviewed academic research:
        </p>

        {/* Primary source */}
        <div className="bg-white rounded-lg p-4 border border-blue-100 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📄</span>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-blue-900 mb-1">
                Life Cycle Assessment of Print and E-media
              </h3>
              <p className="text-xs text-blue-700 mb-2">
                KTH Royal Institute of Technology, Stockholm, Sweden (2007)
              </p>
              <p className="text-xs text-muted mb-3">
                A comprehensive life-cycle assessment comparing the environmental impact of printed newspapers
                versus electronic media, covering paper production, printing, distribution, reading devices,
                and digital infrastructure.
              </p>
              <a
                href="https://at.twosides.info/wp-content/uploads/sites/7/2011/09/07-12-Life-cycle-of-print-and-e-media-KTH-Stockholm.pdf"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline font-semibold"
              >
                📎 View Full Study (PDF) →
              </a>
            </div>
          </div>
        </div>

        {/* Key findings table */}
        <h3 className="font-semibold text-sm text-blue-800 mb-2">Key Findings Used:</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-100/50">
                <th className="text-left py-2 px-3 text-blue-800 font-semibold text-xs">Scenario</th>
                <th className="text-right py-2 px-3 text-blue-800 font-semibold text-xs">CO₂ per Year</th>
                <th className="text-right py-2 px-3 text-blue-800 font-semibold text-xs">vs Print</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-blue-100">
                <td className="py-2 px-3 text-blue-700 text-xs">📰 Printed Newspaper (European scenario)</td>
                <td className="py-2 px-3 text-right text-blue-700 font-mono text-xs">28 kg CO₂</td>
                <td className="py-2 px-3 text-right text-blue-700 text-xs">baseline</td>
              </tr>
              <tr className="border-t border-blue-100">
                <td className="py-2 px-3 text-blue-700 text-xs">📱 Digital Reading (10 min/day)</td>
                <td className="py-2 px-3 text-right text-green-600 font-mono text-xs">14 kg CO₂</td>
                <td className="py-2 px-3 text-right text-green-600 font-bold text-xs">−50%</td>
              </tr>
              <tr className="border-t border-blue-100">
                <td className="py-2 px-3 text-blue-700 text-xs">📱 Digital Reading (30 min/day)</td>
                <td className="py-2 px-3 text-right text-amber-600 font-mono text-xs">35 kg CO₂</td>
                <td className="py-2 px-3 text-right text-amber-600 font-bold text-xs">+25%</td>
              </tr>
              <tr className="border-t border-blue-100">
                <td className="py-2 px-3 text-blue-700 text-xs">🌐 Per Web Page Viewed</td>
                <td className="py-2 px-3 text-right text-blue-700 font-mono text-xs">0.1 – 0.7g</td>
                <td className="py-2 px-3 text-right text-blue-700 text-xs">—</td>
              </tr>
              <tr className="border-t border-blue-100 bg-blue-50">
                <td className="py-2 px-3 text-blue-700 text-xs">📰 Single Newspaper Copy</td>
                <td className="py-2 px-3 text-right text-blue-700 font-mono text-xs">~0.2 – 0.3 kg</td>
                <td className="py-2 px-3 text-right text-blue-700 text-xs">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Methodology explanation */}
        <div className="mt-4 p-3 bg-blue-100/30 rounded-lg">
          <h4 className="text-xs font-semibold text-blue-800 mb-1">How We Calculate:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <strong>Print CO₂:</strong> 250g per newspaper copy ÷ 25 min average reading = 10g CO₂/min of print reading</li>
            <li>• <strong>Digital CO₂:</strong> 14 kg/year ÷ 365 days ÷ 10 min/day ≈ 3.84g CO₂/min of digital reading</li>
            <li>• <strong>CO₂ Saved:</strong> Print CO₂ − Digital CO₂ = net carbon savings per minute of reading</li>
            <li>• <strong>Papers Saved:</strong> Based on 1 newspaper per 25 minutes of digital reading</li>
            <li>• <strong>Paper production</strong> accounts for 50–70% of total print environmental impact</li>
          </ul>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          GREEN INITIATIVES
          ══════════════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-serif text-lg font-semibold mb-4">🌿 Green Initiatives</h2>
        <div className="space-y-4">
          {[
            { title: 'Digital-First Reading', description: 'Reducing paper consumption by delivering curated news digitally — saving trees, water, and energy', impact: 'High', status: 'Active' },
            { title: 'Carbon Tracking Engine', description: 'Real-time CO₂ footprint comparison using KTH 2007 peer-reviewed methodology', impact: 'High', status: 'Active' },
            { title: 'Reading Time Analytics', description: 'Tracking user engagement time to calculate precise environmental impact', impact: 'High', status: 'Active' },
            { title: 'Sustainable Learning', description: 'Integrating sustainability education into business learning modules', impact: 'Medium', status: 'Active' },
          ].map((initiative, idx) => (
            <div key={idx} className="flex items-start gap-4 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-sm">{initiative.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${initiative.status === 'Active' ? 'bg-green-100 text-green-700' :
                      initiative.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                    {initiative.status}
                  </span>
                </div>
                <p className="text-xs text-muted mb-2">{initiative.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">Impact:</span>
                  <span className={`text-xs font-semibold ${initiative.impact === 'High' ? 'text-green-600' :
                      initiative.impact === 'Medium' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                    {initiative.impact}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SUSTAINABILITY VIDEOS
          ══════════════════════════════════════════════════ */}
      <div className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-foreground">🎥 Learn About Sustainability</h2>
        <p className="text-sm text-muted">Watch videos from experts about green practices and sustainable business</p>

        {videoLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.slice(0, 6).map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer hover:-translate-y-1"
              >
                <div className="relative bg-green-100 aspect-video overflow-hidden">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-200 to-emerald-400">
                      <span className="text-4xl">🌍</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <span className="text-white text-4xl">▶️</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-foreground line-clamp-2 hover:text-green-600">{video.title}</h3>
                  <p className="text-xs text-muted line-clamp-2">{video.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {video.channel && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{video.channel.substring(0, 20)}</span>}
                    {video.views && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">👁️ {parseInt(video.views / 1000)}k</span>}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedVideo(video); }}
                    className="w-full mt-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted">
            <p>No sustainability videos available yet</p>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════
          SUSTAINABILITY NEWS
          ══════════════════════════════════════════════════ */}
      {sustainabilityArticles.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-serif text-lg font-semibold mb-4">
            🌿 Sustainability in the News ({sustainabilityArticles.length})
          </h2>
          <div className="space-y-3">
            {sustainabilityArticles.slice(0, 3).map((article) => (
              <div key={article.id} className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-sm mb-1">{article.title}</h3>
                <p className="text-xs text-muted mb-2">{article.sourceName}</p>
                <a
                  href={article.url || article.link || '#'}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs text-accent hover:underline"
                >
                  Read more →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          SUSTAINABILITY TIPS
          ══════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
        <h2 className="font-serif text-lg font-semibold mb-4 text-green-800">💡 Sustainability Tips</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="text-sm">
            <strong>Digital Reading:</strong> Continue reading news digitally to save paper and reduce carbon footprint.
          </div>
          <div className="text-sm">
            <strong>Share Knowledge:</strong> Share important articles digitally instead of printing them.
          </div>
          <div className="text-sm">
            <strong>Green Choices:</strong> Support companies with strong ESG commitments.
          </div>
          <div className="text-sm">
            <strong>Stay Informed:</strong> Keep up with sustainability trends in business through BizAI.
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          DATA SOURCES
          ══════════════════════════════════════════════════ */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <h2 className="font-serif text-lg font-semibold mb-4 text-green-800">📚 Environmental Data Sources</h2>
        <p className="text-sm text-green-700 mb-3">
          Our environmental impact calculations are based on peer-reviewed research:
        </p>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-green-600 mt-1">•</span>
            <a
              href="https://at.twosides.info/wp-content/uploads/sites/7/2011/09/07-12-Life-cycle-of-print-and-e-media-KTH-Stockholm.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-green-700 hover:text-green-800 hover:underline"
            >
              KTH Royal Institute of Technology — Life Cycle Assessment of Print and E-media (2007)
            </a>
          </div>
          {eco?.sources?.map((source, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-green-700 hover:text-green-800 hover:underline"
              >
                {source.label}
              </a>
            </div>
          ))}
        </div>
        <p className="text-xs text-green-600 mt-3">
          CO₂ calculations assume 250g CO₂ per newspaper copy (KTH European scenario) and 3.84g CO₂ per minute of digital reading.
        </p>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}