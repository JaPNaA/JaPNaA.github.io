type ClassImporterFunction<T> = (name: string) => Promise<{ default: T }>;
export default ClassImporterFunction;