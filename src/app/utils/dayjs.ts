import * as dayjs from 'dayjs';

import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import * as duration from 'dayjs/plugin/duration';
import * as isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(weekOfYear);
dayjs.extend(duration);
dayjs.extend(isBetween);

export default dayjs;
