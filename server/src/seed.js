require("dns").setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

require("dotenv").config();

const mongoose = require("mongoose");

const Course = require("./models/course.model");

const courses = [
  // =====================================================
  // 1. REACT
  // =====================================================
  {
    title: "React.js Complete Guide",
    description:
      "Learn React.js from the fundamentals to advanced concepts and build modern frontend applications.",
    category: "Frontend Development",
    level: "Beginner",
    thumbnail: "react",
    duration: 20,
    skills: [
      "React",
      "JavaScript",
      "JSX",
      "Hooks",
      "Components",
    ],
    modules: [
      {
        title: "React Basics",
        order: 1,
        lessons: [
          {
            title: "Introduction to React",
            description:
              "Understand what React is and why it is used for modern web development.",
            order: 1,
            duration: 20,
          },
          {
            title: "Components and JSX",
            description:
              "Learn about React components and JSX syntax.",
            order: 2,
            duration: 25,
          },
          {
            title: "Props and State",
            description:
              "Understand how data is passed using props and managed using state.",
            order: 3,
            duration: 25,
          },
        ],
      },
      {
        title: "React Hooks",
        order: 2,
        lessons: [
          {
            title: "useState",
            description:
              "Learn how to manage component state using useState.",
            order: 1,
            duration: 25,
          },
          {
            title: "useEffect",
            description:
              "Learn how to perform side effects using useEffect.",
            order: 2,
            duration: 30,
          },
        ],
      },
    ],
  },

  // =====================================================
  // 2. NODE.JS
  // =====================================================
  {
    title: "Node.js and Express",
    description:
      "Build powerful backend applications and REST APIs using Node.js and Express.",
    category: "Backend Development",
    level: "Beginner",
    thumbnail: "node",
    duration: 18,
    skills: [
      "Node.js",
      "Express",
      "REST API",
      "JavaScript",
    ],
    modules: [
      {
        title: "Node.js Fundamentals",
        order: 1,
        lessons: [
          {
            title: "Introduction to Node.js",
            description:
              "Understand Node.js and its role in backend development.",
            order: 1,
            duration: 20,
          },
          {
            title: "Node Modules",
            description:
              "Learn how modules and npm packages work in Node.js.",
            order: 2,
            duration: 25,
          },
          {
            title: "Working with npm",
            description:
              "Learn how to install and manage packages using npm.",
            order: 3,
            duration: 20,
          },
        ],
      },
      {
        title: "Express.js",
        order: 2,
        lessons: [
          {
            title: "Creating an Express Server",
            description:
              "Create your first backend server using Express.js.",
            order: 1,
            duration: 25,
          },
          {
            title: "REST APIs",
            description:
              "Learn how to build RESTful APIs using Express.",
            order: 2,
            duration: 30,
          },
        ],
      },
    ],
  },

  // =====================================================
  // 3. MONGODB
  // =====================================================
  {
    title: "MongoDB Fundamentals",
    description:
      "Learn MongoDB, collections, documents, queries and database design for modern applications.",
    category: "Database",
    level: "Beginner",
    thumbnail: "mongodb",
    duration: 15,
    skills: [
      "MongoDB",
      "NoSQL",
      "Mongoose",
      "Database Design",
    ],
    modules: [
      {
        title: "MongoDB Basics",
        order: 1,
        lessons: [
          {
            title: "Introduction to MongoDB",
            description:
              "Understand MongoDB and NoSQL databases.",
            order: 1,
            duration: 20,
          },
          {
            title: "Databases and Collections",
            description:
              "Learn how databases and collections are organized in MongoDB.",
            order: 2,
            duration: 25,
          },
          {
            title: "Documents and Data",
            description:
              "Understand MongoDB documents and JSON-like data.",
            order: 3,
            duration: 20,
          },
        ],
      },
      {
        title: "MongoDB Queries",
        order: 2,
        lessons: [
          {
            title: "CRUD Operations",
            description:
              "Learn Create, Read, Update and Delete operations.",
            order: 1,
            duration: 30,
          },
          {
            title: "MongoDB with Mongoose",
            description:
              "Learn how to connect MongoDB with Node.js using Mongoose.",
            order: 2,
            duration: 30,
          },
        ],
      },
    ],
  },

  // =====================================================
  // 4. PYTHON
  // =====================================================
  {
    title: "Python Programming",
    description:
      "Master Python programming from basic syntax to object-oriented programming and practical applications.",
    category: "Programming",
    level: "Beginner",
    thumbnail: "python",
    duration: 25,
    skills: [
      "Python",
      "Programming",
      "OOP",
      "Problem Solving",
    ],
    modules: [
      {
        title: "Python Basics",
        order: 1,
        lessons: [
          {
            title: "Introduction to Python",
            description:
              "Learn what Python is and where it is used.",
            order: 1,
            duration: 20,
          },
          {
            title: "Variables and Data Types",
            description:
              "Learn Python variables and basic data types.",
            order: 2,
            duration: 25,
          },
          {
            title: "Conditional Statements",
            description:
              "Learn if, elif and else statements in Python.",
            order: 3,
            duration: 25,
          },
        ],
      },
      {
        title: "Python Programming",
        order: 2,
        lessons: [
          {
            title: "Loops",
            description:
              "Learn for loops and while loops.",
            order: 1,
            duration: 25,
          },
          {
            title: "Functions",
            description:
              "Learn how to create and use Python functions.",
            order: 2,
            duration: 25,
          },
          {
            title: "Object-Oriented Programming",
            description:
              "Understand classes, objects and inheritance in Python.",
            order: 3,
            duration: 30,
          },
        ],
      },
    ],
  },

  // =====================================================
  // 5. MACHINE LEARNING
  // =====================================================
  {
    title: "Machine Learning Fundamentals",
    description:
      "Understand machine learning algorithms, data preprocessing, model training and evaluation.",
    category: "Machine Learning",
    level: "Intermediate",
    thumbnail: "ml",
    duration: 30,
    skills: [
      "Machine Learning",
      "Python",
      "Scikit-learn",
      "Data Science",
    ],
    modules: [
      {
        title: "Machine Learning Basics",
        order: 1,
        lessons: [
          {
            title: "Introduction to Machine Learning",
            description:
              "Understand machine learning and its applications.",
            order: 1,
            duration: 25,
          },
          {
            title: "Types of Machine Learning",
            description:
              "Learn supervised, unsupervised and reinforcement learning.",
            order: 2,
            duration: 30,
          },
          {
            title: "Training and Testing Data",
            description:
              "Understand training, validation and testing datasets.",
            order: 3,
            duration: 25,
          },
        ],
      },
      {
        title: "Machine Learning Algorithms",
        order: 2,
        lessons: [
          {
            title: "Linear Regression",
            description:
              "Learn the fundamentals of linear regression.",
            order: 1,
            duration: 30,
          },
          {
            title: "Classification",
            description:
              "Understand classification problems and common algorithms.",
            order: 2,
            duration: 30,
          },
          {
            title: "Model Evaluation",
            description:
              "Learn accuracy, precision, recall and other evaluation metrics.",
            order: 3,
            duration: 25,
          },
        ],
      },
    ],
  },

  // =====================================================
  // 6. GENERATIVE AI
  // =====================================================
  {
    title: "Generative AI",
    description:
      "Learn the fundamentals of generative AI, large language models and AI application development.",
    category: "Artificial Intelligence",
    level: "Intermediate",
    thumbnail: "genai",
    duration: 22,
    skills: [
      "Generative AI",
      "LLM",
      "Prompt Engineering",
      "AI",
    ],
    modules: [
      {
        title: "Generative AI Basics",
        order: 1,
        lessons: [
          {
            title: "Introduction to Generative AI",
            description:
              "Understand generative AI and how it differs from traditional AI.",
            order: 1,
            duration: 25,
          },
          {
            title: "Large Language Models",
            description:
              "Learn what LLMs are and how they generate text.",
            order: 2,
            duration: 30,
          },
          {
            title: "Generative AI Applications",
            description:
              "Explore common applications of generative AI.",
            order: 3,
            duration: 25,
          },
        ],
      },
      {
        title: "Prompt Engineering",
        order: 2,
        lessons: [
          {
            title: "Introduction to Prompt Engineering",
            description:
              "Learn how to write effective prompts for AI models.",
            order: 1,
            duration: 25,
          },
          {
            title: "Advanced Prompting Techniques",
            description:
              "Learn structured and advanced prompting techniques.",
            order: 2,
            duration: 30,
          },
          {
            title: "Building AI Applications",
            description:
              "Understand how generative AI can be integrated into applications.",
            order: 3,
            duration: 30,
          },
        ],
      },
    ],
  },

  // =====================================================
  // 7. RAG
  // =====================================================
  {
    title: "RAG Application Development",
    description:
      "Build Retrieval-Augmented Generation applications using embeddings, vector databases and LLMs.",
    category: "Artificial Intelligence",
    level: "Advanced",
    thumbnail: "rag",
    duration: 18,
    skills: [
      "RAG",
      "Embeddings",
      "Vector Database",
      "LLM",
    ],
    modules: [
      {
        title: "RAG Fundamentals",
        order: 1,
        lessons: [
          {
            title: "Introduction to RAG",
            description:
              "Understand Retrieval-Augmented Generation and why it is useful.",
            order: 1,
            duration: 25,
          },
          {
            title: "Document Retrieval",
            description:
              "Learn how relevant information is retrieved from documents.",
            order: 2,
            duration: 30,
          },
          {
            title: "Embeddings",
            description:
              "Understand embeddings and semantic similarity.",
            order: 3,
            duration: 30,
          },
        ],
      },
      {
        title: "Building RAG Applications",
        order: 2,
        lessons: [
          {
            title: "Vector Databases",
            description:
              "Learn how vector databases store and search embeddings.",
            order: 1,
            duration: 30,
          },
          {
            title: "RAG with LLMs",
            description:
              "Learn how retrieved information is passed to an LLM.",
            order: 2,
            duration: 30,
          },
          {
            title: "Building a RAG Chatbot",
            description:
              "Understand the complete flow of a RAG chatbot.",
            order: 3,
            duration: 35,
          },
        ],
      },
    ],
  },

  // =====================================================
  // 8. AWS
  // =====================================================
  {
    title: "AWS Cloud Fundamentals",
    description:
      "Learn cloud computing fundamentals and understand the core AWS services used by developers.",
    category: "Cloud Computing",
    level: "Beginner",
    thumbnail: "aws",
    duration: 16,
    skills: [
      "AWS",
      "Cloud Computing",
      "EC2",
      "S3",
    ],
    modules: [
      {
        title: "Cloud Computing Basics",
        order: 1,
        lessons: [
          {
            title: "Introduction to Cloud Computing",
            description:
              "Understand cloud computing and its benefits.",
            order: 1,
            duration: 20,
          },
          {
            title: "Cloud Service Models",
            description:
              "Learn IaaS, PaaS and SaaS.",
            order: 2,
            duration: 25,
          },
          {
            title: "AWS Overview",
            description:
              "Understand the AWS cloud platform.",
            order: 3,
            duration: 20,
          },
        ],
      },
      {
        title: "Core AWS Services",
        order: 2,
        lessons: [
          {
            title: "Amazon EC2",
            description:
              "Learn the fundamentals of virtual servers using EC2.",
            order: 1,
            duration: 30,
          },
          {
            title: "Amazon S3",
            description:
              "Learn cloud object storage using Amazon S3.",
            order: 2,
            duration: 25,
          },
        ],
      },
    ],
  },

  // =====================================================
  // 9. DOCKER & KUBERNETES
  // =====================================================
  {
    title: "Docker and Kubernetes",
    description:
      "Learn containerization using Docker and orchestration fundamentals using Kubernetes.",
    category: "DevOps",
    level: "Intermediate",
    thumbnail: "docker",
    duration: 20,
    skills: [
      "Docker",
      "Kubernetes",
      "Containers",
      "DevOps",
    ],
    modules: [
      {
        title: "Docker Fundamentals",
        order: 1,
        lessons: [
          {
            title: "Introduction to Docker",
            description:
              "Understand containers and why Docker is used.",
            order: 1,
            duration: 25,
          },
          {
            title: "Docker Images and Containers",
            description:
              "Learn how Docker images and containers work.",
            order: 2,
            duration: 30,
          },
          {
            title: "Dockerfile",
            description:
              "Learn how to create Docker images using Dockerfiles.",
            order: 3,
            duration: 30,
          },
        ],
      },
      {
        title: "Kubernetes Fundamentals",
        order: 2,
        lessons: [
          {
            title: "Introduction to Kubernetes",
            description:
              "Understand Kubernetes and container orchestration.",
            order: 1,
            duration: 25,
          },
          {
            title: "Pods and Deployments",
            description:
              "Learn about Kubernetes pods and deployments.",
            order: 2,
            duration: 30,
          },
          {
            title: "Kubernetes Services",
            description:
              "Understand how services expose applications in Kubernetes.",
            order: 3,
            duration: 30,
          },
        ],
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    await Course.deleteMany();

    await Course.insertMany(courses);

    console.log(
      `${courses.length} courses inserted successfully`
    );

    await mongoose.connection.close();

    console.log("Database connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);

    process.exit(1);
  }
};

seedDatabase();