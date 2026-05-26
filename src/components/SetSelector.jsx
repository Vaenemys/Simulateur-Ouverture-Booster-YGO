export default function SetSelector({ sets, selectedSetId, onChange, disabled }) {
  return (
    <label className="field">
      <span>Booster</span>
      <select value={selectedSetId} onChange={(event) => onChange(event.target.value)} disabled={disabled}>
        {sets.map((set) => (
          <option key={set.id} value={set.id} disabled={set.disabled}>
            {set.label}   {set.disabled ? ' — indisponible' : ''}
          </option>
        ))}
      </select>
    </label>
  );
}
