import React, { useState } from 'react';
import { interviewExperiences } from '../data/syntheticData.js';

const InterviewRepositoryPage = () => {
  const [selectedInterview, setSelectedInterview] = useState(interviewExperiences[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Interview Repository</h1>
          <p className="text-lg text-slate-600">Learn from real interview experiences of students who came before you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Company List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Company Interviews</h2>
              <div className="space-y-2">
                {interviewExperiences.map((interview) => (
                  <button
                    key={interview.id}
                    onClick={() => setSelectedInterview(interview)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedInterview.id === interview.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-semibold">{interview.company}</div>
                    <div className={`text-sm ${selectedInterview.id === interview.id ? 'text-blue-100' : 'text-slate-600'}`}>
                      {interview.role}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          {selectedInterview && (
            <div className="lg:col-span-2 space-y-6">
              {/* Interview Overview */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedInterview.company}</h2>
                <p className="text-slate-600 mb-4">Role: <strong>{selectedInterview.role}</strong></p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Total Rounds</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedInterview.totalRounds}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Per Round</p>
                    <p className="text-lg font-bold text-green-600">~45 mins</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Year</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedInterview.year}</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <p className="text-slate-700">
                    <strong>💡 Key Insight:</strong> {selectedInterview.feedback}
                  </p>
                </div>
              </div>

              {/* Interview Rounds */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Interview Rounds Breakdown</h3>
                
                {selectedInterview.rounds.map((round, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{round.type}</h4>
                        <p className="text-sm text-slate-600">⏱ Duration: {round.duration}</p>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                        Difficulty: {round.difficulty}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-slate-700 mb-2">Expected Questions/Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {(round.questions || round.focusAreas).map((item, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600">Success Rate (Pass Rate)</p>
                      <div className="flex items-center">
                        <div className="w-24 bg-slate-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${round.passPercentage}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-900">{round.passPercentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preparation Tips */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-lg p-6 border border-green-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">📚 Preparation Guide</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">1</span>
                    <span className="text-slate-700">Study the technical topics from the questions list thoroughly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">2</span>
                    <span className="text-slate-700">Practice similar problems and understand the underlying concepts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">3</span>
                    <span className="text-slate-700">Mock interview with friends focusing on explanation and communication</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">4</span>
                    <span className="text-slate-700">Research the company and its tech stack beforehand</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-3xl font-bold text-blue-600 mb-2">{interviewExperiences.length}</p>
            <p className="text-slate-600">Companies Tracked</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-3xl font-bold text-green-600 mb-2">{interviewExperiences.reduce((acc, i) => acc + i.totalRounds, 0)}</p>
            <p className="text-slate-600">Total Interview Rounds</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-3xl font-bold text-purple-600 mb-2">2025</p>
            <p className="text-slate-600">Latest Data Year</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRepositoryPage;
