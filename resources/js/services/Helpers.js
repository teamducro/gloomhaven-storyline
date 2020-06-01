export default {
    inProduction() {
        return process.env.NODE_ENV === 'production';
    }
}
