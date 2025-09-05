// utils/fineCalculator.js
export const calculateFine = (dueDate) => {
  const finePerHour = 0.1;
  const today = new Date();
  const due = new Date(dueDate);
  if (today > due) {
    const lateHours = Math.ceil((today - due) / (1000 * 60 * 60));
    const fine = lateHours * finePerHour;
    return fine;
  }
  return 0;
};
