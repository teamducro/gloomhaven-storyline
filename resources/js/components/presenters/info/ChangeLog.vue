<template>
    <div>
        <h2 class="mt-8 mb-4 text-lg">{{ $t('Change log') }}</h2>

        <p class="my-4">
            Only somewhat big features are included, every update brings bug fixes and improvements to the app!
        </p>

        <div class="flex flex-col">
            <div class="overflow-hidden rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
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
                            {{ log.date.format("MMM Do YY") }}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";

export default {
    data() {
        return {
            logs: [
                {version: 1.0, description: 'Stable release.', date: moment('08-02-2020', "DD-MM-YYYY")},
                {version: 1.1, description: 'Added quest summaries', date: moment('20-02-2020', "DD-MM-YYYY")},
                {version: 1.2, description: 'Added treasures', date: moment('25-02-2020', "DD-MM-YYYY")},
                {
                    version: 1.3,
                    description: 'Added some hidden scenario unlocks',
                    date: moment('26-02-2020', "DD-MM-YYYY")
                },
                {version: 1.4, description: 'Menu', date: moment('05-03-2020', "DD-MM-YYYY")},
                {version: 1.5, description: 'Scenario list view', date: moment('15-03-2020', "DD-MM-YYYY")},
                {version: 1.6, description: 'Scenario filters', date: moment('18-03-2020', "DD-MM-YYYY")},
                {version: 1.7, description: 'Tooltips', date: moment('22-03-2020', "DD-MM-YYYY")},
                {version: 1.8, description: 'Side scenarios and donations', date: moment('27-03-2020', "DD-MM-YYYY")},
                {
                    version: 1.9,
                    description: 'Map view, storyline colors and more filters',
                    date: moment('03-04-2020', "DD-MM-YYYY")
                },
                {
                    version: 1.10,
                    description: 'Personal quests, city, road events',
                    date: moment('04-04-2020', "DD-MM-YYYY")
                },
                {version: 1.11, description: 'Added a legend', date: moment('07-04-2020', "DD-MM-YYYY")},
                {version: 1.12, description: 'Speed improvements', date: moment('08-04-2020', "DD-MM-YYYY")},
                {version: 1.13, description: 'Multi language support', date: moment('21-04-2020', "DD-MM-YYYY")},
                {version: 1.14, description: 'Achievement support', date: moment('12-05-2020', "DD-MM-YYYY")},
                {version: 1.15, description: 'Achievement improvements', date: moment('18-05-2020', "DD-MM-YYYY")},
                {version: 1.16, description: 'Language switcher', date: moment('18-05-2020', "DD-MM-YYYY")},
                {version: 2.0, description: 'Synchronize progress', date: moment('06-07-2020', "DD-MM-YYYY")},
                {version: 2.1, description: 'Party sheet', date: moment('31-08-2020', "DD-MM-YYYY")},
                {
                    version: 2.2,
                    description: 'Share party sheet in free version',
                    date: moment('05-09-2020', "DD-MM-YYYY")
                },
                {
                    version: 2.3,
                    description: 'Sync progress after connection lost, sync messages in bottom right, ctrl+s support',
                    date: moment('03-10-2020', "DD-MM-YYYY")
                },
                {
                    version: 2.4,
                    description: 'Virtual Gloomhaven Board support',
                    date: moment('17-10-2020', "DD-MM-YYYY")
                },
                {version: 2.5, description: 'Launch website', date: moment('29-10-2020', "DD-MM-YYYY")},
                {
                    version: 2.6,
                    description: 'Added ability to add achievements manually (only gained by event cards)',
                    date: moment('18-11-2020', "DD-MM-YYYY")
                },
                {
                    version: 2.7,
                    description: 'Snapshots and data transfer between campaigns',
                    date: moment('26-12-2020', "DD-MM-YYYY")
                },
                {version: 2.8, description: 'Italian language', date: moment('15-01-2021', "DD-MM-YYYY")},
                {version: 2.9, description: 'Item Database', date: moment('03-02-2021', "DD-MM-YYYY")},
                {version: 2.10, description: 'Support for Forgotten Circles', date: moment('29-03-2021', "DD-MM-YYYY")},
                {
                    version: 2.11,
                    description: 'Summaries for Forgotten Circles',
                    date: moment('12-04-2021', "DD-MM-YYYY")
                }
            ].reverse()
        }
    },
    mounted() {
    },
    methods: {}
}
</script>
