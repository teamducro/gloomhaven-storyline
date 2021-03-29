export default function checkOrientation($bus) {
    let updateViewportHeight = function () {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    let isPortrait = window.matchMedia("(orientation: portrait)").matches;

    window.addEventListener('resize', _.debounce(() => {
        isPortrait = window.matchMedia("(orientation: portrait)").matches;
        $bus.$emit('orientation-changed', isPortrait);
        $bus.$emit('windows-resized');

        updateViewportHeight();
    }, 300));
    $bus.$emit('orientation-changed', isPortrait);
    updateViewportHeight();
}
