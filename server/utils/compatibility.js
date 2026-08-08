/**
 * Scores how compatible `other` is as a roommate for `me`, as a 0-100
 * percentage. Weighted overlap of stated preferences — every criterion
 * that both users filled in contributes to the total; unfilled fields
 * are simply skipped rather than counted against either user.
 */
function computeCompatibility(me, other) {
  let score = 0;
  let total = 0;

  const add = (condition, weight = 1) => {
    total += weight;
    if (condition) score += weight;
  };

  const myRP = me.roommatePreferences || {};
  const otherRP = other.roommatePreferences || {};
  const otherPI = other.personalInfo || {};

  if (myRP.department && otherRP.department) {
    add(myRP.department.toLowerCase() === otherRP.department.toLowerCase(), 2);
  }
  if (myRP.sleepSchedule && otherRP.sleepSchedule) {
    add(myRP.sleepSchedule === otherRP.sleepSchedule, 2);
  }
  if (myRP.state && otherRP.state) {
    add(myRP.state.toLowerCase() === otherRP.state.toLowerCase(), 1);
  }
  if (myRP.gender && myRP.gender !== 'Any' && otherPI.gender) {
    add(myRP.gender === otherPI.gender, 2);
  }
  if (myRP.yearOfStudy && otherRP.yearOfStudy) {
    add(Math.abs(myRP.yearOfStudy - otherRP.yearOfStudy) <= 1, 1);
  }

  const myRoom = me.roomPreferences || {};
  const otherRoom = other.roomPreferences || {};

  if (myRoom.preferredLocation && otherRoom.preferredLocation) {
    add(
      myRoom.preferredLocation.toLowerCase() ===
        otherRoom.preferredLocation.toLowerCase(),
      2
    );
  }
  if (myRoom.accommodationType && otherRoom.accommodationType) {
    add(myRoom.accommodationType === otherRoom.accommodationType, 1);
  }
  if (myRoom.rentBudget && otherRoom.rentBudget) {
    add(Math.abs(myRoom.rentBudget - otherRoom.rentBudget) <= 2000, 1);
  }

  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

module.exports = computeCompatibility;
