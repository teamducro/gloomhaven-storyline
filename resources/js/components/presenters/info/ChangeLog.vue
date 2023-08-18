<template>
    <div>
        <h2 id="change-log" class="mt-8 mb-4 text-lg">{{ $t('Change log') }}</h2>

        <p class="my-4">
            {{ $t('changelog.text') }}
        </p>

        <div class="flex flex-col">
            <div class="overflow-hidden rounded-lg">
                <table class="min-w-full divide-y divide-gray-100">
                    <thead class="bg-black2-50">
                    <tr>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                            {{ $t('Version') }}
                        </th>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                            {{ $t('Description') }}
                        </th>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                            {{ $t('Release&nbsp;date') }}
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
                {version: '1.0', description: 'Stable release.', date: dayjs('2020-02-08')},
                {version: '1.1', description: 'Added quest summaries', date: dayjs('2020-02-20')},
                {version: '1.2', description: 'Added treasures', date: dayjs('2020-02-25')},
                {
                    version: '1.3',
                    description: 'Added some hidden scenario unlocks',
                    date: dayjs('2020-02-26')
                },
                {version: '1.4', description: 'Menu', date: dayjs('2020-03-05')},
                {version: '1.5', description: 'Scenario list view', date: dayjs('2020-03-15')},
                {version: '1.6', description: 'Scenario filters', date: dayjs('2020-03-18')},
                {version: '1.7', description: 'Tooltips', date: dayjs('2020-03-22')},
                {version: '1.8', description: 'Side scenarios and donations', date: dayjs('2020-03-27')},
                {
                    version: '1.9',
                    description: 'Map view, storyline colors and more filters',
                    date: dayjs('2020-04-03')
                },
                {
                    version: '1.10',
                    description: 'Personal quests, city, road events',
                    date: dayjs('2020-04-04')
                },
                {version: '1.11', description: 'Added a legend', date: dayjs('2020-04-07')},
                {version: '1.12', description: 'Speed improvements', date: dayjs('2020-04-08')},
                {version: '1.13', description: 'Multi language support', date: dayjs('2020-04-21')},
                {version: '1.14', description: 'Achievement support', date: dayjs('2020-05-12')},
                {version: '1.15', description: 'Achievement improvements', date: dayjs('2020-05-18')},
                {version: '1.16', description: 'Language switcher', date: dayjs('2020-05-18')},
                {version: '2.0', description: 'Synchronize progress', date: dayjs('2020-07-06')},
                {version: '2.1', description: 'Party sheet', date: dayjs('2020-08-31')},
                {
                    version: '2.2',
                    description: 'Share party sheet in free version',
                    date: dayjs('2020-09-05')
                },
                {
                    version: '2.3',
                    description: 'Sync progress after connection lost, sync messages in bottom right, ctrl+s support',
                    date: dayjs('2020-10-03')
                },
                {
                    version: '2.4',
                    description: 'Virtual Gloomhaven Board support',
                    date: dayjs('2020-10-17')
                },
                {version: '2.5', description: 'Launch website', date: dayjs('2020-10-29')},
                {
                    version: '2.6',
                    description: 'Added ability to add achievements manually (only gained by event cards)',
                    date: dayjs('2020-11-18')
                },
                {
                    version: '2.7',
                    description: 'Snapshots and data transfer between campaigns',
                    date: dayjs('2020-12-26')
                },
                {version: '2.8', description: 'Italian language', date: dayjs('2021-01-15')},
                {version: '2.9', description: 'Item Database', date: dayjs('2021-02-03')},
                {version: '2.10', description: 'Support for Forgotten Circles', date: dayjs('2021-03-29')},
                {
                    version: '2.11',
                    description: 'Summaries for Forgotten Circles',
                    date: dayjs('2021-04-12')
                },
                {version: '2.12', description: 'German language', date: dayjs('2021-04-20')},
                {version: '2.13', description: 'New scenarios table', date: dayjs('2021-04-22')},
                {version: '2.14', description: 'Spanish language', date: dayjs('2021-05-01')},
                {version: '2.15', description: 'Draw event cards', date: dayjs('2021-05-23')},
                {version: '2.16', description: 'Patreon', date: dayjs('2021-06-09')},
                {version: '2.17', description: 'Character sheets', date: dayjs('2021-08-14')},
                {version: '3.0', description: 'Jaws of the Lion', date: dayjs('2021-10-08')},
                {version: '3.1', description: 'Personal quests', date: dayjs('2021-11-25')},
                {version: '3.2', description: 'Add more translation support', date: dayjs('2022-01-31')},
                {
                    version: '3.3',
                    description: 'Updated Spanish, French and German translations',
                    date: dayjs('2022-02-18')
                },
                {version: '3.4', description: 'Add solo scenarios', date: dayjs('2022-03-06')},
                {version: '3.5', description: 'Buy and sell items', date: dayjs('2022-04-02')},
                {version: '3.6', description: 'Jotl map with stickers', date: dayjs('2022-04-06')},
                {version: '3.7', description: 'Improved synchronization between members', date: dayjs('2022-04-26')},
                {version: '3.8', description: 'Add character abilities', date: dayjs('2022-06-04')},
                {version: '3.9', description: 'Manage abilities for each character level', date: dayjs('2022-06-13')},
                {version: '3.10', description: 'Add beta support for Crimson Scales', date: dayjs('2022-07-17')},
                {version: '3.11', description: 'Crimson Scales out of beta and add support to use items across games', date: dayjs('2023-01-02')},
                {version: '3.12', description: 'A read only sharing option for shared campaigns', date: dayjs('2023-01-09')},
                {version: '3.13', description: 'Added attack modifier cards to character sheets', date: dayjs('2023-01-21')},
                {version: '3.14', description: 'Change font', date: dayjs('2023-02-19')},
                {version: '3.15', description: 'Added missing Rift event cards to Forgotten Circles', date: dayjs('2023-03-10')},
                {version: '3.16', description: 'Add beta support for Frosthaven', date: dayjs('2023-08-18')},
            ].reverse()
        }
    },
    mounted() {
    },
    methods: {}
}
</script>
