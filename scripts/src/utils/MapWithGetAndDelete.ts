class MapWithGetAndDelete<K, V> extends Map<K, V> {
    public getAndDelete(key: K) {
        const v = super.get(key);
        super.delete(key);
        return v;
    }
}

export default MapWithGetAndDelete;