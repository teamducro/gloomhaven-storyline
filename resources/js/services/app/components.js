// Separate module so the eager glob imports run after ./globals (Vite hoists them to the top of the importing file).
export default import.meta.glob('../../components/**/*.vue', {eager: true});
