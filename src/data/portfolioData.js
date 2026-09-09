export const portfolioData = {
  profile: {
    name: "Fatima Saadat Ali",
    title: "Computer Science Undergraduate @ UoBD",
    year: "2nd Year Student",
    university: "University of Birmingham Dubai",
    location: "Dubai, UAE",
    tagline: "Exploring Machine Learning and Data Science in Cheminformatics, Bioinformatics, Quantitative Analysis, Computer Vision.",
    bio: [
      "Hi there! I'm a Computer Science student at University of Birmingham Dubai with a passion for learning Data Science and ML and applying them to solve real-world problems",
      "My current targets for research focus on using Graph Neural Networks to model relationships in data, and combining both RNNs and GNNs to get more powerful models like Spatio-temporal GNNs, I am also expanding knowledge on how current LLMs are powered (: "
    ],
    socialLinks: {
      github: "https://github.com/FatimaSaadat17",
      linkedin: "https://linkedin.com",
      email: "fsaadat917@proton.me | fsaadat917@gmail.com"
    },
    stats: [
      { label: "Focus", value: "Real-world applications of ML" },
      { label: "Domain", value: "Data Science & ML" },
      { label: "University", value: "UoBD CS '28" },
      { label: "Status", value: "Open for Research & Internships" }
    ]
  },

  skills: {
    categories: [
      {
        name: "AI & Machine Learning",
        color: "#EFC96A",
        skills: [
          { name: "Recurrent Neural Networks (RNN)", level: "Beginner" },
          { name: "Convolutional Neural Networks (CNN)", level: "Intermediate" },
          { name: "PyTorch & PyTorch Geometric (PyG)", level: "Intermediate" },
          { name: "Graph Neural Networks (GNN)", level: "Beginner" },
          { name: "Molecular Modeling (ChemInformatics)", level: "Research" },
          { name: "Extreme Gradient Boosting using XGBoost", level: "Intermediate" },
          { name: "Sci-kit learn library", level: "Advanced" }
        ]
      },
      {
        name: "Programming Languages",
        color: "#97D2D9",
        skills: [
          { name: "Python", level: "Proficient" },
          { name: "JavaScript (ES6+)", level: "Proficient" },
          { name: "C / C++", level: "Intermediate" },
          { name: "SQL", level: "Intermediate" },
          { name: "HTML5 / CSS3", level: "Proficient" },
          {name: "Java", level: "Proficient"}
        ]
      },
      {
        name: "Web & Full-Stack",
        color: "#D98296",
        skills: [
          { name: "React 19 & Vite", level: "Advanced" },
          { name: "Node.js & Express", level: "Intermediate" },
          { name: "REST APIs & JSON Services", level: "Intermediate" },
          { name: "Spring Boot", level: "Beginner" },
          { name: "UI/UX & Responsive Design", level: "Design-Savvy" }
        ]
      },
      {
        name: "Developer Tools",
        color: "#BBD89E",
        skills: [
          { name: "Git & GitHub Workflow", level: "Proficient" },
          { name: "Jupyter & Colab", level: "Daily Driver" },
          { name: "Linear Algebra & Graph Theory", level: "Coursework" },
          { name: "Statistical Modeling", level: "Intermediate" },
          { name: "Unix and Linux Usage", level: "Proficient" }
        ]
      }
    ]
  },

  projects: [
    {
      id: "bindingdb-dta",
      title: "Molecular DTA Predictor using XGBoost",
      category: "Cheminformatics & AI",
      badge: "Personal Research Project",
      description: "XGBoost Network pipeline evaluating Drug-Target Affinity on the TDAC dataset. The model takes in SMILES strings and calculates molecular descriptors using RDKit, converts SMILES strings to MorganFP and uses these to predict pKD.",
      tags: ["XGBoost", "sci-kit learn", "RDKit", "BindingDB", "Regression Modelling"],
      links: {
        code: "https://github.com/FatimaSaadat17/Molecule-pKd-predictor-model.git",
        paper: "https://academic.oup.com/nar/article-abstract/35/suppl_1/D198/1119109"
      },
      color: "#97D2D9"
    },
    {
      id: "bbbp-predict",
      title: "BBBP (Blood Brain Permeability Prediction) Using SVM ",
      category: "Cheminformatics & AI",
      badge: "Personal Research Project",
      description: "This project explores molecular data using cheminformatics features and classical machine learning models. It focuses on transforming high-dimensional molecular representations into meaningful embeddings and building predictive models.",
      tags: ["Python", "Sci-kit Learn", "PCA", "Support Vector Machines", "Classification", "RDKit"],
      links: {
        code: "https://github.com/FatimaSaadat17/B3DB_Model.git",
        paper: "https://www.sciencedirect.com/science/article/abs/pii/S2468111325000489"
      },
      color: "#EFC96A"
    },
    {
      id: "weather-app",
      title: "Modern Weather Dashboard",
      category: "Full Stack App",
      badge: "Web App",
      description: "Interactive real-time weather application featuring dynamic SVG weather conditions, forecast maps, and atmospheric metrics with clean responsive UI.",
      tags: ["JavaScript", "Node.js", "Express", "Weather API", "CSS Grid"],
      links: {
        code: "https://github.com/FatimaSaadat17/Weather-App.git"
      },
      color: "#BBD89E"
    },
    {
      id: "yolo-detection",
      title: "Object Detection in Cell Microscopy Images",
      category: "Cheminformatics & AI",
      badge: "Computer Vision Project",
      description: "Used a YOLO26 model to detect cells in microscopy images on the https://huggingface.co/datasets/mario-dg/scc_real dataset",
      tags: ["Python", "Data Preprocessing", "Computer Vision", "Ultralytics YOLO", "Pandas", "Matplotlib"],
      links: {
        code: "#"
      },
      color: "#D98296"
    }
  ],

  initialGreetings: [
    {
      id: "g-1",
      name: "John Pork",
      email: "john_pork@outlook.com",
      message: "Why aren't you picking up my call? I have something important to tell you",
      stamp: "🐷",
      timestamp: "2026-09-09T14:30:00.000Z"
    }
  ]
};
