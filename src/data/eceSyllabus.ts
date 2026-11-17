/**
 * OFFICIAL RUET ECE UNDERGRADUATE SYLLABUS DATASET
 * Effective from Undergraduate Session 2020-2021
 * Department of Electrical & Computer Engineering
 * Rajshahi University of Engineering & Technology (RUET)
 * First Edition (September 2023)
 */

export interface SyllabusCourse {
  courseNo: string;
  courseTitle: string;
  type: "THEORY" | "SESSIONAL";
  contactHrs: string;
  credits: number;
  prerequisites?: string;
  topics?: {
    title: string;
    description: string;
  }[];
}

export interface SemesterCurriculum {
  semesterId: string;
  year: number;
  semesterName: string;
  term: "Odd" | "Even";
  totalCredits: number;
  theoryCredits: number;
  sessionalCredits: number;
  courses: SyllabusCourse[];
}

export interface ElectiveCourse {
  courseNo: string;
  courseTitle: string;
  credits: number;
  contactHrs: string;
  pool: "Optional I" | "Optional II" | "Optional III" | "Optional IV";
  stream: "Electrical" | "Computer";
  topics?: {
    title: string;
    description: string;
  }[];
}

export const syllabusMeta = {
  title: "Syllabus for Undergraduate Studies",
  effectiveSession: "2020-2021",
  department: "Department of Electrical & Computer Engineering",
  institution: "Rajshahi University of Engineering & Technology (RUET)",
  edition: "First Edition (September 2023)",
  totalCredits: 160.0,
  theoryCredits: 120.0,
  sessionalCredits: 40.0,
  degreeTitle: "Bachelor of Science in Electrical & Computer Engineering [B.Sc. Engg. (ECE)]",
  pdfPath: "/ece-undergraduate-syllabus.pdf",
  pdfFileName: "ece-undergraduate-syllabus.pdf",
  pdfFileSize: "944 KB",
};

export const semesterCurricula: SemesterCurriculum[] = [
  {
    semesterId: "1-1",
    year: 1,
    semesterName: "1st Year Odd Semester",
    term: "Odd",
    totalCredits: 20.25,
    theoryCredits: 15.0,
    sessionalCredits: 5.25,
    courses: [
      {
        courseNo: "ECE 1101",
        courseTitle: "Circuits and Systems-I",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "DC Analysis",
            description: "Introduction of electrical power sources, ideal and practical sources, linear circuit elements, DC analysis of series, parallel and series-parallel circuits. Kirchhoff's Voltage and current laws, voltage, current, power and energy.",
          },
          {
            title: "Sinusoidal Wave",
            description: "Average and effective values, form factor, peak factor, phase relation and phasors. Steady state AC analysis of series, parallel and series parallel circuits, phase relation between voltage and current, concept of impedance, power, power factor, phasor diagram.",
          },
          {
            title: "Network Theorems",
            description: "Superposition theorem, Thevenin's theorem, Norton's theorem, maximum power transfer theorem, substitution theorem and reciprocity theorem. Frequency response of ac circuits, resonance phenomena, periodic signals in time and frequency domains. Circuit analysis using proper simulation tools.",
          },
          {
            title: "Magnetic Circuit and Concepts",
            description: "Flux, fields, permeability reluctance, analysis of series, parallel and series-parallel magnetic circuit.",
          },
        ],
      },
      {
        courseNo: "ECE 1102",
        courseTitle: "Circuits and Systems-I Sessional",
        type: "SESSIONAL",
        contactHrs: "3",
        credits: 1.5,
        topics: [{ title: "Lab Experiments", description: "Sessional based on the theory of course ECE 1101." }],
      },
      {
        courseNo: "ECE 1103",
        courseTitle: "Computer Programming",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Introduction to Computer Programming",
            description: "Compiler, Interpreter, Flow chart design, Writing, Debugging and running programs using C/C++.",
          },
          {
            title: "C Basics",
            description: "Different data types and variables, Operator and operands and its precedence, Input/Output, Conditional operators, Loop structures, Error handling, and Built-in functions.",
          },
          {
            title: "Functions and Arrays",
            description: "Writing & calling of user defined functions, Recursive functions, Introduction to one-dimensional arrays, Multi-dimensional arrays and array manipulation.",
          },
          {
            title: "Pointers and Strings",
            description: "Introduction to pointers, Pointers and array, Pointers and functions, Scope of variables, Dynamic memory allocation, String I/O, String-based built-in functions, String operations, Pointer and string.",
          },
          {
            title: "Files and Advanced Topics",
            description: "Files in C, binary and sequential files. Structure, Union, Enumeration, Bit fields, Operations on bits, Register variable, Pre-processors and graphics in C.",
          },
        ],
      },
      {
        courseNo: "ECE 1104",
        courseTitle: "Computer Programming Sessional",
        type: "SESSIONAL",
        contactHrs: "3",
        credits: 1.5,
        topics: [{ title: "Lab Experiments", description: "Sessional based on the theory of course ECE 1103." }],
      },
      {
        courseNo: "Math 1117",
        courseTitle: "Calculus and Ordinary Differential Equation",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Differential Calculus",
            description: "Rolle's theorem, Mean value theorem. Taylor's and Maclaurin's theorems. Divergency and Convergency of series. Partial differentiation, Euler's theorem. Tangent, normal and curvature. Maxima and minima.",
          },
          {
            title: "Integral Calculus",
            description: "Definite integration in summing series. Walli's formulae. Improper integrals. Beta and Gamma functions. Area under plane curve, volume and surface areas of solids of revolution.",
          },
          {
            title: "Ordinary Differential Equation",
            description: "Degree and order of ODE. Solutions of first order ODEs by various methods. Solutions of general linear differential equations of second and higher orders with constant coefficients. Operator method.",
          },
        ],
      },
      {
        courseNo: "Phy 1117",
        courseTitle: "Optics and Modern Physics",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Optics & Interference",
            description: "Huygens's principle, Young's double slit experiment, Fresnel bi-prism, Newton's ring, Interferometers. Fresnel and Fraunhofer diffraction, diffraction gratings. Polarization and optics of crystals.",
          },
          {
            title: "Waves and Oscillations",
            description: "Simple Harmonic Motion, Travelling and Standing waves. Sound waves, Doppler effect, Sabine's formula and architectural acoustics.",
          },
          {
            title: "Modern Physics & Relativity",
            description: "Bohr atom model, energy levels, Photoelectric effect, Compton effect, de Broglie waves, Special theory of relativity, Lorentz Transformation, mass-energy relation.",
          },
        ],
      },
      {
        courseNo: "Phy 1118",
        courseTitle: "Optics and Modern Physics Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Lab Experiments", description: "Sessional based on the theory of course Phy 1117." }],
      },
      {
        courseNo: "Hum 1117",
        courseTitle: "Technical English",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Grammar & Vocabulary",
            description: "Grammatical principles, modals, phrases & idioms, prefixes & suffixes, sentence structures. Technical & scientific vocabulary.",
          },
          {
            title: "Technical Writing & Communication",
            description: "Report writing, research paper writing, library references. Business letters, job applications, memos, quotations, tender notices.",
          },
        ],
      },
      {
        courseNo: "Hum 1118",
        courseTitle: "Technical English Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Language Lab", description: "Spoken English, phonetic symbols, extempore speech, professional presentation." }],
      },
      {
        courseNo: "ECE 1100",
        courseTitle: "Introduction to Computer System",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [
          {
            title: "Computer Basics & Software",
            description: "Computer architecture basics, processors, peripherals. Familiarization with OS (Windows, Linux), productivity tools, computer ethics, IP rights and cybersecurity basics.",
          },
        ],
      },
    ],
  },
  {
    semesterId: "1-2",
    year: 1,
    semesterName: "1st Year Even Semester",
    term: "Even",
    totalCredits: 18.75,
    theoryCredits: 15.0,
    sessionalCredits: 3.75,
    courses: [
      {
        courseNo: "ECE 1201",
        courseTitle: "Circuits and Systems-II",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Polyphase Systems & Coupled Circuits",
            description: "Balanced and unbalanced three phase circuit analysis. Two-port network analysis. Coupled circuit. Analogous system, Response to non-sinusoidal voltage.",
          },
          {
            title: "Linear Systems & Transforms",
            description: "Fourier and Laplace transforms. Impulse function. Convolution integral and their application to network and system analysis.",
          },
          {
            title: "Filters",
            description: "Introduction to filter, Filter equations, Modern filters.",
          },
        ],
      },
      {
        courseNo: "ECE 1202",
        courseTitle: "Circuits and Systems-II Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Lab Experiments", description: "Sessional based on the theory of course ECE 1201." }],
      },
      {
        courseNo: "ECE 1203",
        courseTitle: "Object Oriented Programming",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Fundamentals & Classes",
            description: "Principles of OOP. Classes and Objects, Access Modifiers, Encapsulation, Constructors and Destructors, Virtual inheritance.",
          },
          {
            title: "Polymorphism & Advanced OOP",
            description: "Operator and Function overloading, Run-time and compile-time polymorphism, Virtual functions, Exception handling, UML Basics, GUI Design and Multithreading.",
          },
        ],
      },
      {
        courseNo: "ECE 1204",
        courseTitle: "Object Oriented Programming Sessional",
        type: "SESSIONAL",
        contactHrs: "3",
        credits: 1.5,
        topics: [{ title: "OOP Lab", description: "Hands-on OOP implementation in Java/C++, design patterns and GUI applications." }],
      },
      {
        courseNo: "ECE 1205",
        courseTitle: "Analog Electronic Circuits-I",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Diodes & Transistors",
            description: "P-N junction diode, rectifiers, Zener diode. BJT, FET, MOSFET: Characteristics, Biasing techniques, Stabilization factors, Compensation.",
          },
          {
            title: "Amplifiers",
            description: "Equivalent circuits, single stage amplifiers at midband frequencies. Power amplifiers and Heat sinks.",
          },
        ],
      },
      {
        courseNo: "ECE 1206",
        courseTitle: "Analog Electronic Circuits-I Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Electronics Lab", description: "Sessional based on the theory of course ECE 1205." }],
      },
      {
        courseNo: "Math 1217",
        courseTitle: "Transform Methods, Statistics & Complex Variable",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Harmonic Analysis & Laplace Transform",
            description: "Fourier series, Fourier transforms and applications. Laplace transforms and ODE solution.",
          },
          {
            title: "Statistics & Probability",
            description: "Measures of dispersion, probability distributions (Binomial, Poisson, Normal), sampling theory, hypothesis testing.",
          },
          {
            title: "Complex Variable",
            description: "Analyticity, Cauchy-Riemann equations, Line integration, Cauchy integral formula, Taylor's & Laurent's series, Residue theorem.",
          },
        ],
      },
      {
        courseNo: "Hum 1217",
        courseTitle: "Government, Sociology, Environment Protection & History of Independence",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "History of Independence",
            description: "1952 Language Movement, Six Points, 1969 Mass Upsurge, 7th March Speech, 1971 Liberation War.",
          },
          {
            title: "Sociology & Environment",
            description: "Social structure of Bangladesh, cyber-crime causes and remedies, environmental laws, global warming and sustainable development.",
          },
        ],
      },
      {
        courseNo: "ECE 1200",
        courseTitle: "Engineering Ethics",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [
          {
            title: "Ethics & Integrity",
            description: "Codes of ethics, research integrity, whistleblowing, sustainability, and engineering disaster case studies (Challenger, Ford Pinto, Chernobyl).",
          },
        ],
      },
    ],
  },
  {
    semesterId: "2-1",
    year: 2,
    semesterName: "2nd Year Odd Semester",
    term: "Odd",
    totalCredits: 19.5,
    theoryCredits: 15.0,
    sessionalCredits: 4.5,
    courses: [
      {
        courseNo: "ECE 2103",
        courseTitle: "Data Structure & Algorithms",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Linear Data Structures",
            description: "Arrays, Stacks, Queues, Linked Lists (Circular, Doubly).",
          },
          {
            title: "Non-Linear & Trees",
            description: "Binary Search Trees, Heaps, B-Trees. Graph traversal (BFS, DFS), Shortest path (Dijkstra, Bellman-Ford), MST.",
          },
          {
            title: "Algorithm Complexity",
            description: "Big-O notation, Sorting algorithms (Quick, Merge, Heap), Searching, Hashing, Backtracking (n-Queen), NP-Completeness.",
          },
        ],
      },
      {
        courseNo: "ECE 2104",
        courseTitle: "Data Structure & Algorithms Sessional",
        type: "SESSIONAL",
        contactHrs: "3",
        credits: 1.5,
        topics: [{ title: "Lab Work", description: "Implementation of data structures and algorithms in C++." }],
      },
      {
        courseNo: "ECE 2105",
        courseTitle: "Analog Electronic Circuits-II",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Multistage Amplifiers & CMOS",
            description: "Frequency response of single and multistage amplifiers. CMOS introduction and applications.",
          },
          {
            title: "Feedback & Op-Amps",
            description: "Negative feedback, Op-Amp applications, active filters, oscillators, multivibrators, 555 timer IC.",
          },
        ],
      },
      {
        courseNo: "ECE 2106",
        courseTitle: "Analog Electronic Circuits-II Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Lab Experiments", description: "Sessional based on the theory of course ECE 2105." }],
      },
      {
        courseNo: "ECE 2111",
        courseTitle: "Digital Techniques",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Logic Gates & Combinational Circuits",
            description: "Boolean algebra, Karnaugh maps, Adders, Subtractors, Encoders, Decoders, Multiplexers.",
          },
          {
            title: "Sequential Circuits & State Machines",
            description: "Flip-flops (SR, JK, D, T), Counters, Shift registers, state machine synthesis, fan-in/fan-out, propagation delay.",
          },
        ],
      },
      {
        courseNo: "ECE 2112",
        courseTitle: "Digital Techniques Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Digital Lab", description: "Digital logic IC experimentation and combinational/sequential circuit design." }],
      },
      {
        courseNo: "Math 2117",
        courseTitle: "Vector Analysis & Linear Algebra",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Vector Analysis",
            description: "Gradient, divergence, curl. Line, surface, volume integrals. Green's, Gauss's, and Stokes' theorems.",
          },
          {
            title: "Matrices & Linear Algebra",
            description: "Rank, system of linear equations, Eigenvalues and Eigenvectors, Vector spaces, linear transformations.",
          },
        ],
      },
      {
        courseNo: "Chem 2117",
        courseTitle: "Inorganic and Physical Chemistry",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Physical Chemistry",
            description: "Chemical kinetics, chemical equilibrium, thermochemistry, electrochemistry and cells.",
          },
        ],
      },
      {
        courseNo: "Chem 2118",
        courseTitle: "Inorganic and Physical Chemistry Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Chemistry Lab", description: "Sessional based on the theory of course Chem 2117." }],
      },
      {
        courseNo: "ECE 2100",
        courseTitle: "Software Development Project-I",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Project Work", description: "Developing real-world desktop or console applications using software engineering best practices." }],
      },
    ],
  },
  {
    semesterId: "2-2",
    year: 2,
    semesterName: "2nd Year Even Semester",
    term: "Even",
    totalCredits: 20.25,
    theoryCredits: 15.0,
    sessionalCredits: 5.25,
    courses: [
      {
        courseNo: "ECE 2207",
        courseTitle: "Electrical Machine-I",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Transformers",
            description: "Ideal and practical transformers, equivalent circuit, regulation, OC & SC tests, 3-phase transformers.",
          },
          {
            title: "Induction Motors",
            description: "3-phase induction motor, rotating magnetic field, torque-speed characteristics, starting & speed control, 1-phase induction motors.",
          },
        ],
      },
      {
        courseNo: "ECE 2208",
        courseTitle: "Electrical Machine-I Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Machines Lab", description: "Testing and characteristics evaluation of transformers and AC induction motors." }],
      },
      {
        courseNo: "ECE 2213",
        courseTitle: "Numerical Methods & Discrete Mathematics",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Numerical Analysis",
            description: "Root finding, linear algebraic solvers, interpolation, numerical integration, Runge-Kutta ODE solvers.",
          },
          {
            title: "Discrete Mathematics",
            description: "Set theory, relations, propositional logic, mathematical induction, number theory (modular arithmetic, CRT), combinatorics.",
          },
        ],
      },
      {
        courseNo: "ECE 2214",
        courseTitle: "Numerical Methods & Discrete Mathematics Sessional",
        type: "SESSIONAL",
        contactHrs: "3",
        credits: 1.5,
        topics: [{ title: "Computational Lab", description: "MATLAB/Python numerical modeling and discrete problem solving." }],
      },
      {
        courseNo: "ECE 2215",
        courseTitle: "Data Base Systems",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Database Modeling & SQL",
            description: "ER & EER modeling, Relational algebra, Normalization (1NF to BCNF), Advanced SQL queries, triggers, stored procedures.",
          },
          {
            title: "Transactions & Architecture",
            description: "Concurrency control, locking, deadlock, crash recovery, RAID, NoSQL, distributed databases.",
          },
        ],
      },
      {
        courseNo: "ECE 2216",
        courseTitle: "Data Base Systems Sessional",
        type: "SESSIONAL",
        contactHrs: "3",
        credits: 1.5,
        topics: [{ title: "Database Lab", description: "Database design, schema implementation in PostgreSQL/MySQL, web backend integration." }],
      },
      {
        courseNo: "Math 2217",
        courseTitle: "Co-ordinate Geometry & Partial Differential Equations",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "3D Geometry & PDE",
            description: "3D coordinates, planes and lines. First & second order PDE, Charpit's method, separation of variables, series solutions.",
          },
        ],
      },
      {
        courseNo: "Hum 2217",
        courseTitle: "Legal Issues, Industrial & Operational Management",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Industrial Law & Management",
            description: "Contract law, labor laws in Bangladesh, principles of management, inventory models (EOQ), MRP, industrial safety.",
          },
        ],
      },
      {
        courseNo: "ECE 2200",
        courseTitle: "Electronic Shop Practice",
        type: "SESSIONAL",
        contactHrs: "3",
        credits: 1.5,
        topics: [
          {
            title: "Practical Workshop",
            description: "PCB layout design, etching, soldering, troubleshooting, electronic hardware maintenance.",
          },
        ],
      },
    ],
  },
  {
    semesterId: "3-1",
    year: 3,
    semesterName: "3rd Year Odd Semester",
    term: "Odd",
    totalCredits: 19.5,
    theoryCredits: 15.0,
    sessionalCredits: 4.5,
    courses: [
      {
        courseNo: "ECE 3107",
        courseTitle: "Electrical Machine-II",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "DC Machines & Synchronous Machines",
            description: "DC generator characteristics, DC motors, Synchronous generators, voltage regulation, parallel operation, synchronous motors, stepper motors.",
          },
        ],
      },
      {
        courseNo: "ECE 3108",
        courseTitle: "Electrical Machine-II Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Machines Lab II", description: "Experiments on DC machines and synchronous alternators." }],
      },
      {
        courseNo: "ECE 3111",
        courseTitle: "Microprocessor, Assembly Language & Interfacing",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Microprocessor Architecture & Assembly",
            description: "Intel 8086/8088 architecture, bus timing, assembly programming, string manipulation, procedures and macros.",
          },
          {
            title: "Interfacing & Controllers",
            description: "8255A PPI, 8259A PIC, 8254 timer, 8237A DMA controller, interrupt handling and peripheral design.",
          },
        ],
      },
      {
        courseNo: "ECE 3112",
        courseTitle: "Microprocessor, Assembly Language & Interfacing Sessional",
        type: "SESSIONAL",
        contactHrs: "3",
        credits: 1.5,
        topics: [{ title: "Assembly & Hardware Lab", description: "8086 assembly programming and hardware interfacing with peripheral ICs." }],
      },
      {
        courseNo: "ECE 3117",
        courseTitle: "Software Engineering & Information System Design",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Software Lifecycle & Architecture",
            description: "SDLC models, Agile, Requirements engineering, software testing strategies, quality assurance, system design.",
          },
        ],
      },
      {
        courseNo: "ECE 3118",
        courseTitle: "Software Engineering & Information System Design Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "SE Lab", description: "Hands-on software specification, UML modeling and automated testing." }],
      },
      {
        courseNo: "ECE 3119",
        courseTitle: "Computer Architecture and Design",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Processor Architecture",
            description: "CPU registers, ALU, control unit, MIPS instruction set architecture, pipelining, memory hierarchy, cache design, FPGA/VHDL.",
          },
        ],
      },
      {
        courseNo: "ECE 3121",
        courseTitle: "Electromagnetic Fields & Waves",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "EM Theory & Maxwell Equations",
            description: "Electrostatics, magnetostatics, Maxwell's equations, plane wave propagation, skin effect, waveguides and radiation.",
          },
        ],
      },
      {
        courseNo: "CE 3100",
        courseTitle: "Civil Engineering Drawing",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "CAD Drawing", description: "AutoCAD engineering drawing, architectural plans, elevation, and sections." }],
      },
      {
        courseNo: "ECE 3100",
        courseTitle: "Software Development Project-II",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Web Application Project", description: "Full-stack web application development connected to database backends." }],
      },
    ],
  },
  {
    semesterId: "3-2",
    year: 3,
    semesterName: "3rd Year Even Semester",
    term: "Even",
    totalCredits: 19.5,
    theoryCredits: 15.0,
    sessionalCredits: 4.5,
    courses: [
      {
        courseNo: "ECE 3205",
        courseTitle: "Industrial Electronics",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Power Semiconductor Devices & Converters",
            description: "SCR, IGBT, MOSFET, TRIAC. Controlled rectifiers, choppers, inverters (PWM), DC/AC motor drives, induction heating.",
          },
        ],
      },
      {
        courseNo: "ECE 3206",
        courseTitle: "Industrial Electronics Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Power Electronics Lab", description: "Experiments with power switches, thyristor converters and speed controllers." }],
      },
      {
        courseNo: "ECE 3207",
        courseTitle: "Communication Engineering",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Analog & Digital Modulation",
            description: "AM, FM, PM, PCM, PAM, PWM. Digital bandpass (BPSK, QPSK, FSK). Multiplexing (TDM, FDM, CDMA, WDM). Noise analysis.",
          },
        ],
      },
      {
        courseNo: "ECE 3208",
        courseTitle: "Communication Engineering Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Communication Lab", description: "Modulation/demodulation circuits, spectrum analysis and SDR testing." }],
      },
      {
        courseNo: "ECE 3221",
        courseTitle: "Operating System",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "OS Fundamentals",
            description: "Process management, CPU scheduling, synchronization, deadlock avoidance, virtual memory paging, file systems.",
          },
        ],
      },
      {
        courseNo: "ECE 3222",
        courseTitle: "Operating System Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "OS Lab", description: "Linux shell scripting, POSIX system calls, multithreading and IPC." }],
      },
      {
        courseNo: "ME 3219",
        courseTitle: "Basic Mechanical Engineering",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Thermodynamics & Turbines",
            description: "Steam turbines, IC engines (SI & CI), gas turbines, refrigeration, hydraulic turbines and pumps.",
          },
        ],
      },
      {
        courseNo: "ME 3220",
        courseTitle: "Basic Mechanical Engineering Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Mechanical Lab", description: "Demonstrations of engines, turbines and refrigeration test beds." }],
      },
      {
        courseNo: "Hum 3217",
        courseTitle: "Economics & Accountancy",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Economics & Accounting",
            description: "Micro & macro economics, double-entry bookkeeping, financial statements, cost accounting, CVP analysis.",
          },
        ],
      },
      {
        courseNo: "ECE 3200",
        courseTitle: "Electrical Services Design",
        type: "SESSIONAL",
        contactHrs: "3",
        credits: 1.5,
        topics: [{ title: "Design Studio", description: "Building electrical layout design, conduit wiring, substation calculation, BNBC codes." }],
      },
    ],
  },
  {
    semesterId: "4-1",
    year: 4,
    semesterName: "4th Year Odd Semester",
    term: "Odd",
    totalCredits: 20.5,
    theoryCredits: 15.0,
    sessionalCredits: 5.5,
    courses: [
      {
        courseNo: "ECE 4109",
        courseTitle: "Power System",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Transmission & Load Flow",
            description: "Line parameters, per unit system, Gauss-Seidel and Newton-Raphson load flow, symmetrical and unsymmetrical fault analysis.",
          },
        ],
      },
      {
        courseNo: "MTE 4117",
        courseTitle: "Control Systems & Robotics",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Control Theory",
            description: "Transfer functions, Routh-Hurwitz, Bode plot, Root locus, State variable analysis, PID controllers.",
          },
          {
            title: "Robotics",
            description: "Manipulator kinematics, trajectory generation, mobile robots, actuators and sensors.",
          },
        ],
      },
      {
        courseNo: "MTE 4118",
        courseTitle: "Control Systems & Robotics Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Robotics Lab", description: "MATLAB control system simulation and robotic arm programming." }],
      },
      {
        courseNo: "ECE 4123",
        courseTitle: "Digital Signal Processing",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "DSP & Filter Design",
            description: "Discrete-time signals, Z-transform, DFT, FFT algorithms, FIR/IIR digital filter design, DSP applications.",
          },
        ],
      },
      {
        courseNo: "ECE 4124",
        courseTitle: "Digital Signal Processing Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "DSP Lab", description: "Filter design and real-time audio/signal processing with MATLAB & DSP chips." }],
      },
      {
        courseNo: "ECE 41**",
        courseTitle: "Optional I (Elective)",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [{ title: "Elective Subject", description: "Selected from Optional I course pool (e.g., Digital Communication, Antennas, Radar, Fiber Optics, Biomedical)." }],
      },
      {
        courseNo: "ECE 41**",
        courseTitle: "Optional I Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Elective Lab", description: "Laboratory experiments supporting the chosen Optional I theory course." }],
      },
      {
        courseNo: "ECE 41**",
        courseTitle: "Optional II (Elective)",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [{ title: "Elective Subject", description: "Selected from Optional II course pool (e.g., VLSI Design, Network Planning, Wireless Networks, AI, HCI)." }],
      },
      {
        courseNo: "ECE 41**",
        courseTitle: "Optional II Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Elective Lab", description: "Laboratory experiments supporting the chosen Optional II theory course." }],
      },
      {
        courseNo: "ECE 4000",
        courseTitle: "Thesis / Project-I",
        type: "SESSIONAL",
        contactHrs: "2",
        credits: 1.0,
        topics: [{ title: "Undergraduate Thesis", description: "Research methodology, literature review, problem formulation, and proposal defense (continues to 4th Year Even)." }],
      },
      {
        courseNo: "ECE 4100",
        courseTitle: "Industrial Training",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Industry Attachment", description: "Two-week mandatory industrial/field attachment with engineering organizations." }],
      },
      {
        courseNo: "ECE 4122",
        courseTitle: "Seminar",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Technical Seminar", description: "Technical presentation on contemporary technological advances and research." }],
      },
    ],
  },
  {
    semesterId: "4-2",
    year: 4,
    semesterName: "4th Year Even Semester",
    term: "Even",
    totalCredits: 21.75,
    theoryCredits: 15.0,
    sessionalCredits: 6.75,
    courses: [
      {
        courseNo: "ECE 4209",
        courseTitle: "Power Station, Switchgear & Protection",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Power Plants & Switchgear",
            description: "Thermal, nuclear, renewable power stations. Circuit breakers (SF6, vacuum, oil), protective relays, lightning arresters.",
          },
        ],
      },
      {
        courseNo: "ECE 4211",
        courseTitle: "Computer Networks",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Network Architecture & Protocols",
            description: "OSI and TCP/IP models, Data Link framing & ARQ, routing algorithms (OSPF, BGP), TCP/UDP, network security & cryptography.",
          },
        ],
      },
      {
        courseNo: "ECE 4212",
        courseTitle: "Computer Networks Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Networking Lab", description: "Cisco Packet Tracer simulation, socket programming, routing and packet analysis with Wireshark." }],
      },
      {
        courseNo: "ECE 4223",
        courseTitle: "Digital Image Processing",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [
          {
            title: "Image Processing Techniques",
            description: "Spatial and frequency domain filtering, edge detection (Canny), segmentation, morphology, JPEG and wavelet compression.",
          },
        ],
      },
      {
        courseNo: "ECE 4224",
        courseTitle: "Digital Image Processing Sessional",
        type: "SESSIONAL",
        contactHrs: "3",
        credits: 1.5,
        topics: [{ title: "Image Lab", description: "Computer vision and image analysis algorithms implemented in OpenCV / Python." }],
      },
      {
        courseNo: "ECE 42**",
        courseTitle: "Optional III (Elective)",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [{ title: "Elective Subject", description: "Selected from Optional III pool (e.g., Unix Programming, Network Security, Parallel Computing, Computer Graphics, Computer Vision, Data Mining, Machine Learning)." }],
      },
      {
        courseNo: "ECE 42**",
        courseTitle: "Optional III Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Elective Lab", description: "Laboratory work supporting the selected Optional III theory course." }],
      },
      {
        courseNo: "ECE 42**",
        courseTitle: "Optional IV (Elective)",
        type: "THEORY",
        contactHrs: "3",
        credits: 3.0,
        topics: [{ title: "Elective Subject", description: "Selected from Optional IV pool (e.g., Computer Aided Instrumentation, Power System Design, Renewable Energy, Microwave Engineering, High Voltage Engineering, System Simulation)." }],
      },
      {
        courseNo: "ECE 42**",
        courseTitle: "Optional IV Sessional",
        type: "SESSIONAL",
        contactHrs: "3/2",
        credits: 0.75,
        topics: [{ title: "Elective Lab", description: "Laboratory work supporting the selected Optional IV theory course." }],
      },
      {
        courseNo: "ECE 4000",
        courseTitle: "Thesis / Project-II",
        type: "SESSIONAL",
        contactHrs: "6.0",
        credits: 3.0,
        topics: [{ title: "Thesis Defense", description: "Final thesis completion, dissertation submission, board viva and formal defense." }],
      },
    ],
  },
];

export const electiveCourses: ElectiveCourse[] = [
  // Optional I
  { courseNo: "ECE 4111", courseTitle: "Digital Communication", credits: 3.0, contactHrs: "3", pool: "Optional I", stream: "Electrical" },
  { courseNo: "ECE 4115", courseTitle: "Antennas & Propagations", credits: 3.0, contactHrs: "3", pool: "Optional I", stream: "Electrical" },
  { courseNo: "ECE 4117", courseTitle: "Radar & Satellite Communication", credits: 3.0, contactHrs: "3", pool: "Optional I", stream: "Electrical" },
  { courseNo: "ECE 4125", courseTitle: "Radio & TV Engineering", credits: 3.0, contactHrs: "3", pool: "Optional I", stream: "Electrical" },
  { courseNo: "ECE 4141", courseTitle: "Fiber Optic Communication", credits: 3.0, contactHrs: "3", pool: "Optional I", stream: "Electrical" },
  { courseNo: "ECE 4143", courseTitle: "Bio-medical Engineering", credits: 3.0, contactHrs: "3", pool: "Optional I", stream: "Electrical" },

  // Optional II
  { courseNo: "ECE 4127", courseTitle: "VLSI Design", credits: 3.0, contactHrs: "3", pool: "Optional II", stream: "Computer" },
  { courseNo: "ECE 4129", courseTitle: "Network Planning", credits: 3.0, contactHrs: "3", pool: "Optional II", stream: "Computer" },
  { courseNo: "ECE 4131", courseTitle: "Wireless Networks", credits: 3.0, contactHrs: "3", pool: "Optional II", stream: "Computer" },
  { courseNo: "ECE 4133", courseTitle: "Artificial Intelligence", credits: 3.0, contactHrs: "3", pool: "Optional II", stream: "Computer" },
  { courseNo: "ECE 4135", courseTitle: "Human Computer Interaction", credits: 3.0, contactHrs: "3", pool: "Optional II", stream: "Computer" },

  // Optional III
  { courseNo: "ECE 4221", courseTitle: "Unix Programming", credits: 3.0, contactHrs: "3", pool: "Optional III", stream: "Computer" },
  { courseNo: "ECE 4227", courseTitle: "Network Security", credits: 3.0, contactHrs: "3", pool: "Optional III", stream: "Computer" },
  { courseNo: "ECE 4237", courseTitle: "Parallel & Distributed Processing", credits: 3.0, contactHrs: "3", pool: "Optional III", stream: "Computer" },
  { courseNo: "ECE 4239", courseTitle: "Computer Graphics & Animations", credits: 3.0, contactHrs: "3", pool: "Optional III", stream: "Computer" },
  { courseNo: "ECE 4241", courseTitle: "Computer Vision", credits: 3.0, contactHrs: "3", pool: "Optional III", stream: "Computer" },
  { courseNo: "ECE 4243", courseTitle: "Data Mining", credits: 3.0, contactHrs: "3", pool: "Optional III", stream: "Computer" },
  { courseNo: "ECE 4245", courseTitle: "Machine Learning", credits: 3.0, contactHrs: "3", pool: "Optional III", stream: "Computer" },

  // Optional IV
  { courseNo: "ECE 4247", courseTitle: "Computer Aided Instrumentation", credits: 3.0, contactHrs: "3", pool: "Optional IV", stream: "Electrical" },
  { courseNo: "ECE 4249", courseTitle: "Computer Aided Power System Design", credits: 3.0, contactHrs: "3", pool: "Optional IV", stream: "Electrical" },
  { courseNo: "ECE 4251", courseTitle: "Renewable Energy", credits: 3.0, contactHrs: "3", pool: "Optional IV", stream: "Electrical" },
  { courseNo: "ECE 4253", courseTitle: "Microwave Engineering", credits: 3.0, contactHrs: "3", pool: "Optional IV", stream: "Electrical" },
  { courseNo: "ECE 4255", courseTitle: "Power System Operation & Control", credits: 3.0, contactHrs: "3", pool: "Optional IV", stream: "Electrical" },
  { courseNo: "ECE 4257", courseTitle: "High Voltage Engineering", credits: 3.0, contactHrs: "3", pool: "Optional IV", stream: "Electrical" },
  { courseNo: "ECE 4259", courseTitle: "System Simulation & Modeling", credits: 3.0, contactHrs: "3", pool: "Optional IV", stream: "Electrical" },
];

export const creditDistributionCategories = [
  { category: "Basic Sciences and Mathematics", percentage: "12.18%", credits: 19.5, subcategories: "Math (12.0), Physics (3.75), Chemistry (3.75)" },
  { category: "Language and General Education", percentage: "7.98%", credits: 12.75, subcategories: "History/Sociology (3.0), Legal/Management (3.0), Economics (3.0), English (3.75)" },
  { category: "Other Engineering", percentage: "5.15%", credits: 8.25, subcategories: "Mechatronics (3.75), Mechanical (3.75), Civil (0.75)" },
  { category: "Program Courses", percentage: "65.31%", credits: 104.5, subcategories: "Core Electrical (47.25), Core Computer (46.50), Thesis/Training (10.0), Ethics (0.75)" },
  { category: "Technical Electives", percentage: "9.38%", credits: 15.0, subcategories: "Electrical Electives (7.50), Computer Electives (7.50)" },
];

export const gradingSystemData = [
  { numerical: "80% or above", letter: "A+ (A Plus)", point: "4.00" },
  { numerical: "75% to less than 80%", letter: "A (A Regular)", point: "3.75" },
  { numerical: "70% to less than 75%", letter: "A- (A Minus)", point: "3.50" },
  { numerical: "65% to less than 70%", letter: "B+ (B Plus)", point: "3.25" },
  { numerical: "60% to less than 65%", letter: "B (B Regular)", point: "3.00" },
  { numerical: "55% to less than 60%", letter: "B- (B Minus)", point: "2.75" },
  { numerical: "50% to less than 55%", letter: "C+ (C Plus)", point: "2.50" },
  { numerical: "45% to less than 50%", letter: "C (C Regular)", point: "2.25" },
  { numerical: "40% to less than 45%", letter: "D", point: "2.00" },
  { numerical: "Less than 40%", letter: "F", point: "0.00" },
];

export const marksDistributionData = {
  theory: {
    continuous: {
      total: 40,
      breakdown: [
        { item: "Class Attendance & Participation", marks: 10 },
        { item: "Class Tests (Best 3 out of 4)", marks: 20 },
        { item: "Assignment / Project / Viva / Presentation", marks: 10 },
      ],
    },
    finalExam: {
      total: 60,
      note: "Minimum 15 marks required out of 60 in the semester final examination to pass",
    },
  },
  sessional: {
    total: 100,
    breakdown: [
      { item: "Class Participation & Attendance", marks: 10 },
      { item: "Quizzes", marks: 20 },
      { item: "Lab Performance, Lab Report, Lab Final & Viva", marks: 45 },
      { item: "Board Viva (Compulsory)", marks: 25 },
    ],
  },
  attendanceScale: [
    { range: "90% and above", marks: 10 },
    { range: "85% to less than 90%", marks: 9 },
    { range: "80% to less than 85%", marks: 8 },
    { range: "75% to less than 80%", marks: 7 },
    { range: "70% to less than 75%", marks: 6 },
    { range: "65% to less than 70%", marks: 5 },
    { range: "60% to less than 65%", marks: 4 },
    { range: "Less than 60%", marks: 0 },
  ],
};
