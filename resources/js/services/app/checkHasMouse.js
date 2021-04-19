export default function checkHasMouse($bus) {
    const body = document.getElementsByTagName('body')[0];

    const emitHasMouse = (e) => {
        $bus.$emit('has-mouse', true);
        $bus.$emit('scenarios-updated');
    }

    body.addEventListener('touchstart', () => {
        body.removeEventListener('mousemove', emitHasMouse);
    }, {once: true});

    body.addEventListener('mousemove', emitHasMouse, {once: true});
}
