export default function checkHasMouse($bus) {
    $('body').one('touchstart.test', (e) => {
        $('body').off('mousemove.test');
    }).one('mousemove.test', (e) => {
        $bus.$emit('has-mouse', true);
        $bus.$emit('scenarios-updated');
    });
}
