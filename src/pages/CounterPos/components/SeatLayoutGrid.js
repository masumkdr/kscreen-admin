import React from 'react';

export default function SeatLayoutGrid({ layout, selected, onToggle, disableReason }) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const { rows, cols } = layout;
  return (
    <div>
      <div className="text-center text-gray-400 mb-2">SCREEN</div>
      <div className="overflow-auto border border-gray-800 rounded-2xl p-3 bg-gray-900">
        <div className="inline-block">
          {Array.from({ length: rows }).map((_, r) => {
            const rowLabel = letters[r];
            return (
              <div key={r} className="flex items-center mb-1">
                <div className="w-6 text-gray-400 text-sm">{rowLabel}</div>
                {Array.from({ length: cols }).map((__, c) => {
                  const id = `${rowLabel}${c + 1}`;
                  const isSelected = selected.includes(id);
                  const reason = disableReason(id);
                  const disabled = !!reason;
                  return (
                    <button
                      key={id}
                      onClick={() => onToggle(id)}
                      disabled={disabled}
                      title={disabled ? `Disabled: ${reason}` : id}
                      className={`w-8 h-8 m-0.5 rounded-md flex items-center justify-center text-xs font-bold border transition-all
                        ${disabled ? 'bg-gray-700 text-gray-500 border-gray-700 cursor-not-allowed' : isSelected ? 'bg-[#bfa14a] text-black border-[#bfa14a]' : 'bg-gray-800 text-gray-200 border-gray-600 hover:border-[#bfa14a]'}
                      `}
                    >
                      {c + 1}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}