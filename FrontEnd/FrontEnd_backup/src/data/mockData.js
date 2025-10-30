export const mockQuestions = [
    {
        id: "q1",
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        explanation: "Paris is the capital and largest city of France.",
        subject: "Geography"
    },
    {
        id: "q2",
        question: "Which of the following is a prime number?",
        options: ["4", "6", "8", "7"],
        correctAnswer: 3,
        explanation: "7 is a prime number because it's only divisible by 1 and itself.",
        subject: "Mathematics"
    },
    {
        id: "q3",
        question: "What is the past tense of 'go'?",
        options: ["goed", "went", "gone", "going"],
        correctAnswer: 1,
        explanation: "The past tense of 'go' is 'went'.",
        subject: "English"
    },
    {
        id: "q4",
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: 0,
        explanation: "Water is composed of two hydrogen atoms and one oxygen atom (H2O).",
        subject: "Chemistry"
    },
    {
        id: "q5",
        question: "Who wrote Romeo and Juliet?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correctAnswer: 1,
        explanation: "Romeo and Juliet was written by William Shakespeare.",
        subject: "Literature"
    }
];

export const mockTests = [
    {
        id: "test1",
        title: "UTBK Mathematics Practice",
        description: "Comprehensive mathematics practice test covering algebra, geometry, and calculus",
        category: "Mathematics",
        difficulty: "Medium",
        duration: 90,
        questionCount: 25,
        isPremium: false,
        questions: mockQuestions.slice(0, 3)
    },
    {
        id: "test2",
        title: "English Proficiency Test",
        description: "Test your English grammar, vocabulary, and reading comprehension",
        category: "English",
        difficulty: "Easy",
        duration: 60,
        questionCount: 20,
        isPremium: false,
        questions: mockQuestions.slice(1, 4)
    },
    {
        id: "test3",
        title: "Science Comprehensive",
        description: "Advanced science test covering physics, chemistry, and biology",
        category: "Science",
        difficulty: "Hard",
        duration: 120,
        questionCount: 40,
        isPremium: true,
        price: 25000,
        questions: mockQuestions
    },
    {
        id: "test4",
        title: "General Knowledge Quiz",
        description: "Test your general knowledge across various subjects",
        category: "General",
        difficulty: "Medium",
        duration: 45,
        questionCount: 15,
        isPremium: false,
        questions: mockQuestions.slice(0, 2)
    },
    {
        id: "test5",
        title: "Advanced Mathematics",
        description: "Premium mathematics test with complex problems and detailed explanations",
        category: "Mathematics",
        difficulty: "Hard",
        duration: 150,
        questionCount: 50,
        isPremium: true,
        price: 35000,
        questions: mockQuestions
    }
];

export const mockPremiumClasses = [
    {
        id: "class1",
        title: "UTBK Mathematics Mastery",
        description: "Complete UTBK mathematics preparation with expert instructors",
        instructor: "Dr. Ahmad Susanto",
        price: 299000,
        duration: "8 weeks",
        image: "/api/placeholder/400/300",
        features: [
            "40+ hours of video content",
            "Live Q&A sessions",
            "Practice tests",
            "Detailed explanations",
            "Certificate of completion"
        ],
        category: "Mathematics"
    },
    {
        id: "class2",
        title: "English for Academic Success",
        description: "Improve your English skills for academic and professional success",
        instructor: "Sarah Johnson",
        price: 199000,
        duration: "6 weeks",
        image: "/api/placeholder/400/300",
        features: [
            "Grammar fundamentals",
            "Vocabulary building",
            "Reading comprehension",
            "Writing skills",
            "Speaking practice"
        ],
        category: "English"
    },
    {
        id: "class3",
        title: "Science Fundamentals",
        description: "Master the fundamentals of physics, chemistry, and biology",
        instructor: "Prof. Maria Santos",
        price: 349000,
        duration: "10 weeks",
        image: "/api/placeholder/400/300",
        features: [
            "Interactive experiments",
            "3D visualizations",
            "Laboratory simulations",
            "Research projects",
            "Expert mentorship"
        ],
        category: "Science"
    }
];

export const categories = [
    "All",
    "Mathematics",
    "English",
    "Science",
    "General",
    "History",
    "Geography"
];

export const difficulties = ["All", "Easy", "Medium", "Hard"];