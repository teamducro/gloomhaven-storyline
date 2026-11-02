import {createI18n} from 'vue-i18n';
import {registerMessageCompiler} from '@intlify/core-base';

// vue-i18n 11 in legacy mode, made as lenient as vue-i18n 8 was.
export default function createLegacyI18n(messages) {
    // Legacy mode ignores the messageCompiler option, so replace the global one.
    registerMessageCompiler(messageCompiler);

    const i18n = createI18n({
        legacy: true,
        locale: 'en',
        fallbackLocale: 'en',
        messages,
        silentTranslationWarn: true,
        silentFallbackWarn: true,
        warnHtmlInMessage: 'off',
    });

    // vue-i18n 8 returned '' for an empty key instead of throwing, and returned arrays/objects as-is.
    const translate = i18n.global.t.bind(i18n.global);
    i18n.global.t = (key, ...args) => {
        if (!key && key !== 0) {
            return '';
        }

        const message = i18n.global.tm(key);
        return typeof message === 'object' && message !== null && Object.keys(message).length
            ? message
            : translate(key, ...args);
    };

    return i18n;
}

// Messages contain custom tokens like {TELEPORT.fh} and literal "|" that the vue-i18n 9+ message syntax rejects.
// Only {name}/{0} with a given value is replaced; "|" only splits plurals when a count is passed.
function messageCompiler(message) {
    if (typeof message !== 'string') {
        return () => message;
    }

    const choices = message.split('|').map(choice => choice.trim());

    return ctx => {
        const count = ctx.named('count');
        let text = message;
        if (choices.length > 1 && typeof count === 'number') {
            const n = Math.abs(count);
            text = choices[choices.length === 2 ? (n === 1 ? 0 : 1) : Math.min(n, 2)];
        }

        // Built through interpolate/normalize so <i18n-t> can put slot VNodes in place of placeholders.
        const parts = [];
        let last = 0;
        for (const match of text.matchAll(/\{\s*(\w+)\s*\}/g)) {
            let value = ctx.named(match[1]);
            if ((value === undefined || value === null) && /^\d+$/.test(match[1])) {
                value = ctx.list(Number(match[1]));
            }
            parts.push(text.slice(last, match.index), value === undefined || value === null ? match[0] : ctx.interpolate(value));
            last = match.index + match[0].length;
        }
        parts.push(text.slice(last));

        return ctx.normalize(parts);
    };
}
