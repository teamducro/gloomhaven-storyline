import Helpers from "../Helpers";
import StorySyncer, {flushSync} from "../StorySyncer";

export default function listenToCrtlS() {
    let storySyncer = new StorySyncer;
    document.addEventListener('keydown', (e) => {
        if ((Helpers.isMac() ? e.metaKey : e.ctrlKey) && (e.code === 'KeyS')) {
            e.preventDefault();
            storySyncer.store(true);
            flushSync();
        }
    }, false);
    // Don't hold back an edit when the tab may be closed or frozen.
    document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && flushSync());
}
