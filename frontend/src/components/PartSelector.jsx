

import React from "react";

function PartSelector({ groupedParts, selectedParts, onToggle }) {

  return (
    <div className="part-selector">
      {Object.entries(groupedParts).map(([component, parts]) => (
        <div key={component} className="component-group">
          <h3 className="component-title">{component}</h3>
          <div className="parts-grid">
            {parts.map((part) => {
              const isChecked = selectedParts.includes(part.id);
              return (
                <label
                  key={part.id}
                  className={`part-label ${isChecked ? "part-label--selected" : ""}`}
                >
                  <input
                    type="checkbox"
                    id={`part-${part.id}`}
                    checked={isChecked}
                    onChange={() => onToggle(part.id)}
                    className="part-checkbox"
                  />
                  <span className="part-name">{part.name}</span>
                  {isChecked && <span className="checkmark">✓</span>}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PartSelector;
