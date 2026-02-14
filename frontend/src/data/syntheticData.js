// Synthetic Data for Development/Testing
// This will be replaced with real Firebase data in production

export const syntheticNews = [{
        id: 1,
        title: 'Tech Giants Report Record Q4 2025 Earnings',
        description: 'Major technology companies exceed expectations with strong enterprise spending.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        source: 'Bloomberg',
        date: new Date(2026, 1, 3),
        category: 'Technology',
        content: 'Leading tech companies reported unprecedented Q4 earnings, driven by AI infrastructure investments and cloud adoption.'
    },
    {
        id: 2,
        title: 'Renewable Energy Sector Reaches 50% of Global Output',
        description: 'Clean energy sources now represent half of global electricity generation.',
        image: 'https://images.unsplash.com/photo-1509391366360-2e938aa1df86?w=400&h=300&fit=crop',
        source: 'Reuters',
        date: new Date(2026, 1, 2),
        category: 'Sustainability',
        content: 'Global renewable energy capacity surpassed fossil fuels for the first time, marking a historic transition.'
    },
    {
        id: 3,
        title: 'AI-Powered Healthcare Solutions Transform Patient Care',
        description: 'Machine learning models improve diagnosis accuracy by 40% across hospitals.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
        source: 'Healthcare Today',
        date: new Date(2026, 1, 1),
        category: 'Healthcare',
        content: 'AI applications in healthcare are revolutionizing patient outcomes and operational efficiency.'
    },
    {
        id: 4,
        title: 'Women Founders Secure Record $100B in Venture Funding',
        description: 'Female-led startups receive unprecedented investment boost in 2025.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        source: 'Venture Beat',
        date: new Date(2025, 11, 28),
        category: 'Women in Business',
        content: 'A record number of female entrepreneurs are securing major funding rounds and achieving unicorn status.'
    }
];

export const placementData = {
    companies: [{
            id: 1,
            name: 'Google',
            logo: 'https://www.google.com/favicon.ico',
            rolesHiring: ['Software Engineer', 'Product Manager', 'Data Scientist'],
            expectedSkills: ['DSA', 'System Design', 'Python/Java'],
            hiringSeasonMonth: 'September',
            placementsLastYear: 25,
            averagePackage: 42
        },
        {
            id: 2,
            name: 'Microsoft',
            logo: 'https://www.microsoft.com/favicon.ico',
            rolesHiring: ['Cloud Engineer', 'DevOps', 'Backend Developer'],
            expectedSkills: ['Azure', 'Kubernetes', 'Microservices'],
            hiringSeasonMonth: 'August',
            placementsLastYear: 18,
            averagePackage: 38
        },
        {
            id: 3,
            name: 'Goldman Sachs',
            logo: 'https://www.goldmansachs.com/favicon.ico',
            rolesHiring: ['Quantitative Analyst', 'Trading Systems', 'Risk Analysis'],
            expectedSkills: ['C++', 'Python', 'Finance Fundamentals'],
            hiringSeasonMonth: 'September',
            placementsLastYear: 12,
            averagePackage: 58
        },
        {
            id: 4,
            name: 'Amazon',
            logo: 'https://www.amazon.com/favicon.ico',
            rolesHiring: ['SDE', 'Data Engineer', 'Operations'],
            expectedSkills: ['AWS', 'Distributed Systems', 'Problem Solving'],
            hiringSeasonMonth: 'July',
            placementsLastYear: 30,
            averagePackage: 40
        },
        {
            id: 5,
            name: 'Deloitte',
            logo: 'https://www.deloitte.com/favicon.ico',
            rolesHiring: ['Consulting', 'Business Analyst', 'Audit'],
            expectedSkills: ['Business Acumen', 'Communication', 'Excel'],
            hiringSeasonMonth: 'October',
            placementsLastYear: 35,
            averagePackage: 12
        }
    ],

    placementTrends: {
        topDomains: ['Software Development', 'Data Science', 'Finance', 'Consulting'],
        growingRoles: ['AI/ML Engineer', 'Cloud Architect', 'DevOps'],
        skillDemand: {
            'Python': 85,
            'System Design': 72,
            'Cloud (AWS/Azure)': 68,
            'Data Structures': 95,
            'Communication': 80
        }
    }
};

export const interviewExperiences = [{
        id: 1,
        company: 'Google',
        role: 'Software Engineer',
        year: 2025,
        rounds: [{
                type: 'Round 1: Online Assessment',
                duration: '120 mins',
                questions: ['Two Sum', 'Merge K Sorted Lists', 'LRU Cache'],
                difficulty: 'Medium-Hard',
                passPercentage: 35
            },
            {
                type: 'Round 2: Technical Interview',
                duration: '45 mins',
                questions: ['Design a Rate Limiter', 'System Design Discussion'],
                difficulty: 'Hard',
                passPercentage: 45
            },
            {
                type: 'Round 3: Behavioral',
                duration: '30 mins',
                focusAreas: ['Leadership', 'Collaboration', 'Impact'],
                passPercentage: 70
            }
        ],
        totalRounds: 3,
        averageTime: '90 mins per round',
        feedback: 'Focus on system design and communication. They value explaining your thought process.'
    },
    {
        id: 2,
        company: 'Goldman Sachs',
        role: 'Quantitative Analyst',
        year: 2025,
        rounds: [{
                type: 'Round 1: Technical Assessment',
                duration: '90 mins',
                questions: ['Option Pricing', 'Portfolio Optimization', 'Risk Calculation'],
                difficulty: 'Very Hard',
                passPercentage: 20
            },
            {
                type: 'Round 2: Case Study',
                duration: '60 mins',
                questions: ['Market Anomaly Analysis', 'Trading Strategy Design'],
                difficulty: 'Hard',
                passPercentage: 30
            },
            {
                type: 'Round 3: Interview',
                duration: '45 mins',
                focusAreas: ['Finance Knowledge', 'Analytical Thinking'],
                passPercentage: 50
            }
        ],
        totalRounds: 3,
        averageTime: '195 mins total',
        feedback: 'Strong finance fundamentals are crucial. Practice option pricing models and market scenarios.'
    },
    {
        id: 3,
        company: 'Amazon',
        role: 'SDE',
        year: 2025,
        rounds: [{
                type: 'Round 1: Online Test',
                duration: '120 mins',
                questions: ['Two pointers', 'Trees', 'Graphs'],
                difficulty: 'Medium',
                passPercentage: 50
            },
            {
                type: 'Round 2-4: Technical Rounds',
                duration: '45 mins each',
                questions: ['Code problems', 'Design Discussion'],
                difficulty: 'Medium-Hard',
                passPercentage: 40
            },
            {
                type: 'Round 5: Bar Raiser',
                duration: '45 mins',
                focusAreas: ['Leadership', 'Problem Solving'],
                passPercentage: 35
            }
        ],
        totalRounds: 5,
        averageTime: '280 mins total',
        feedback: 'Amazon focuses on leadership principles. Emphasize ownership, bias for action, and customer obsession.'
    }
];

export const sustainabilityScores = {
    companies: [{
            id: 1,
            name: 'Unilever',
            overallScore: 78,
            carbonEmissions: 72,
            waterUsage: 85,
            wasteManagement: 75,
            socialImpact: 82,
            year: 2025,
            methodology: 'Science-Based Targets Initiative (SBTi) + GRI Standards'
        },
        {
            id: 2,
            name: 'Tesla',
            overallScore: 88,
            carbonEmissions: 95,
            waterUsage: 70,
            wasteManagement: 88,
            socialImpact: 80,
            year: 2025,
            methodology: 'Carbon Footprint Analysis + Renewable Energy %'
        },
        {
            id: 3,
            name: 'Microsoft',
            overallScore: 85,
            carbonEmissions: 92,
            waterUsage: 80,
            wasteManagement: 82,
            socialImpact: 85,
            year: 2025,
            methodology: 'CDP Climate Change + ISO 14001'
        }
    ],

    algorithm: {
        name: 'BizAI Sustainability Score Algorithm',
        version: '1.0',
        formula: 'Overall Score = (CarbonEmissions × 0.35) + (WaterUsage × 0.20) + (WasteManagement × 0.20) + (SocialImpact × 0.25)',
        components: [{
                name: 'Carbon Emissions Score',
                weight: 35,
                description: 'Measures CO2 reduction vs baseline, renewable energy adoption',
                dataSource: 'Science-Based Targets Initiative, Carbon Disclosure Project',
                formula: '(Baseline Emissions - Current Emissions) / Baseline × 100',
                proofs: [
                    'ISO 14064-1: Greenhouse Gas Quantification Standards',
                    'SBTi Validated Targets (1.5°C pathway)',
                    'Annual Third-Party Audits'
                ]
            },
            {
                name: 'Water Usage Score',
                weight: 20,
                description: 'Water consumption per unit of production, recycling rates',
                dataSource: 'Water Stewardship Council, ISO 14001',
                formula: '(Baseline Water - Current Water) / Baseline × 100',
                proofs: [
                    'WSC Gold Standard Certification',
                    'ISO 14001 Environmental Management',
                    'Independent Water Audits'
                ]
            },
            {
                name: 'Waste Management Score',
                weight: 20,
                description: 'Waste reduction, recycling rates, circular economy practices',
                dataSource: 'Ellen MacArthur Foundation, ISO 14001',
                formula: '(Waste Diverted / Total Waste) × 100',
                proofs: [
                    'Circular Economy Framework Compliance',
                    'Zero Waste Certifications',
                    'Supply Chain Waste Tracking'
                ]
            },
            {
                name: 'Social Impact Score',
                weight: 25,
                description: 'Community development, employee welfare, supply chain ethics',
                dataSource: 'UN SDGs, B-Corp Standards, GRI Reporting',
                formula: 'Weighted average of 8 social metrics',
                proofs: [
                    'UN Sustainable Development Goals (SDGs) Alignment',
                    'B-Corp Certification',
                    'Third-Party Social Audits'
                ]
            }
        ]
    }
};

export const aiInsights = {
    placementTrends: [{
            insight: 'AI/ML roles dominating 27% of all openings this season',
            confidence: 92,
            data: 'Analyzed 500+ job postings across top 50 companies'
        },
        {
            insight: 'Cloud skills (AWS/Azure) in 68% of backend roles',
            confidence: 88,
            data: 'Cross-referenced 200+ technical specifications'
        },
        {
            insight: 'System Design interviews increased 45% YoY',
            confidence: 85,
            data: 'Tracked interview patterns from 2024 to 2025'
        }
    ],

    personalizationExamples: [{
            studentProfile: 'CSE Major, interested in Cloud',
            recommendation: 'Focus: AWS Architecture, Microservices, Kubernetes. Target: Amazon, Google Cloud, Azure teams',
            matchScore: 92
        },
        {
            studentProfile: 'Finance focused, Math strong',
            recommendation: 'Focus: Quantitative Analysis, Derivatives, Trading Systems. Target: Goldman Sachs, JP Morgan, Citadel',
            matchScore: 88
        },
        {
            studentProfile: 'Product/Business inclined',
            recommendation: 'Focus: Analytics, Communication, Business Sense. Target: Google PM, Microsoft PM, Deloitte Consulting',
            matchScore: 85
        }
    ]
};