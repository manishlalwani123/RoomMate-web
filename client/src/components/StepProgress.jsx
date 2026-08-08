const STEPS = ['Personal', 'Room', 'Roommate', 'Profile'];

export default function StepProgress({ step }) {
  return (
    <div className="step-progress">
      {STEPS.map((label, i) => (
        <div key={label} className={`step ${i + 1 <= step ? 'active' : ''}`}>
          <span className="step-dot">{i + 1}</span>
          <span className="step-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
