type ClassImporter<T> = () => Promise<{ default: T }>;
export default ClassImporter;