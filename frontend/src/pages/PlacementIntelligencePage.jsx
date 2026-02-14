import React, { useState } from 'react';
import { placementData, aiInsights } from '../data/syntheticData.js';

const PlacementIntelligencePage = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filterDomain, setFilterDomain] = useState('All');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Placement Intelligence</h1>
          <p className="text-lg text-slate-600">AI-powered insights for your recruitment journey</p>
        </div>

        {/* Market Trends */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: 'Top Hiring Domain',
              value: placementData.placementTrends.topDomains[0],
              icon: '📊'
            },
            {
              label: 'Growing Roles',
              value: placementData.placementTrends.growingRoles[0],
              icon: '📈'
            },
            {
              label: 'Most Demanded Skill',
              value: 'Data Structures',
              icon: '⚡'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-slate-600 text-sm mb-1">{item.label}</p>
              <p className="text-xl font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Companies Actively Hiring */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Companies Currently Hiring</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {placementData.companies.map((company) => (
              <div
                key={company.id}
                onClick={() => setSelectedCompany(company)}
                className="cursor-pointer p-4 border border-slate-200 rounded-lg hover:shadow-lg transition-shadow hover:border-blue-500"
              >
                <h3 className="font-bold text-lg text-slate-900 mb-2">{company.name}</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><strong>Roles:</strong> {company.rolesHiring.join(', ')}</p>
                  <p><strong>Season:</strong> {company.hiringSeasonMonth}</p>
                  <p><strong>Avg Package:</strong> ${company.averagePackage}L</p>
                  <p><strong>Last Year:</strong> {company.placementsLastYear} placements</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Company Details */}
        {selectedCompany && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedCompany.name}</h2>
                <p className="text-slate-600">Comprehensive Role & Skill Requirements</p>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Open Roles</h3>
                <ul className="space-y-2">
                  {selectedCompany.rolesHiring.map((role, idx) => (
                    <li key={idx} className="text-slate-700 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {role}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3">Expected Skills</h3>
                <ul className="space-y-2">
                  {selectedCompany.expectedSkills.map((skill, idx) => (
                    <li key={idx} className="text-slate-700 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-blue-500">
              <p className="text-slate-700">
                <strong>AI Recommendation:</strong> {selectedCompany.name} typically hires {selectedCompany.hiringSeasonMonth}. 
                Focus on {selectedCompany.expectedSkills.slice(0, 2).join(' and ')} skills for maximum impact.
              </p>
            </div>
          </div>
        )}

        {/* Skill Demand Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Most Demanded Skills</h2>
          <div className="space-y-4">
            {Object.entries(placementData.placementTrends.skillDemand).map(([skill, demand]) => (
              <div key={skill}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-900">{skill}</span>
                  <span className="text-blue-600 font-bold">{demand}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${demand}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">AI-Generated Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.placementTrends.map((trend, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-slate-900 flex-1">{trend.insight}</p>
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                    {trend.confidence}% confident
                  </span>
                </div>
                <p className="text-xs text-slate-600">{trend.data}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementIntelligencePage;
