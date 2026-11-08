// FH 102 used to link to 103; now treasure #57 unlocks it. Tick the treasure where 103 is already visible, so it stays.
export default function migrateLeadDoorTreasure(campaignData) {
    const intoTheBlack = campaignData['scenario-fh-102'];
    const leadDoor = campaignData['scenario-fh-103'];

    if (intoTheBlack?.state !== 'complete' || !leadDoor?.state || leadDoor.state === 'hidden') {
        return campaignData;
    }

    const treasures = intoTheBlack.treasures || [];
    if (!treasures.map(Number).includes(57)) {
        campaignData['scenario-fh-102'] = {...intoTheBlack, treasures: [...treasures, 57]};
    }

    return campaignData;
}
