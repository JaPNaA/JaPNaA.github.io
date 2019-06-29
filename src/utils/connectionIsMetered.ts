export default function connectionIsMetered(): boolean {
    const connection = (navigator as any).connection;
    if (connection) {
        return connection.saveData;
    } else {
        return false;
    }
}