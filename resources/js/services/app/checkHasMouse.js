export default function checkHasMouse($bus) {
    c('body').one('touchstart.test', (e) => {
        c('body').off('mousemove.test');
    }).one('mousemove.test', (e) => {
        $bus.$emit('has-mouse', true);
        $bus.$emit('scenarios-updated');
    });
}
