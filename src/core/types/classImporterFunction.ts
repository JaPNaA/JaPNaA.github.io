type ClassImporterFunction<T> = () => Promise<{ default: T }>;
export default ClassImporterFunction;