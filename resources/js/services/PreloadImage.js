export default class PreloadImage {
    handle(url) {
        let image = new Image();
        image.src = this.webp(url);
        image.onerror = () => {
            image.src = url;
            image.onerror = null;
        };
    }

    webp(url) {
        return url.split('.').slice(0, -1) + '.webp';
    }
}
