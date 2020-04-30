export default class PreloadImage {
    handle(url, success) {
        let image = new Image();
        image.src = this.webp(url);
        image.onerror = () => {
            image.src = url;
            image.onerror = null;
        };

        if (typeof success === "function") {
            image.onload = success;
            return;
        }

        return new Promise((resolution, rejection) => {
            image.onload = () => {
                resolution();
            }
        });
    }

    webp(url) {
        return url.split('.').slice(0, -1) + '.webp';
    }
}
