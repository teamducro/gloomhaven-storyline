// Imported first by both entry files: other modules use these globals at import time.
import _ from 'lodash';
import cash from 'cash-dom';
import collect from 'collect.js';
import axios from 'axios';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

window._ = _;
window.c = cash;
window.collect = collect;
window.axios = axios.create({
    baseURL: import.meta.env.MIX_API_URL,
    withCredentials: true,
    withXSRFToken: true,
    // Lets the API refuse writes from builds too old to keep fields they don't know.
    headers: {'X-Client-Version': __APP_VERSION__}
});

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
