import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, Users, BookOpen, Globe, Filter, ChevronDown, ChevronUp, X, Heart, Eye, Calendar, Award, Building2, TrendingUp, CheckCircle, ExternalLink, SlidersHorizontal, Bell, Grid, List, MessageCircle, Zap, Bot, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import HeaderAuth from '../components/HeaderAuth';

const EstablishmentsListing = () => {
  const [searchParams] = useSearchParams();
  const [language, setLanguage] = useState('en');
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('programs'); // 'establishments' or 'programs'
  const [selectedFilters, setSelectedFilters] = useState({
    country: '',
    city: '',
    studyLevel: '',
    subject: '',
    startYear: '',
    studyType: '',
    universityType: '',
    nationality: '',
    residenceCountry: '',
    academicQualification: '',
    englishTest: '',
    standardizedTest: '',
    waiver: false
  });
  const [expandedSections, setExpandedSections] = useState({
    studentDetails: true,
    studyPreference: true,
    detailedFilters: false
  });
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true);
  
  // University type utility functions
  const getUniversityTypeInfo = (establishment) => {
    const { universityType, countrySpecific, commissionRate, freeApplications, visaSupport } = establishment;
    
    if (universityType === "A") {
      return {
        type: "Type A",
        color: "green",
        icon: "💰",
        description: `3 free applications available`,
        freeApps: freeApplications,
        visaSupport: visaSupport === "free" ? "Free visa support" : "Paid visa support",
        serviceFees: "Free for first 3 applications"
      };
    } else if (universityType === "B") {
      return {
        type: "Type B",
        color: "blue",
        icon: "🏛️",
        description: "Service fee required for application",
        freeApps: 0,
        visaSupport: "Paid service",
        serviceFees: "Service fee per application"
      };
    } else if (universityType === "C") {
      const countryType = countrySpecific?.type;
      if (countryType === "france") {
        return {
          type: "Type C",
          color: "purple",
          icon: "🇫🇷",
          description: "Campus France & Parcoursup procedure management",
          freeApps: 0,
          visaSupport: "Paid service",
          serviceFees: "Service fee for procedure management"
        };
      } else if (countryType === "china") {
        return {
          type: "Type C",
          color: "red",
          icon: "🇨🇳",
          description: "Chinese admission procedure management",
          freeApps: 0,
          visaSupport: "Free if accepted",
          serviceFees: "Service fee for procedure management"
        };
      } else {
        return {
          type: "Type C",
          color: "orange",
          icon: "📋",
          description: "Special admission procedure management",
          freeApps: 0,
          visaSupport: "Paid service",
          serviceFees: "Service fee for procedure management"
        };
      }
    }
    
    // Default fallback
    return {
      type: "Unknown",
      color: "gray",
      icon: "❓",
      description: "Unknown university type",
      freeApps: 0,
      visaSupport: "Unknown",
      serviceFees: "Unknown"
    };
  };

  const getServiceFee = (establishment) => {
    const { universityType, countrySpecific } = establishment;
    
    if (universityType === "A") {
      return { 
        amount: "Free", 
        originalAmount: "$50",
        description: "First 3 applications free",
        showStrikethrough: true
      };
    } else if (universityType === "B") {
      return { 
        amount: "$100", 
        description: "Service fee per application",
        showStrikethrough: false
      };
    } else if (universityType === "C") {
      const countryType = countrySpecific?.type;
      if (countryType === "france") {
        return { 
          amount: "€150", 
          description: "Campus France procedure management",
          showStrikethrough: false
        };
      } else if (countryType === "china") {
        return { 
          amount: "¥800", 
          description: "Chinese procedure management",
          showStrikethrough: false
        };
      } else {
        return { 
          amount: "$150", 
          description: "Special procedure management",
          showStrikethrough: false
        };
      }
    }
    
    // Default fallback
    return {
      amount: "Unknown",
      description: "Unknown service fee",
      showStrikethrough: false
    };
  };
  
  // Detailed filters state
  const [detailedFilters, setDetailedFilters] = useState({
    academicQualification: '',
    awardingBoard: '',
    grade: '',
    gradeType: 'CGPA 4',
    englishTest: '',
    englishScore: '',
    standardizedTest: '',
    standardizedScore: '',
    studyGap: '',
    minFees: 0,
    maxFees: 300000
  });

  // Handle URL parameters for university filtering
  useEffect(() => {
    const universityParam = searchParams.get('university');
    if (universityParam) {
      setSearchQuery(universityParam);
      setActiveTab('programs'); // Switch to programs tab when filtering by university
    }
  }, [searchParams]);

  // Sample data for establishments with enhanced information
  const establishments = [
    {
      id: 1,
      name: "University of Toronto",
      country: "Canada",
      city: "Toronto",
      type: "Public",
      rating: 4.8,
      students: 97000,
      programs: 700,
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Utoronto_coa.svg/1200px-Utoronto_coa.svg.png",
      description: "One of Canada's leading research universities, offering world-class education in diverse fields.",
      featured: true,
      sponsored: false,
      tuition: "$6,100 - $58,160",
      tuitionRange: { min: 6100, max: 58160, currency: "USD" },
      acceptanceRate: "43%",
      worldRanking: 18,
      qsRanking: 18,
      rankings: {
        qs: 18,
        times: 22,
        arwu: 25,
        usNews: 20
      },
      popularPrograms: ["Computer Science", "Business", "Engineering"],
      applicationDeadline: "January 15, 2025",
      scholarships: true,
      housing: true,
      language: "English",
      aidvisorRecommended: true,
      easyApply: true,
      // University type information
      universityType: "A", // "A", "B", or "C"
      commissionRate: "5-15%",
      freeApplications: 3, // Number of free applications for Type A schools
      visaSupport: "free", // "free" or "paid"
      countrySpecific: {
        type: "standard", // "standard", "france", "china", "parcoursup"
        requirements: []
      }
    },
    {
      id: 2,
      name: "Sorbonne University",
      country: "France",
      city: "Paris",
      type: "Public",
      rating: 4.6,
      students: 55000,
      programs: 200,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sorbonne_University_logo.svg/1200px-Sorbonne_University_logo.svg.png",
      description: "Historic university in the heart of Paris, renowned for humanities and social sciences.",
      featured: false,
      sponsored: true,
      tuition: "€170 - €3,770",
      tuitionRange: { min: 170, max: 3770, currency: "EUR" },
      acceptanceRate: "12%",
      worldRanking: 83,
      qsRanking: 83,
      rankings: {
        qs: 83,
        times: 95,
        arwu: 78,
        usNews: 89
      },
      popularPrograms: ["Literature", "History", "Philosophy"],
      applicationDeadline: "March 1, 2025",
      scholarships: true,
      housing: false,
      language: "French",
      aidvisorRecommended: false,
      easyApply: true,
      // University type information
      universityType: "C", // "A", "B", or "C"
      commissionRate: "0%",
      freeApplications: 0, // No free applications for Type C schools
      visaSupport: "paid", // "free" or "paid"
      countrySpecific: {
        type: "france", // "standard", "france", "china", "parcoursup"
        requirements: ["Campus France", "Parcoursup"]
      }
    },
    {
      id: 3,
      name: "MIT",
      country: "United States",
      city: "Cambridge",
      type: "Private",
      rating: 4.9,
      students: 12000,
      programs: 50,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png",
      description: "World-renowned institute of technology, leading in engineering and computer science.",
      featured: true,
      sponsored: false,
      tuition: "$57,986",
      tuitionRange: { min: 57986, max: 57986, currency: "USD" },
      acceptanceRate: "7%",
      worldRanking: 1,
      qsRanking: 1,
      rankings: {
        qs: 1,
        times: 2,
        arwu: 1,
        usNews: 1
      },
      popularPrograms: ["Computer Science", "Engineering", "Physics"],
      applicationDeadline: "January 1, 2025",
      scholarships: true,
      housing: true,
      language: "English",
      aidvisorRecommended: true,
      easyApply: false,
      // University type information
      universityType: "B", // "A", "B", or "C"
      commissionRate: "0%",
      freeApplications: 0, // No free applications for Type B schools
      visaSupport: "paid", // "free" or "paid"
      countrySpecific: {
        type: "standard", // "standard", "france", "china", "parcoursup"
        requirements: []
      }
    },
    {
      id: 4,
      name: "University of Melbourne",
      country: "Australia",
      city: "Melbourne",
      type: "Public",
      rating: 4.7,
      students: 50000,
      programs: 300,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/University_of_Melbourne_logo.svg/1200px-University_of_Melbourne_logo.svg.png",
      description: "Australia's leading research university, offering comprehensive programs across all disciplines.",
      featured: false,
      sponsored: false,
      tuition: "A$37,728 - A$64,512",
      tuitionRange: { min: 37728, max: 64512, currency: "AUD" },
      acceptanceRate: "70%",
      worldRanking: 33,
      qsRanking: 33,
      rankings: {
        qs: 33,
        times: 45,
        arwu: 35,
        usNews: 38
      },
      popularPrograms: ["Medicine", "Law", "Business"],
      applicationDeadline: "October 31, 2024",
      scholarships: true,
      housing: true,
      language: "English",
      aidvisorRecommended: true,
      easyApply: true,
      // University type information
      universityType: "A", // "A", "B", or "C"
      commissionRate: "8-12%",
      freeApplications: 3, // Number of free applications for Type A schools
      visaSupport: "free", // "free" or "paid"
      countrySpecific: {
        type: "standard", // "standard", "france", "china", "parcoursup"
        requirements: []
      }
    },
    {
      id: 5,
      name: "ETH Zurich",
      country: "Switzerland",
      city: "Zurich",
      type: "Public",
      rating: 4.8,
      students: 20000,
      programs: 100,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/ETH_Zurich_logo.svg/1200px-ETH_Zurich_logo.svg.png",
      description: "Swiss Federal Institute of Technology, world leader in science and technology.",
      featured: true,
      sponsored: false,
      tuition: "CHF 730",
      tuitionRange: { min: 730, max: 730, currency: "CHF" },
      acceptanceRate: "27%",
      worldRanking: 6,
      qsRanking: 6,
      rankings: {
        qs: 6,
        times: 8,
        arwu: 4,
        usNews: 7
      },
      popularPrograms: ["Engineering", "Computer Science", "Mathematics"],
      applicationDeadline: "December 15, 2024",
      scholarships: true,
      housing: true,
      language: "German/English",
      aidvisorRecommended: true,
      easyApply: true,
      // University type information
      universityType: "B", // "A", "B", or "C"
      commissionRate: "0%",
      freeApplications: 0, // No free applications for Type B schools
      visaSupport: "paid", // "free" or "paid"
      countrySpecific: {
        type: "standard", // "standard", "france", "china", "parcoursup"
        requirements: []
      }
    },
    {
      id: 6,
      name: "University of Tokyo",
      country: "Japan",
      city: "Tokyo",
      type: "Public",
      rating: 4.5,
      students: 28000,
      programs: 150,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/University_of_Tokyo_logo.svg/1200px-University_of_Tokyo_logo.svg.png",
      description: "Japan's premier university, combining traditional values with cutting-edge research.",
      featured: false,
      sponsored: true,
      tuition: "¥535,800",
      tuitionRange: { min: 535800, max: 535800, currency: "JPY" },
      acceptanceRate: "21%",
      worldRanking: 23,
      qsRanking: 23,
      rankings: {
        qs: 23,
        times: 28,
        arwu: 20,
        usNews: 25
      },
      popularPrograms: ["Engineering", "Medicine", "Economics"],
      applicationDeadline: "January 4, 2025",
      scholarships: true,
      housing: true,
      language: "Japanese/English",
      aidvisorRecommended: false,
      easyApply: true,
      // University type information
      universityType: "B", // "A", "B", or "C"
      commissionRate: "0%",
      freeApplications: 0, // No free applications for Type B schools
      visaSupport: "paid", // "free" or "paid"
      countrySpecific: {
        type: "standard", // "standard", "france", "china", "parcoursup"
        requirements: []
      }
    },
    {
      id: 7,
      name: "Tsinghua University",
      country: "China",
      city: "Beijing",
      type: "Public",
      rating: 4.6,
      students: 45000,
      programs: 200,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tsinghua_University_logo.svg/1200px-Tsinghua_University_logo.svg.png",
      description: "China's leading university, renowned for engineering and technology programs.",
      featured: true,
      sponsored: false,
      tuition: "¥26,000 - ¥40,000",
      tuitionRange: { min: 26000, max: 40000, currency: "CNY" },
      acceptanceRate: "15%",
      worldRanking: 14,
      qsRanking: 14,
      rankings: {
        qs: 14,
        times: 16,
        arwu: 12,
        usNews: 18
      },
      popularPrograms: ["Engineering", "Computer Science", "Business"],
      applicationDeadline: "December 31, 2024",
      scholarships: true,
      housing: true,
      language: "Chinese/English",
      aidvisorRecommended: true,
      easyApply: true,
      // University type information
      universityType: "C", // "A", "B", or "C"
      commissionRate: "0%",
      freeApplications: 0, // No free applications for Type C schools
      visaSupport: "free", // Free visa support if accepted
      countrySpecific: {
        type: "china", // "standard", "france", "china", "parcoursup"
        requirements: ["Chinese Language Test", "Academic Records"]
      }
    }
  ];

  // Sample data for programs
  const programs = [
    {
      id: 1,
      name: "Master of Computer Science",
      university: "University of Toronto",
      country: "Canada",
      city: "Toronto",
      degree: "Master's",
      duration: "2 years",
      language: "English",
      tuition: "$58,160",
      startDate: "September 2025",
      applicationDeadline: "January 15, 2025",
      description: "Advanced program in computer science with focus on AI and machine learning.",
      requirements: ["Bachelor's in CS", "IELTS 7.0", "GRE 320+"],
      scholarships: true,
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Utoronto_coa.svg/1200px-Utoronto_coa.svg.png",
      featured: true,
      aidvisorRecommended: true,
      easyApply: true,
      ranking: 18,
      studyType: "on-campus",
      universityType: "A"
    },
    {
      id: 2,
      name: "Bachelor of Medicine",
      university: "Sorbonne University",
      country: "France",
      city: "Paris",
      degree: "Bachelor's",
      duration: "6 years",
      language: "French",
      tuition: "€3,770",
      startDate: "September 2025",
      applicationDeadline: "March 1, 2025",
      description: "Comprehensive medical program with clinical rotations and research opportunities.",
      requirements: ["High School Diploma", "DELF B2", "Medical Entrance Exam"],
      scholarships: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sorbonne_University_logo.svg/1200px-Sorbonne_University_logo.svg.png",
      featured: false,
      aidvisorRecommended: false,
      easyApply: true,
      ranking: 83,
      studyType: "on-campus",
      universityType: "C"
    },
    {
      id: 3,
      name: "PhD in Engineering",
      university: "MIT",
      country: "United States",
      city: "Cambridge",
      degree: "PhD",
      duration: "4-5 years",
      language: "English",
      tuition: "$57,986",
      startDate: "September 2025",
      applicationDeadline: "December 15, 2024",
      description: "Research-focused doctoral program in various engineering disciplines.",
      requirements: ["Master's Degree", "TOEFL 100+", "GRE 330+", "Research Proposal"],
      scholarships: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png",
      featured: true,
      aidvisorRecommended: true,
      easyApply: false,
      ranking: 1,
      studyType: "hybrid"
    },
    {
      id: 4,
      name: "Master of Business Administration",
      university: "University of Melbourne",
      country: "Australia",
      city: "Melbourne",
      degree: "Master's",
      duration: "2 years",
      language: "English",
      tuition: "A$64,512",
      startDate: "February 2025",
      applicationDeadline: "October 31, 2024",
      description: "World-class MBA program with international focus and networking opportunities.",
      requirements: ["Bachelor's Degree", "GMAT 650+", "IELTS 7.0", "Work Experience"],
      scholarships: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/University_of_Melbourne_logo.svg/1200px-University_of_Melbourne_logo.svg.png",
      featured: false,
      aidvisorRecommended: true,
      easyApply: true,
      ranking: 33,
      studyType: "online",
      universityType: "A"
    },
    {
      id: 5,
      name: "Bachelor of Computer Science",
      university: "ETH Zurich",
      country: "Switzerland",
      city: "Zurich",
      degree: "Bachelor's",
      duration: "3 years",
      language: "German/English",
      tuition: "CHF 730",
      startDate: "September 2025",
      applicationDeadline: "April 30, 2025",
      description: "Rigorous computer science program with strong mathematical foundation.",
      requirements: ["High School Diploma", "German B2", "Mathematics Proficiency"],
      scholarships: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/ETH_Zurich_logo.svg/1200px-ETH_Zurich_logo.svg.png",
      featured: true,
      aidvisorRecommended: true,
      easyApply: true,
      ranking: 6,
      studyType: "on-campus",
      universityType: "B"
    },
    {
      id: 6,
      name: "Master of International Relations",
      university: "University of Tokyo",
      country: "Japan",
      city: "Tokyo",
      degree: "Master's",
      duration: "2 years",
      language: "Japanese/English",
      tuition: "¥535,800",
      startDate: "April 2025",
      applicationDeadline: "January 4, 2025",
      description: "Comprehensive program covering global politics, economics, and diplomacy.",
      requirements: ["Bachelor's Degree", "JLPT N2", "TOEFL 90+", "Statement of Purpose"],
      scholarships: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/University_of_Tokyo_logo.svg/1200px-University_of Tokyo_logo.svg.png",
      featured: false,
      aidvisorRecommended: false,
      easyApply: true,
      ranking: 23,
      studyType: "hybrid"
    }
  ];

  const countries = [
    { value: 'canada', label: language === 'en' ? 'Canada' : 'Canada' },
    { value: 'france', label: language === 'en' ? 'France' : 'France' },
    { value: 'usa', label: language === 'en' ? 'United States' : 'États-Unis' },
    { value: 'australia', label: language === 'en' ? 'Australia' : 'Australie' },
    { value: 'switzerland', label: language === 'en' ? 'Switzerland' : 'Suisse' },
    { value: 'japan', label: language === 'en' ? 'Japan' : 'Japon' },
    { value: 'germany', label: language === 'en' ? 'Germany' : 'Allemagne' },
    { value: 'uk', label: language === 'en' ? 'United Kingdom' : 'Royaume-Uni' }
  ];

  const studyLevels = [
    { value: 'bachelor', label: language === 'en' ? 'Bachelor\'s Degree' : 'Licence' },
    { value: 'master', label: language === 'en' ? 'Master\'s Degree' : 'Master' },
    { value: 'phd', label: language === 'en' ? 'PhD' : 'Doctorat' },
    { value: 'diploma', label: language === 'en' ? 'Diploma' : 'Diplôme' },
    { value: 'certificate', label: language === 'en' ? 'Certificate' : 'Certificat' }
  ];

  const subjects = [
    { value: 'computer-science', label: language === 'en' ? 'Computer Science' : 'Informatique' },
    { value: 'engineering', label: language === 'en' ? 'Engineering' : 'Ingénierie' },
    { value: 'business', label: language === 'en' ? 'Business' : 'Commerce' },
    { value: 'medicine', label: language === 'en' ? 'Medicine' : 'Médecine' },
    { value: 'law', label: language === 'en' ? 'Law' : 'Droit' },
    { value: 'arts', label: language === 'en' ? 'Arts' : 'Arts' },
    { value: 'sciences', label: language === 'en' ? 'Sciences' : 'Sciences' }
  ];

  const startYears = [2025, 2026, 2027];

  const studyTypes = [
    { value: 'on-campus', label: language === 'en' ? '100% On-Campus' : '100% Présentiel' },
    { value: 'hybrid', label: language === 'en' ? 'Hybrid' : 'Hybride' },
    { value: 'online', label: language === 'en' ? '100% Online' : '100% En ligne' }
  ];

  // Detailed filter options
  const academicQualifications = [
    { value: 'high-school', label: language === 'en' ? 'High School Diploma' : 'Baccalauréat' },
    { value: 'bachelor', label: language === 'en' ? 'Bachelor\'s Degree' : 'Licence' },
    { value: 'master', label: language === 'en' ? 'Master\'s Degree' : 'Master' },
    { value: 'phd', label: language === 'en' ? 'PhD' : 'Doctorat' }
  ];

  const awardingBoards = [
    { value: 'morocco', label: 'Morocco' },
    { value: 'france', label: 'France' },
    { value: 'usa', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'canada', label: 'Canada' }
  ];

  const gradeTypes = [
    { value: 'CGPA 4', label: 'CGPA 4' },
    { value: 'CGPA 5', label: 'CGPA 5' },
    { value: 'CGPA 7', label: 'CGPA 7' },
    { value: 'CGPA 10', label: 'CGPA 10' },
    { value: 'Percentage', label: 'Percentage' },
    { value: '20', label: '20' }
  ];

  const englishTests = [
    { value: 'duolingo', label: 'Duolingo', range: '10-160', steps: 5 },
    { value: 'ielts', label: 'IELTS', range: '0-9', steps: 0.5 },
    { value: 'toefl', label: 'TOEFL', range: '0-120', steps: 1 },
    { value: 'pte', label: 'PTE', range: '10-90', steps: 1 }
  ];

  const standardizedTests = [
    { value: 'lsat', label: 'LSAT', range: '120-180', steps: 1 },
    { value: 'act', label: 'ACT', range: '1-36', steps: 1 },
    { value: 'gmat', label: 'GMAT', range: '200-800', steps: 10 },
    { value: 'gre', label: 'GRE', range: '130-170', steps: 1 },
    { value: 'sat', label: 'SAT', range: '400-1600', steps: 10 }
  ];

  const studyGaps = [
    { value: 'less-than-1', label: language === 'en' ? 'Less Than 1 Year' : 'Moins d\'1 an' },
    { value: '1-to-2', label: language === 'en' ? '1 To 2 Years' : '1 à 2 ans' },
    { value: '2-to-5', label: language === 'en' ? '2 To 5 Years' : '2 à 5 ans' },
    { value: 'greater-than-5', label: language === 'en' ? 'Greater Than 5 Years' : 'Plus de 5 ans' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filter, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      country: '',
      city: '',
      studyLevel: '',
      subject: '',
      startYear: '',
      studyType: '',
      universityType: '',
      nationality: '',
      residenceCountry: '',
      academicQualification: '',
      englishTest: '',
      standardizedTest: '',
      waiver: false
    });
    setDetailedFilters({
      academicQualification: '',
      awardingBoard: '',
      grade: '',
      gradeType: 'CGPA 4',
      englishTest: '',
      englishScore: '',
      standardizedTest: '',
      standardizedScore: '',
      studyGap: '',
      minFees: 0,
      maxFees: 300000
    });
  };

  const handleDetailedFilterChange = (filterName, value) => {
    setDetailedFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filteredEstablishments = establishments.filter(establishment => {
    const matchesSearch = establishment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         establishment.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         establishment.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCountry = !selectedFilters.country || establishment.country.toLowerCase() === selectedFilters.country;
    
    const matchesUniversityType = !selectedFilters.universityType || (() => {
      if (selectedFilters.universityType === 'A') {
        return establishment.universityType === 'A';
      } else if (selectedFilters.universityType === 'B') {
        return establishment.universityType === 'B';
      } else if (selectedFilters.universityType === 'C') {
        return establishment.universityType === 'C';
      }
      return true;
    })();
    
    return matchesSearch && matchesCountry && matchesUniversityType;
  });

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCountry = !selectedFilters.country || program.country.toLowerCase() === selectedFilters.country;
    const matchesStudyLevel = !selectedFilters.studyLevel || program.degree.toLowerCase().includes(selectedFilters.studyLevel);
    const matchesSubject = !selectedFilters.subject || program.name.toLowerCase().includes(selectedFilters.subject);
    const matchesStudyType = !selectedFilters.studyType || program.studyType === selectedFilters.studyType;
    
    return matchesSearch && matchesCountry && matchesStudyLevel && matchesSubject && matchesStudyType;
  });

  const seoData = {
    title: language === 'en' 
      ? 'Universities & Programs - Find Your Perfect Study Abroad Option | E-TAWJIHI Global' 
      : 'Universités & Programmes - Trouvez Votre Option d\'Études à l\'Étranger Parfaite | E-TAWJIHI Global',
    description: language === 'en'
      ? 'Search and compare universities and programs worldwide. Find the perfect study abroad option with detailed information, rankings, and admission requirements.'
      : 'Recherchez et comparez les universités et programmes du monde entier. Trouvez l\'option d\'études à l\'étranger parfaite avec des informations détaillées, classements et exigences d\'admission.',
    keywords: language === 'en'
      ? 'universities, study programs, study abroad, international education, university search, program comparison, admission requirements, university rankings'
      : 'universités, programmes d\'études, études à l\'étranger, éducation internationale, recherche universitaire, comparaison programmes, exigences admission, classements universitaires',
    canonical: 'https://e-tawjihi-global.com/establishments',
    ogType: 'website',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": language === 'en' ? "Universities & Programs Search" : "Recherche Universités & Programmes",
      "description": language === 'en' 
        ? "Search and compare universities and programs worldwide for international education"
        : "Recherchez et comparez les universités et programmes du monde entier pour l'éducation internationale",
      "url": "https://e-tawjihi-global.com/establishments",
      "mainEntity": {
        "@type": "ItemList",
        "name": language === 'en' ? "Universities and Programs" : "Universités et Programmes",
        "itemListElement": establishments.slice(0, 10).map((establishment, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "EducationalOrganization",
            "name": establishment.name,
            "description": establishment.description,
            "url": establishment.website,
            "address": {
              "@type": "PostalAddress",
              "addressCountry": establishment.country,
              "addressLocality": establishment.city
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": language === 'en' ? "Programs" : "Programmes",
              "numberOfItems": establishment.programs || 0
            }
          }
        }))
      }
    },
    alternateLanguages: [
      { code: 'en', url: 'https://e-tawjihi-global.com/establishments' },
      { code: 'fr', url: 'https://e-tawjihi-global.com/fr/establishments' }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <SEO {...seoData} language={language} />
      {/* Enhanced Authenticated Header */}
      <HeaderAuth language={language} setLanguage={setLanguage} />



      <div className="flex flex-col xl:flex-row max-w-[1600px] mx-auto pt-4 sm:pt-8 relative z-10">
        {/* Enhanced Filters Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} xl:block w-full xl:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 m-2 sm:m-4 xl:m-0 xl:ml-4 ${isFiltersCollapsed ? 'h-auto' : 'h-[calc(100vh-150px)] sm:h-[calc(100vh-200px)]'} overflow-y-auto scrollbar-hide xl:sticky xl:top-24 xl:h-[calc(100vh-120px)] xl:overflow-y-auto xl:filters-scrollbar`}>
          <div className="p-6">
            {/* E-DVISOR Help Section - Always Visible */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {language === 'en' ? 'E-DVISOR' : 'E-DVISOR'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {language === 'en' ? 'AI Assistant' : 'Assistant IA'}
                  </p>
                </div>
                <div className="ml-auto">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                {language === 'en' 
                  ? 'E-DVISOR is here to help you find the perfect university match!'
                  : 'E-DVISOR est là pour vous aider à trouver l\'université parfaite !'
                }
              </p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>{language === 'en' ? 'Get AI Recommendations' : 'Obtenir des Recommandations IA'}</span>
              </button>
            </div>

            {/* University Types Information */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 mb-6 border border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-lg">🎓</span>
                {language === 'en' ? 'University Types' : 'Types d\'Universités'}
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">💰</span>
                  <span><strong>{language === 'en' ? 'Type A:' : 'Type A:'}</strong> {language === 'en' ? '3 free applications available' : '3 candidatures gratuites disponibles'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🏛️</span>
                  <span><strong>{language === 'en' ? 'Type B:' : 'Type B:'}</strong> {language === 'en' ? 'Service fee required for application ($100)' : 'Frais de service requis pour candidature ($100)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">📋</span>
                  <span><strong>{language === 'en' ? 'Type C:' : 'Type C:'}</strong> {language === 'en' ? 'Special admission procedure management' : 'Gestion de procédure d\'admission spéciale'}</span>
                </div>
              </div>
            </div>

            {/* Collapse Toggle Button - Mobile Only */}
            <div className="mb-4 flex justify-center xl:hidden">
              <button
                onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm ${
                  isFiltersCollapsed 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {isFiltersCollapsed ? (
                  <>
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>{language === 'en' ? 'Show Filters' : 'Afficher les Filtres'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>{language === 'en' ? 'Hide Filters' : 'Masquer les Filtres'}</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Filters Header */}
            {!isFiltersCollapsed && (
            <div className="flex items-center justify-between mb-6 xl:flex">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  {language === 'en' ? 'Advanced Filters' : 'Filtres Avancés'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {language === 'en' ? 'Clear All' : 'Tout effacer'}
                </button>
              </div>
            </div>)}

            {/* Enhanced Search Bar */}
            <div className={`mb-6 ${!isFiltersCollapsed ? 'block' : 'hidden'} xl:block`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search universities...' : 'Rechercher des universités...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className={`mb-6 ${!isFiltersCollapsed ? 'block' : 'hidden'} xl:block`}>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {language === 'en' ? 'Quick Filters' : 'Filtres Rapides'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  <Award className="w-4 h-4" />
                  <span>{language === 'en' ? 'Top Ranked' : 'Top Classé'}</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>{language === 'en' ? 'Popular' : 'Populaire'}</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>{language === 'en' ? 'Scholarships' : 'Bourses'}</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium">
                  <Building2 className="w-4 h-4" />
                  <span>{language === 'en' ? 'Housing' : 'Logement'}</span>
                </button>
              </div>
            </div>

            {/* Study Preference Section */}
            <div className={`mb-6 ${!isFiltersCollapsed ? 'block' : 'hidden'} xl:block`}>
              <button
                onClick={() => toggleSection('studyPreference')}
                className="flex items-center justify-between w-full py-3 text-left bg-gray-50 rounded-xl px-4 hover:bg-gray-100 transition-colors"
              >
                <span className="flex items-center gap-2 text-base font-semibold text-gray-800">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  {language === 'en' ? 'Study Preferences' : 'Préférences d\'Études'}
                </span>
                {expandedSections.studyPreference ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              
              {expandedSections.studyPreference && (
                <div className="mt-4 space-y-4">
                  {/* Study Destination */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Study Destination' : 'Destination d\'Études'}
                    </label>
                    <select
                      value={selectedFilters.country}
                      onChange={(e) => handleFilterChange('country', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                    >
                      <option value="">{language === 'en' ? 'All Countries' : 'Tous les Pays'}</option>
                      {countries.map(country => (
                        <option key={country.value} value={country.value}>{country.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Study Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Study Level' : 'Niveau d\'Études'}
                    </label>
                    <select
                      value={selectedFilters.studyLevel}
                      onChange={(e) => handleFilterChange('studyLevel', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                    >
                      <option value="">{language === 'en' ? 'All Levels' : 'Tous les Niveaux'}</option>
                      {studyLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Start Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Start Year' : 'Année de Début'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {startYears.map(year => (
                        <button
                          key={year}
                          onClick={() => handleFilterChange('startYear', selectedFilters.startYear === year ? '' : year)}
                          className={`px-4 py-2 text-sm rounded-full border transition-all ${
                            selectedFilters.startYear === year
                              ? 'bg-blue-800 text-white border-blue-800 shadow-md'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subjects */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Field of Study' : 'Domaine d\'Études'}
                    </label>
                    <select
                      value={selectedFilters.subject}
                      onChange={(e) => handleFilterChange('subject', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                    >
                      <option value="">{language === 'en' ? 'All Fields' : 'Tous les Domaines'}</option>
                      {subjects.map(subject => (
                        <option key={subject.value} value={subject.value}>{subject.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Study Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Study Type' : 'Type d\'Étude'}
                    </label>
                    <select
                      value={selectedFilters.studyType}
                      onChange={(e) => handleFilterChange('studyType', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                    >
                      <option value="">{language === 'en' ? 'All Types' : 'Tous les Types'}</option>
                      {studyTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* University Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'University Type' : 'Type d\'Université'}
                    </label>
                    <select
                      value={selectedFilters.universityType || ''}
                      onChange={(e) => handleFilterChange('universityType', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                    >
                      <option value="">{language === 'en' ? 'All Types' : 'Tous les Types'}</option>
                      <option value="A">{language === 'en' ? '💰 Type A: 3 free applications available' : '💰 Type A: 3 candidatures gratuites disponibles'}</option>
                      <option value="B">{language === 'en' ? '🏛️ Type B: Service fee required for application' : '🏛️ Type B: Frais de service requis pour candidature'}</option>
                      <option value="C">{language === 'en' ? '📋 Type C: Special admission procedure management' : '📋 Type C: Gestion de procédure d\'admission spéciale'}</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Filters Section */}
            <div className={`mb-6 ${!isFiltersCollapsed ? 'block' : 'hidden'} xl:block`}>
              <button
                onClick={() => toggleSection('detailedFilters')}
                className="flex items-center justify-between w-full py-3 text-left bg-gray-50 rounded-xl px-4 hover:bg-gray-100 transition-colors"
              >
                <span className="flex items-center gap-2 text-base font-semibold text-gray-800">
                  <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                  {language === 'en' ? 'Detailed Filters' : 'Filtres Détaillés'}
                </span>
                {expandedSections.detailedFilters ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              
              {expandedSections.detailedFilters && (
                <div className="mt-4 space-y-6">
                  {/* Academic Qualification */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      {language === 'en' ? 'Academic Qualification' : 'Qualification Académique'}
                    </h3>
                    <div className="space-y-4">
                      {/* Applying for */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Applying for' : 'Candidature pour'}
                        </label>
                        <select
                          value={detailedFilters.academicQualification}
                          onChange={(e) => handleDetailedFilterChange('academicQualification', e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        >
                          <option value="">{language === 'en' ? 'Select Level' : 'Sélectionner le niveau'}</option>
                          <option value="undergraduate">{language === 'en' ? 'Undergraduate' : 'Premier cycle'}</option>
                          <option value="graduate">{language === 'en' ? 'Graduate' : 'Deuxième cycle'}</option>
                        </select>
                      </div>

                      {/* Highest Qualification */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Highest Qualification' : 'Plus haute qualification'}
                        </label>
                        <select
                          value={detailedFilters.academicQualification}
                          onChange={(e) => handleDetailedFilterChange('academicQualification', e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        >
                          <option value="">{language === 'en' ? 'Select Qualification' : 'Sélectionner la qualification'}</option>
                          {academicQualifications.map(qual => (
                            <option key={qual.value} value={qual.value}>{qual.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Country of Education */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Country of Education' : 'Pays d\'éducation'}
                        </label>
                        <select
                          value={detailedFilters.awardingBoard}
                          onChange={(e) => handleDetailedFilterChange('awardingBoard', e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        >
                          <option value="">{language === 'en' ? 'Select Country' : 'Sélectionner le pays'}</option>
                          {awardingBoards.map(board => (
                            <option key={board.value} value={board.value}>{board.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Awarding Board */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Awarding Board' : 'Organisme délivrant'}
                        </label>
                        <input
                          type="text"
                          value={detailedFilters.awardingBoard}
                          onChange={(e) => handleDetailedFilterChange('awardingBoard', e.target.value)}
                          placeholder={language === 'en' ? 'Enter awarding board' : 'Saisir l\'organisme délivrant'}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        />
                      </div>

                      {/* Grade */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Grade' : 'Note'}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={detailedFilters.grade}
                            onChange={(e) => handleDetailedFilterChange('grade', e.target.value)}
                            placeholder={language === 'en' ? 'Enter Score' : 'Saisir la note'}
                            className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                          />
                          <select
                            value={detailedFilters.gradeType}
                            onChange={(e) => handleDetailedFilterChange('gradeType', e.target.value)}
                            className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                          >
                            {gradeTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* English Language Test */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      {language === 'en' ? 'English Language Test' : 'Test de Langue Anglaise'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Test Type' : 'Type de test'}
                        </label>
                        <select
                          value={detailedFilters.englishTest}
                          onChange={(e) => handleDetailedFilterChange('englishTest', e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        >
                          <option value="">{language === 'en' ? 'Select Test' : 'Sélectionner le test'}</option>
                          {englishTests.map(test => (
                            <option key={test.value} value={test.value}>{test.label}</option>
                          ))}
                        </select>
                      </div>
                      {detailedFilters.englishTest && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            {language === 'en' ? 'Score' : 'Score'} ({englishTests.find(t => t.value === detailedFilters.englishTest)?.range})
                          </label>
                          <input
                            type="number"
                            value={detailedFilters.englishScore}
                            onChange={(e) => handleDetailedFilterChange('englishScore', e.target.value)}
                            placeholder={language === 'en' ? 'Enter Score' : 'Saisir le score'}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Standardized Test */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      {language === 'en' ? 'Standardized Test' : 'Test Standardisé'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Test Type' : 'Type de test'}
                        </label>
                        <select
                          value={detailedFilters.standardizedTest}
                          onChange={(e) => handleDetailedFilterChange('standardizedTest', e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        >
                          <option value="">{language === 'en' ? 'Select Test' : 'Sélectionner le test'}</option>
                          {standardizedTests.map(test => (
                            <option key={test.value} value={test.value}>{test.label}</option>
                          ))}
                        </select>
                      </div>
                      {detailedFilters.standardizedTest && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            {language === 'en' ? 'Score' : 'Score'} ({standardizedTests.find(t => t.value === detailedFilters.standardizedTest)?.range})
                          </label>
                          <input
                            type="number"
                            value={detailedFilters.standardizedScore}
                            onChange={(e) => handleDetailedFilterChange('standardizedScore', e.target.value)}
                            placeholder={language === 'en' ? 'Enter Score' : 'Saisir le score'}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Study Gap */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      {language === 'en' ? 'Study Gap' : 'Interruption d\'Études'}
                    </h3>
                    <select
                      value={detailedFilters.studyGap}
                      onChange={(e) => handleDetailedFilterChange('studyGap', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                    >
                      <option value="">{language === 'en' ? 'Select Gap' : 'Sélectionner l\'interruption'}</option>
                      {studyGaps.map(gap => (
                        <option key={gap.value} value={gap.value}>{gap.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fees Range */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      {language === 'en' ? 'Fees Range' : 'Gamme de Frais'}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Min Fees' : 'Frais minimum'}
                        </label>
                        <input
                          type="number"
                          value={detailedFilters.minFees}
                          onChange={(e) => handleDetailedFilterChange('minFees', parseInt(e.target.value) || 0)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Max Fees' : 'Frais maximum'}
                        </label>
                        <input
                          type="number"
                          value={detailedFilters.maxFees}
                          onChange={(e) => handleDetailedFilterChange('maxFees', parseInt(e.target.value) || 300000)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-3 sm:p-6 xl:p-8">
          {/* Tabs */}
          <div className="mb-4 sm:mb-8">
            <div className="flex w-full bg-gray-100 rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setActiveTab('establishments')}
                className={`flex-1 py-3 sm:py-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 border ${
                  activeTab === 'establishments'
                    ? 'bg-white text-blue-800 shadow-sm border-blue-200'
                    : 'text-gray-600 hover:text-gray-800 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{language === 'en' ? 'Universities' : 'Universités'}</span>
              </button>
              <button
                onClick={() => setActiveTab('programs')}
                className={`flex-1 py-3 sm:py-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 border ${
                  activeTab === 'programs'
                    ? 'bg-white text-blue-800 shadow-sm border-blue-200'
                    : 'text-gray-600 hover:text-gray-800 border-gray-200 hover:border-gray-300'
                }`}
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{language === 'en' ? 'Programs' : 'Programmes'}</span>
              </button>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-8 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {activeTab === 'establishments' 
                  ? (language === 'en' ? 'Top Universities' : 'Meilleures Universités')
                  : (language === 'en' ? 'Study Programs' : 'Programmes d\'Études')
                }
              </h2>
              <p className="text-gray-600">
                {activeTab === 'establishments' 
                  ? (language === 'en' 
                      ? `${filteredEstablishments.length} universities found` 
                      : `${filteredEstablishments.length} universités trouvées`)
                  : (language === 'en' 
                      ? `${filteredPrograms.length} programs found` 
                      : `${filteredPrograms.length} programmes trouvés`)
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sort Options */}
              <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium">
                <option>{language === 'en' ? 'Sort by: Ranking' : 'Trier par: Classement'}</option>
                <option>{language === 'en' ? 'Sort by: Rating' : 'Trier par: Note'}</option>
                <option>{language === 'en' ? 'Sort by: Tuition' : 'Trier par: Frais'}</option>
                <option>{language === 'en' ? 'Sort by: Popularity' : 'Trier par: Popularité'}</option>
              </select>
              
              {/* View Toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button className="px-3 py-2 bg-blue-800 text-white">
                  <Grid className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 bg-white text-gray-600 hover:bg-gray-50">
                  <List className="w-4 h-4" />
                </button>
              </div>
              
            </div>
          </div>

          {/* TOP 3 E-DVISOR Recommendations */}
          {activeTab === 'programs' && filteredPrograms.filter(p => p.aidvisorRecommended).length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-800">
                      {language === 'en' ? 'TOP 3 Recommendations from E-DVISOR' : 'TOP 3 Recommandations d\'E-DVISOR'}
                    </h3>
                    <p className="text-sm text-blue-600">
                      {language === 'en' 
                        ? 'AI-powered recommendations based on your profile and preferences.'
                        : 'Recommandations alimentées par l\'IA basées sur votre profil et préférences.'
                      }
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPrograms.filter(p => p.aidvisorRecommended).slice(0, 3).map(program => (
                    <Link key={program.id} to={`/programs/${program.id}`} className="block">
                      <div className="bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                        <div className="flex items-center gap-3 mb-2">
                          <img 
                            src={program.logo} 
                            alt={program.university}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{program.name}</h4>
                            <p className="text-xs text-gray-600">{program.university}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{program.degree}</span>
                          <div className="flex items-center gap-1">
                            {program.universityType === 'A' && (
                              <>
                                <span className="text-gray-400 line-through text-xs">$50</span>
                                <span className="text-green-600 font-semibold text-sm">Free</span>
                              </>
                            )}
                            {program.universityType !== 'A' && (
                              <span className="text-blue-600 font-semibold text-sm">
                                {program.universityType === 'B' ? '$100' : 
                                 program.universityType === 'C' ? (program.university.includes('Sorbonne') ? '€150' : '¥800') : '$100'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {activeTab === 'establishments' ? (
              /* Establishments Cards */
              filteredEstablishments.map(establishment => (
              <Link key={establishment.id} to={`/establishments/${establishment.id}`} className="block">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                {/* Enhanced Logo Section */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="logo-container">
                    <img
                      src={establishment.logo}
                      alt={establishment.name}
                      className="logo-image group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {establishment.aidvisorRecommended && (
                      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        {language === 'en' ? 'E-DVISOR Recommended' : 'Recommandé par E-DVISOR'}
                      </div>
                    )}
                    {establishment.featured && (
                      <div className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {language === 'en' ? 'Featured' : 'En vedette'}
                      </div>
                    )}
                    {establishment.sponsored && (
                      <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {language === 'en' ? 'Sponsored' : 'Sponsorisé'}
                      </div>
                    )}
                  </div>
                  
                  {/* World Ranking */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-gray-800">#{establishment.worldRanking}</span>
                  </div>
                  
                  {/* Rating */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-800">{establishment.rating}</span>
                  </div>
                </div>

                {/* Enhanced Content */}
                <div className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {establishment.name}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                        {establishment.city}, {establishment.country}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Globe className="w-4 h-4 mr-1" />
                        {establishment.language}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      establishment.type === 'Public' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {establishment.type}
                    </span>
                  </div>

                  {/* Key Information */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Tuition Range' : 'Gamme de frais'}</div>
                      <div className="text-sm font-semibold text-gray-800">{establishment.tuition}</div>
                      {establishment.tuitionRange.min !== establishment.tuitionRange.max && (
                        <div className="text-xs text-gray-500 mt-1">
                          {language === 'en' ? 'From' : 'À partir de'} {establishment.tuitionRange.min.toLocaleString()} {establishment.tuitionRange.currency}
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Acceptance Rate' : 'Taux d\'admission'}</div>
                      <div className="text-sm font-semibold text-gray-800">{establishment.acceptanceRate}</div>
                    </div>
                  </div>

                  {/* Rankings */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">{language === 'en' ? 'Global Rankings' : 'Classements Mondiaux'}</div>
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                        QS #{establishment.rankings.qs}
                      </div>
                      <div className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-medium">
                        Times #{establishment.rankings.times}
                      </div>
                      <div className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                        ARWU #{establishment.rankings.arwu}
                      </div>
                      <div className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs font-medium">
                        US News #{establishment.rankings.usNews}
                      </div>
                    </div>
                  </div>

                  {/* University Type Information */}
                  {(() => {
                    const typeInfo = getUniversityTypeInfo(establishment);
                    const serviceFee = getServiceFee(establishment);
                    return (
                      <div className="mb-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold mb-2 ${
                          typeInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                          typeInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                          typeInfo.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                          typeInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                          typeInfo.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          <span className="text-lg">{typeInfo.icon}</span>
                          {typeInfo.type}
                        </div>
                        <div className="text-xs text-gray-600 mb-2">{typeInfo.description}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            {typeInfo.freeApps > 0 
                              ? `${typeInfo.freeApps} free applications`
                              : 'Paid service'
                            }
                          </span>
                          <div className="flex items-center gap-2">
                            {serviceFee.showStrikethrough && serviceFee.originalAmount && (
                              <span className="text-gray-400 line-through text-xs">
                                {serviceFee.originalAmount}
                              </span>
                            )}
                            <span className={`font-semibold ${
                              serviceFee.amount === 'Free' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {serviceFee.amount}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Popular Programs */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">{language === 'en' ? 'Popular Programs' : 'Programmes populaires'}</div>
                    <div className="flex flex-wrap gap-1">
                      {establishment.popularPrograms.slice(0, 2).map((program, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                          {program}
                        </span>
                      ))}
                      {establishment.popularPrograms.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +{establishment.popularPrograms.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-600">
                    {establishment.scholarships && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{language === 'en' ? 'Scholarships' : 'Bourses'}</span>
                      </div>
                    )}
                    {establishment.housing && (
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-blue-500" />
                        <span>{language === 'en' ? 'Housing' : 'Logement'}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>{establishment.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <span>{establishment.programs} {language === 'en' ? 'programs' : 'programmes'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span>{establishment.applicationDeadline}</span>
                    </div>
                  </div>

                  {/* Enhanced Actions */}
                  <div className="space-y-3">
                    {/* Main Actions Row */}
                    <div className="flex gap-2">
                      <div className="flex-1 bg-blue-800 text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        {language === 'en' ? 'View Details' : 'Voir les détails'}
                      </div>
                      <div 
                        className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold flex items-center justify-center cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Handle favorite toggle
                        }}
                      >
                        <Heart className="w-4 h-4" />
                      </div>
                    </div>
                    
                    {/* Secondary Actions Row */}
                    <div className="flex gap-2">
                      {establishment.easyApply && (
                        <div 
                          className={`flex-1 text-white py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                            establishment.universityType === 'A' 
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle apply
                          }}
                        >
                          <Zap className="w-4 h-4" />
                          {establishment.universityType === 'A' 
                            ? (language === 'en' ? 'FREE APPLY' : 'CANDIDATURE GRATUITE')
                            : (language === 'en' ? 'APPLY' : 'CANDIDATURE')
                          }
                        </div>
                      )}
                      <div 
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Handle contact advisor
                        }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        {language === 'en' ? 'Contact Advisor' : 'Contacter un Conseiller'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </Link>
            ))

            ) : (
              /* Programs Cards */
              filteredPrograms.map(program => (
                <Link 
                  key={program.id} 
                  to={`/programs/${program.id}`}
                  className="block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Program Logo Section */}
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="logo-container">
                      <img
                        src={program.logo}
                        alt={program.name}
                        className="logo-image group-hover:scale-105 transition-all duration-300"
                      />
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {program.aidvisorRecommended && (
                        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Bot className="w-3 h-3" />
                          {language === 'en' ? 'E-DVISOR Recommended' : 'Recommandé par E-DVISOR'}
                        </div>
                      )}
                      {program.featured && (
                        <div className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {language === 'en' ? 'Featured' : 'En vedette'}
                        </div>
                      )}
                    </div>
                    
                    {/* University Ranking */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-gray-800">#{program.ranking}</span>
                    </div>
                  </div>

                  {/* Program Content */}
                  <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {program.name}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <Building2 className="w-4 h-4 mr-1 text-blue-500" />
                        {program.university}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {program.city}, {program.country}
                      </div>
                    </div>

                    {/* Program Details */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Degree' : 'Diplôme'}</div>
                        <div className="text-sm font-semibold text-gray-800">{program.degree}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Duration' : 'Durée'}</div>
                        <div className="text-sm font-semibold text-gray-800">{program.duration}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Study Type' : 'Type d\'Étude'}</div>
                        <div className="text-sm font-semibold text-gray-800">
                          {program.studyType === 'on-campus' ? (language === 'en' ? 'On-Campus' : 'Présentiel') :
                           program.studyType === 'hybrid' ? (language === 'en' ? 'Hybrid' : 'Hybride') :
                           program.studyType === 'online' ? (language === 'en' ? 'Online' : 'En ligne') : 
                           program.studyType}
                        </div>
                      </div>
                    </div>

                    {/* Tuition and Start Date */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Tuition' : 'Frais'}</div>
                        <div className="text-sm font-semibold text-gray-800">{program.tuition}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Start Date' : 'Date de début'}</div>
                        <div className="text-sm font-semibold text-gray-800">{program.startDate}</div>
                      </div>
                  </div>

                  {/* Description */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{program.description}</p>
                    </div>

                    {/* Requirements */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-2">{language === 'en' ? 'Requirements' : 'Prérequis'}</div>
                      <div className="flex flex-wrap gap-1">
                        {program.requirements.slice(0, 2).map((req, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                            {req}
                          </span>
                        ))}
                        {program.requirements.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                            +{program.requirements.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* University Type and Application Fees */}
                    {(() => {
                      const typeInfo = getUniversityTypeInfo({ universityType: program.universityType, countrySpecific: { type: program.university.includes('Sorbonne') ? 'france' : program.university.includes('Tsinghua') ? 'china' : 'standard' } });
                      const serviceFee = getServiceFee({ universityType: program.universityType, countrySpecific: { type: program.university.includes('Sorbonne') ? 'france' : program.university.includes('Tsinghua') ? 'china' : 'standard' } });
                      
                      // Safety check
                      if (!typeInfo || !serviceFee) {
                        return null;
                      }
                      
                      return (
                        <div className="mb-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold mb-2 ${
                            typeInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                            typeInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                            typeInfo.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                            typeInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                            typeInfo.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            <span className="text-lg">{typeInfo.icon}</span>
                            {typeInfo.type}
                          </div>
                          <div className="text-xs text-gray-600 mb-2">{typeInfo.description}</div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                              {typeInfo.freeApps > 0 
                                ? `${typeInfo.freeApps} free applications`
                                : 'Paid service'
                              }
                            </span>
                            <div className="flex items-center gap-2">
                              {serviceFee.showStrikethrough && serviceFee.originalAmount && (
                                <span className="text-gray-400 line-through text-xs">
                                  {serviceFee.originalAmount}
                                </span>
                              )}
                              <span className={`font-semibold ${
                                serviceFee.amount === 'Free' ? 'text-green-600' : 'text-blue-600'
                              }`}>
                                {serviceFee.amount}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Actions */}
                    <div className="space-y-3">
                      {/* Main Actions Row */}
                      <div className="flex gap-2">
                        <div className="flex-1 bg-blue-800 text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" />
                          {language === 'en' ? 'View Details' : 'Voir les détails'}
                        </div>
                        <div 
                          className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold flex items-center justify-center cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle favorite toggle
                          }}
                        >
                          <Heart className="w-4 h-4" />
                        </div>
                      </div>
                      
                      {/* Secondary Actions Row */}
                      <div className="flex gap-2">
                        {program.easyApply && (
                          <div 
                            className={`flex-1 text-white py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                              program.universityType === 'A' 
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Handle apply
                            }}
                          >
                            <Zap className="w-4 h-4" />
                            {program.universityType === 'A' 
                              ? (language === 'en' ? 'FREE APPLY' : 'CANDIDATURE GRATUITE')
                              : (language === 'en' ? 'APPLY' : 'CANDIDATURE')
                            }
                          </div>
                        )}
                        <div 
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle contact advisor
                          }}
                        >
                          <MessageCircle className="w-4 h-4" />
                          {language === 'en' ? 'Contact Advisor' : 'Contacter un Conseiller'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* No Results */}
          {((activeTab === 'establishments' && filteredEstablishments.length === 0) || 
            (activeTab === 'programs' && filteredPrograms.length === 0)) && (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'establishments' 
                  ? (language === 'en' ? 'No establishments found' : 'Aucun établissement trouvé')
                  : (language === 'en' ? 'No programs found' : 'Aucun programme trouvé')
                }
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Try adjusting your search criteria or filters' 
                  : 'Essayez d\'ajuster vos critères de recherche ou filtres'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstablishmentsListing;
