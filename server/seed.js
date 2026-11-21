require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const InternProfile = require('./models/InternProfile');
const CompanyProfile = require('./models/CompanyProfile');
const InternshipSlot = require('./models/InternshipSlot');
const Allocation = require('./models/Allocation');
const Notification = require('./models/Notification');
const EngineLog = require('./models/EngineLog');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pm_internship';
  await mongoose.connect(uri);
  console.log(`[Seeder] Connected to database: ${uri}`);
};

const SECTORS = [
  'Information Technology',
  'Finance & Banking',
  'Healthcare & Pharma',
  'Heavy Manufacturing',
  'Agriculture & Agrotech',
  'Education & EdTech',
  'Renewable Energy',
  'Logistics & Supply Chain',
  'Infrastructure & Smart Cities',
  'Retail & E-Commerce',
];

const STATES = [
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Tamil Nadu',
  'Uttar Pradesh',
  'Gujarat',
  'Telangana',
  'Rajasthan',
  'West Bengal',
  'Madhya Pradesh',
];

const SKILL_POOLS = {
  'Information Technology': [
    'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'Express.js', 'Docker', 'AWS',
    'SQL', 'MongoDB', 'Git', 'Linux', 'REST API', 'TypeScript', 'Machine Learning',
  ],
  'Finance & Banking': [
    'Financial Modeling', 'Excel', 'Tally', 'GST', 'Accounting', 'Financial Analysis',
    'Risk Management', 'Data Analysis', 'Audit', 'Taxation', 'Communication',
  ],
  'Healthcare & Pharma': [
    'Clinical Research', 'Medical Coding', 'Healthcare Management', 'Pharmacovigilance',
    'Data Analysis', 'Excel', 'Lab Techniques', 'Communication', 'Biotechnology',
  ],
  'Heavy Manufacturing': [
    'AutoCAD', 'SolidWorks', 'PLC Programming', 'Embedded Systems', 'IoT',
    'Quality Assurance', 'Project Management', 'Problem Solving', 'Six Sigma',
  ],
  'Agriculture & Agrotech': [
    'Data Analysis', 'IoT', 'Supply Chain', 'Operations Management', 'Field Research',
    'Excel', 'Market Research', 'GIS', 'Project Management',
  ],
  'Education & EdTech': [
    'Content Writing', 'Digital Marketing', 'Python', 'Communication', 'Presentation',
    'Data Analysis', 'Graphic Design', 'Curriculum Design',
  ],
  'Renewable Energy': [
    'CAD', 'Electrical Systems', 'Solar PV Design', 'Energy Audit', 'Python',
    'Project Management', 'Data Analysis', 'IoT',
  ],
  'Logistics & Supply Chain': [
    'Supply Chain', 'Inventory Management', 'Excel', 'ERP', 'SAP', 'Data Analysis',
    'Logistics Planning', 'Negotiation', 'Communication',
  ],
  'Infrastructure & Smart Cities': [
    'Civil Engineering', 'AutoCAD', 'Structural Analysis', 'Project Management',
    'GIS', 'Urban Planning', 'Estimation', 'Cost Accounting',
  ],
  'Retail & E-Commerce': [
    'Digital Marketing', 'SEO', 'Content Writing', 'CRM', 'Market Research',
    'Data Analysis', 'Inventory Management', 'Customer Relationship',
  ],
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Purging existing collections...');
    await User.deleteMany({});
    await InternProfile.deleteMany({});
    await CompanyProfile.deleteMany({});
    await InternshipSlot.deleteMany({});
    await Allocation.deleteMany({});
    await Notification.deleteMany({});
    await EngineLog.deleteMany({});
    console.log('✅ Cleared existing data');

    // 1. Seed Administrator
    console.log('[Seeder] Creating portal administrator...');
    const adminUser = await User.create({
      name: 'Director General (Admin)',
      email: 'admin@allocation-ai.test',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 11 2338 0001',
      isVerified: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    });
    console.log('✅ Created 1 admin');

    // 2. Seed 30 Verified Companies + 75+ Slots
    console.log('[Seeder] Creating 30 companies and internship slots...');
    const companyDocs = [];
    const slotDocs = [];

    const companyNames = [
      'Tata Consultancy Services', 'Infosys Ltd', 'Wipro Digital', 'HCL Technologies',
      'Tech Mahindra', 'State Bank of India', 'HDFC Bank', 'ICICI Securities',
      'Larsen & Toubro', 'Reliance Industries', 'Mahindra & Mahindra', 'Bharat Heavy Electricals',
      'Dr. Reddys Laboratories', 'Sun Pharmaceutical', 'Cipla Health', 'Apollo Hospitals Digital',
      'Adani Green Energy', 'Tata Power Renewable', 'NTPC Limited', 'ITC Agri-Business',
      'UPL Agrochemicals', 'Delhivery Logistics', 'Blue Dart Express', 'Flipkart India',
      'Amazon Development Centre', 'Byjus Learning', 'Unacademy Tech', 'Godrej Properties',
      'DLF Infrastructure', 'Hindustan Unilever',
    ];

    for (let c = 0; c < 30; c++) {
      const companySector = SECTORS[c % SECTORS.length];
      const companyState = STATES[c % STATES.length];
      const daysAgo = Math.floor(Math.random() * 28) + 2;
      const createdDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      const compUser = await User.create({
        name: companyNames[c],
        email: `company${c + 1}@example.com`,
        password: 'Company@123',
        role: 'company',
        phone: `+91 ${9800000000 + c}`,
        isVerified: true,
        createdAt: createdDate,
      });

      const compProfile = await CompanyProfile.create({
        userId: compUser._id,
        companyName: companyNames[c],
        registrationNumber: `CIN-U72200MH2024PLC${100000 + c}`,
        sector: companySector,
        website: `https://www.${companyNames[c].toLowerCase().replace(/[^a-z]/g, '')}.com`,
        description: `Leading national enterprise specializing in ${companySector} operations and capacity building.`,
        employeeCount: c % 2 === 0 ? '1000+' : '500-1000',
        address: {
          street: `${c * 12 + 101}, Central Industrial Estate`,
          city: companyState === 'Delhi' ? 'New Delhi' : 'Capital Hub',
          state: companyState,
          pincode: `${110000 + c * 100}`,
        },
        contactPerson: {
          name: `Officer ${c + 1}`,
          designation: 'Human Resources Director',
          phone: `+91 99${c}0001122`,
        },
        isVerified: true,
        verifiedAt: createdDate,
        createdAt: createdDate,
      });

      companyDocs.push(compProfile);

      // Create 2 to 3 slots for this company
      const numSlots = (c % 2 === 0) ? 3 : 2;
      const skillsPool = SKILL_POOLS[companySector] || SKILL_POOLS['Information Technology'];

      for (let s = 0; s < numSlots; s++) {
        const slotSkills = skillsPool.slice(s * 3, s * 3 + 4);
        const preferred = skillsPool.slice(s * 3 + 4, s * 3 + 6);
        const totalSeats = 10 + ((c + s) % 15);

        const slot = await InternshipSlot.create({
          companyId: compProfile._id,
          title: `${companySector} Associate Trainee - Tier ${s + 1}`,
          description: `3 to 6 month paid apprenticeship at ${companyNames[c]}. Exposure to hands-on enterprise systems, real project work, and mentorship under the Allocation AI matching platform.`,
          requiredSkills: slotSkills.length > 0 ? slotSkills : ['Problem Solving', 'Communication'],
          preferredSkills: preferred,
          domain: companySector,
          responsibilities: [
            'Assist domain specialists with day-to-day operations and analysis',
            'Conduct quality assessments and document system requirements',
            'Collaborate on cross-functional modernization deliverables',
          ],
          location: {
            city: companyState === 'Delhi' ? 'New Delhi' : 'Metro City',
            state: companyState,
            isRemote: s === 0 && c % 3 === 0,
          },
          stipend: 4500 + ((c * 500) % 6000), // Rs 4500 to 10000 monthly
          duration: s === 1 ? '6 Months' : '3 Months',
          startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          totalSeats: totalSeats,
          filledSeats: 0,
          eligibility: {
            minCGPA: 6.0 + (s * 0.5),
            streams: ['Engineering', 'Commerce', 'Science', 'Management'],
          },
          isActive: true,
          createdAt: createdDate,
        });

        slotDocs.push(slot);
      }
    }
    console.log(`✅ Created 30 companies + ${slotDocs.length} slots`);

    // 3. Seed 300 Interns with Realistic Quota Proportions
    console.log('[Seeder] Creating 300 interns with constitutional quotas...');
    // Target distributions: SC ~10% (30), ST ~7.5% (22), OBC ~27% (81), PH ~4% (12), General ~51.5% (155)
    const firstNames = [
      'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
      'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Advaith', 'Aaryan', 'Dhruv', 'Kabir', 'Rudra', 'Ananya',
      'Diya', 'Gauri', 'Isha', 'Kavya', 'Khushi', 'Mira', 'Navya', 'Pooja', 'Priya', 'Riya',
      'Roshni', 'Saanvi', 'Sara', 'Sneha', 'Tanvi', 'Veda', 'Zoya', 'Alok', 'Deepak', 'Manoj',
      'Rajesh', 'Suresh', 'Vikram', 'Anil', 'Sunil', 'Amit', 'Pankaj', 'Sachin', 'Naveen', 'Rahul',
    ];

    const lastNames = [
      'Sharma', 'Verma', 'Gupta', 'Mehta', 'Kumar', 'Singh', 'Patel', 'Yadav', 'Joshi', 'Chauhan',
      'Mishra', 'Pandey', 'Nair', 'Pillai', 'Rao', 'Reddy', 'Chatterjee', 'Banerjee', 'Bose', 'Dutta',
      'Deshmukh', 'Kulkarni', 'Patil', 'Shinde', 'Jadhav', 'Gowda', 'Hegde', 'Shetty', 'Bhat', 'Menon',
    ];

    const streams = ['Engineering', 'Commerce', 'Science', 'Management', 'Arts', 'Agriculture'];
    const instTypes = ['State University', 'Central University', 'NIT', 'IIT', 'College', 'Polytechnic'];

    for (let i = 0; i < 300; i++) {
      // Determine affirmative category
      let category = 'General';
      let isPH = false;

      if (i < 30) {
        category = 'SC';
      } else if (i < 52) {
        category = 'ST';
      } else if (i < 133) {
        category = 'OBC';
      } else if (i < 145) {
        category = 'PH';
        isPH = true;
      } else {
        category = 'General';
      }

      // Additional 4% PH overlap across groups
      if (i % 25 === 0) {
        isPH = true;
      }

      const fName = firstNames[i % firstNames.length];
      const lName = lastNames[(i * 3 + 7) % lastNames.length];
      const fullName = `${fName} ${lName}`;
      const internState = STATES[i % STATES.length];
      const targetSector = SECTORS[i % SECTORS.length];
      const basePool = SKILL_POOLS[targetSector];

      // Pick 4 to 7 skills with high overlap to industry sectors
      const internSkills = [];
      const numSkills = 4 + (i % 4);
      for (let s = 0; s < numSkills; s++) {
        const skill = basePool[(i + s) % basePool.length];
        if (!internSkills.includes(skill)) internSkills.push(skill);
      }

      // Add common soft skills
      internSkills.push('Communication');
      if (i % 2 === 0) internSkills.push('Teamwork');

      // Normal distribution for CGPA (5.8 to 9.8)
      const cgpa = Math.min(9.8, Math.max(5.8, Number((6.0 + ((i * 13) % 38) * 0.1).toFixed(2))));

      // Spread registration across the last 30 calendar days for time-series charts
      const daysAgo = (i % 30);
      const regDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - (i % 24) * 3600 * 1000);

      const internUser = await User.create({
        name: fullName,
        email: `intern${i + 1}@example.com`,
        password: 'Intern@123',
        role: 'intern',
        phone: `+91 ${9700000000 + i}`,
        isVerified: true,
        createdAt: regDate,
      });

      const profile = await InternProfile.create({
        userId: internUser._id,
        personalInfo: {
          dob: new Date(2001, (i % 12), (i % 28) + 1),
          gender: i % 3 === 0 ? 'Female' : 'Male',
          fatherName: `Shri ${lastNames[(i + 2) % lastNames.length]} Senior`,
          address: `${100 + i}, Sector ${i % 20 + 1}`,
          city: internState === 'Delhi' ? 'New Delhi' : 'District Center',
          state: internState,
          district: `${internState} Central`,
          pincode: `${200000 + (i * 15)}`,
        },
        aadharLast4: String(1000 + (i % 9000)).slice(-4),
        aadharHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        category,
        isPH,
        academic: {
          institutionName: `${internState} Institute of Technology & Management`,
          institutionType: instTypes[i % instTypes.length],
          stream: streams[i % streams.length],
          specialization: `${targetSector} Specialization`,
          cgpa,
          passingYear: 2024,
          tenthPercent: 80 + (i % 18),
          twelfthPercent: 78 + (i % 20),
        },
        skills: internSkills,
        domainInterest: [targetSector, SECTORS[(i + 2) % SECTORS.length]],
        locationPreference: [internState, STATES[(i + 1) % STATES.length]],
        languages: ['English', 'Hindi'],
        resumeUrl: '',
        profileCompletionPercent: 95,
        allocationStatus: 'Pending',
        createdAt: regDate,
      });
    }

    console.log('✅ Created 300 interns');

    console.log('\n===========================================================');
    console.log('🎉 Seeding complete!');
    console.log('===========================================================');
    console.log('Default test credentials:');
    console.log('  Admin:   admin@allocation-ai.test / Admin@123');
    console.log('  Company: company1@example.com     / Company@123');
    console.log('  Intern:  intern1@example.com      / Intern@123');
    console.log('===========================================================\n');

    process.exit(0);
  } catch (err) {
    console.error(`[Seeder Error]: ${err.message}`);
    process.exit(1);
  }
};

seedDatabase();
