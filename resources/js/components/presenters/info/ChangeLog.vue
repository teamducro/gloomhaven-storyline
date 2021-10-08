<template>
    <div>
        <h2 id="change-log" class="mt-8 mb-4 text-lg">{{ $t('Change log') }}</h2>

        <p class="my-4">
            Only somewhat big features are included, every update brings bug fixes and improvements to the app!
        </p>

        <div class="flex flex-col">
            <div class="overflow-hidden rounded-lg">
                <table class="min-w-full divide-y divide-gray-100">
                    <thead class="bg-black2-50">
                    <tr>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                            Version
                        </th>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                            Description
                        </th>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                            Release&nbsp;date
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(log, i) in logs"
                        :class="{'bg-black2-25': i % 2 !== 0}">
                        <td class="px-4 py-2 text-sm font-bold text-white">
                            {{ log.version }}
                        </td>
                        <td class="px-4 py-2 text-sm text-white">
                            {{ log.description }}
                        </td>
                        <td class="px-4 py-2 text-sm text-right text-white">
                            {{ log.date.format("ll") }}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs";

export default {
    data() {
        return {
            logs: [
                {version: 1.0, description: 'Stable release.', date: dayjs('02-08-2020')},
                {version: 1.1, description: 'Added quest summaries', date: dayjs('02-20-2020')},
                {version: 1.2, description: 'Added treasures', date: dayjs('02-25-2020')},
                {
                    version: 1.3,
                    description: 'Added some hidden scenario unlocks',
                    date: dayjs('02-26-2020')
                },
                {version: 1.4, description: 'Menu', date: dayjs('03-05-2020')},
                {version: 1.5, description: 'Scenario list view', date: dayjs('03-15-2020')},
                {version: 1.6, description: 'Scenario filters', date: dayjs('03-18-2020')},
                {version: 1.7, description: 'Tooltips', date: dayjs('03-22-2020')},
                {version: 1.8, description: 'Side scenarios and donations', date: dayjs('03-27-2020')},
                {
                    version: 1.9,
                    description: 'Map view, storyline colors and more filters',
                    date: dayjs('04-03-2020')
                },
                {
                    version: 1.10,
                    description: 'Personal quests, city, road events',
                    date: dayjs('04-04-2020')
                },
                {version: 1.11, description: 'Added a legend', date: dayjs('04-07-2020')},
                {version: 1.12, description: 'Speed improvements', date: dayjs('04-08-2020')},
                {version: 1.13, description: 'Multi language support', date: dayjs('04-21-2020')},
                {version: 1.14, description: 'Achievement support', date: dayjs('05-12-2020')},
                {version: 1.15, description: 'Achievement improvements', date: dayjs('05-18-2020')},
                {version: 1.16, description: 'Language switcher', date: dayjs('05-18-2020')},
                {version: 2.0, description: 'Synchronize progress', date: dayjs('07-06-2020')},
                {version: 2.1, description: 'Party sheet', date: dayjs('08-31-2020')},
                {
                    version: 2.2,
                    description: 'Share party sheet in free version',
                    date: dayjs('09-05-2020')
                },
                {
                    version: 2.3,
                    description: 'Sync progress after connection lost, sync messages in bottom right, ctrl+s support',
                    date: dayjs('10-03-2020')
                },
                {
                    version: 2.4,
                    description: 'Virtual Gloomhaven Board support',
                    date: dayjs('10-17-2020')
                },
                {version: 2.5, description: 'Launch website', date: dayjs('10-29-2020')},
                {
                    version: 2.6,
                    description: 'Added ability to add achievements manually (only gained by event cards)',
                    date: dayjs('11-18-2020')
                },
                {
                    version: 2.7,
                    description: 'Snapshots and data transfer between campaigns',
                    date: dayjs('12-26-2020')
                },
                {version: 2.8, description: 'Italian language', date: dayjs('01-15-2021')},
                {version: 2.9, description: 'Item Database', date: dayjs('02-03-2021')},
                {version: 2.10, description: 'Support for Forgotten Circles', date: dayjs('03-29-2021')},
                {
                    version: 2.11,
                    description: 'Summaries for Forgotten Circles',
                    date: dayjs('04-12-2021')
                },
                {version: 2.12, description: 'German language', date: dayjs('04-20-2021')},
                {version: 2.13, description: 'New scenarios table', date: dayjs('04-22-2021')},
                {version: 2.14, description: 'Spanish language', date: dayjs('05-01-2021')},
                {version: 2.15, description: 'Draw event cards', date: dayjs('05-23-2021')},
                {version: 2.16, description: 'Patreon', date: dayjs('06-09-2021')},
                {version: 2.17, description: 'Character sheets', date: dayjs('08-14-2021')},
                {version: 3.0, description: 'Jaws of the Lion', date: dayjs('10-08-2021')}
            ].reverse()
        }
    },
    mounted() {
    },
    methods: {}
}
</script>
