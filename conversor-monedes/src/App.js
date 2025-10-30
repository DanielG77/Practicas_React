import React, { useState } from "react";

export default function ConversorMonedes() {
  const rates = {
    EUR: 1,
    CNY: 8.23,
    USD: 1.16
  };

  const [amounts, setAmounts] = useState({
    EUR: 1,
    USD: rates.USD,
    CNY: rates.CNY,
  });

  const Remonetizar = (currency, value) => {
    const newValue = parseFloat(value) || 0;
    const euroValue = newValue / rates[currency];
    const newAmounts = {
      EUR: (euroValue * rates.EUR).toFixed(2),
      USD: (euroValue * rates.USD).toFixed(2),
      CNY: (euroValue * rates.CNY).toFixed(2),
    };
    setAmounts(newAmounts);
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-10 p-4 border rounded-lg shadow">
      <h2 className="text-xl font-semibold text-center">Conversor de Monedes</h2>

      <label>
        Euros (€):
        <input
          type="number"
          value={amounts.EUR}
          onChange={(e) => Remonetizar("EUR", e.target.value)}
          className="w-full p-2 border rounded mt-1"
        />
      </label>
      <br></br>
      <label>
        Dòlars ($):
        <input
          type="number"
          value={amounts.USD}
          onChange={(e) => Remonetizar("USD", e.target.value)}
          className="w-full p-2 border rounded mt-1"
        />
      </label>
      <br></br>
      <label>
        Yuans (¥):
        <input
          type="number"
          value={amounts.CNY}
          onChange={(e) => Remonetizar("CNY", e.target.value)}
          className="w-full p-2 border rounded mt-1"
        />
      </label>
    </div>
  );
}
