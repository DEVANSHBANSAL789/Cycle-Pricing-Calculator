

import React from "react";

function formatRupees(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function PriceBreakdown({ breakdown, total }) {
  const components = Object.entries(breakdown);

  return (
    <div className="breakdown-card">
      <h2 className="breakdown-title">Price Breakdown</h2>

      <table className="breakdown-table">
        <thead>
          <tr>
            <th>Component</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {components.map(([component, amount]) => (
            <tr key={component} className="breakdown-row">
              <td>{component}</td>
              <td className="text-right amount">{formatRupees(amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="breakdown-total">
        <span className="total-label">Grand Total</span>
        <span className="total-amount">{formatRupees(total)}</span>
      </div>
    </div>
  );
}

export default PriceBreakdown;
