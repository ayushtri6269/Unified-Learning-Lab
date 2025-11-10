// API Configuration
// Supports both Vite (VITE_) and Create React App (REACT_APP_) env variables
export const API_BASE_URL =
    process.env.REACT_APP_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:5001/api';

// App Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    APTITUDE_TEST: '/aptitude-test',
    BINARY_SEARCH: '/binary-search',
    BINARY_TREE: '/binary-tree',
    STACK_QUEUE: '/stack-queue',
    CNN_VISUALIZER: '/cnn-visualizer',
};

// Topics
export const TOPICS = {
    DATA_STRUCTURES: 'data-structures',
    ALGORITHMS: 'algorithms',
    MACHINE_LEARNING: 'machine-learning',
    NEURAL_NETWORKS: 'neural-networks',
};

// Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
};
