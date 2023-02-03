export default class PreloadImage {
    handle(url, success) {
        let image = new Image();
        const baseUrl = process.env.MIX_CDN_URL || '';
        image.src = baseUrl + this.webp(url);
        image.onerror = () => {
            image.src = baseUrl + url;
            image.onerror = null;
        };

        if (typeof success === "function") {
            image.onload = success(image.src);
            return;
        }

        return new Promise((resolution, rejection) => {
            image.onload = () => {
                resolution(image.src.replace(baseUrl, ''));
            }
        });
    }

    webp(url) {
        return url.split('.').slice(0, -1) + '.webp';
    }
}
