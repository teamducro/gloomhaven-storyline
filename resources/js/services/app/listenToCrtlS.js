import Helpers from "../Helpers";
import StorySyncer from "../StorySyncer";

export default function listenToCrtlS() {
    let storySyncer = new StorySyncer;
    document.addEventListener('keydown', (e) => {
        if ((Helpers.isMac() ? e.metaKey : e.ctrlKey) && (e.code === 'KeyS')) {
            e.preventDefault();
            storySyncer.store(true);
        }
    }, false);
}
