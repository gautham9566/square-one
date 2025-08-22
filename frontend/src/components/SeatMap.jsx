import React, { useState } from 'react';

const SeatMap = ({ 
  rows = 10, 
  seatsPerRow = 6,
  unavailableSeats = [],
  selectedSeats = [],
  onSeatSelect,
  showLegend = true,
  className = ''
}) => {
  const [localSelectedSeats, setLocalSelectedSeats] = useState(selectedSeats);
  
  // Generate seat labels (A, B, C, etc.)
  const getSeatLabel = (index) => String.fromCharCode(65 + index);
  
  // Check seat status
  const getSeatStatus = (row, seatIndex) => {
    const seatId = `${row}${getSeatLabel(seatIndex)}`;
    if (unavailableSeats.includes(seatId)) return 'unavailable';
    if (localSelectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };
  
  // Handle seat click
  const handleSeatClick = (row, seatIndex) => {
    const seatId = `${row}${getSeatLabel(seatIndex)}`;
    const status = getSeatStatus(row, seatIndex);
    
    if (status === 'unavailable') return;
    
    let newSelectedSeats;
    if (status === 'selected') {
      newSelectedSeats = localSelectedSeats.filter(seat => seat !== seatId);
    } else {
      newSelectedSeats = [...localSelectedSeats, seatId];
    }
    
    setLocalSelectedSeats(newSelectedSeats);
    if (onSeatSelect) {
      onSeatSelect(seatId, newSelectedSeats);
    }
  };
  
  // Seat component
  const Seat = ({ row, seatIndex, status }) => {
    const seatLabel = getSeatLabel(seatIndex);
    
    const baseClasses = 'w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200';
    
    const statusClasses = {
      available: 'bg-white border-2 border-neutral-300 hover:border-flight-primary hover:bg-flight-light cursor-pointer text-neutral-700',
      selected: 'bg-flight-primary border-2 border-flight-primary text-white cursor-pointer',
      unavailable: 'bg-neutral-100 border-2 border-neutral-200 text-neutral-400 cursor-not-allowed',
    };
    
    return (
      <button
        className={`${baseClasses} ${statusClasses[status]}`}
        onClick={() => handleSeatClick(row, seatIndex)}
        disabled={status === 'unavailable'}
        aria-label={`Seat ${row}${seatLabel} - ${status}`}
      >
        {status === 'unavailable' ? '✕' : seatLabel}
      </button>
    );
  };
  
  // Aisle component
  const Aisle = () => (
    <div className="w-8" aria-hidden="true" />
  );
  
  // Row number component
  const RowNumber = ({ number }) => (
    <div className="w-8 h-12 flex items-center justify-center text-sm font-medium text-neutral-600">
      {number}
    </div>
  );
  
  // Legend component
  const Legend = () => (
    <div className="flex items-center gap-6 p-4 bg-neutral-50 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-white border-2 border-neutral-300"></div>
        <span className="text-sm text-neutral-700">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-flight-primary border-2 border-flight-primary"></div>
        <span className="text-sm text-neutral-700">Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center text-neutral-400 text-xs">✕</div>
        <span className="text-sm text-neutral-700">Unavailable</span>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="text-sm text-neutral-700">Lavatory</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm text-neutral-700">Exit</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-sm text-neutral-700">Galley</span>
      </div>
    </div>
  );
  
  // Aircraft nose/tail indicators
  const AircraftSection = ({ type }) => (
    <div className="flex justify-center py-4">
      <div className={`w-32 h-16 bg-neutral-200 ${type === 'nose' ? 'rounded-t-full' : 'rounded-b-full'}`}>
        <div className="flex items-center justify-center h-full text-neutral-500 text-sm">
          {type === 'nose' ? '↑ Front' : '↓ Rear'}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className={`bg-white rounded-xl shadow-card p-6 ${className}`}>
      {showLegend && <Legend />}
      
      <div className="mt-6 overflow-x-auto">
        <div className="min-w-max">
          <AircraftSection type="nose" />
          
          <div className="bg-neutral-50 rounded-lg p-6">
            {/* Seat grid */}
            <div className="space-y-3">
              {Array.from({ length: rows }, (_, rowIndex) => {
                const rowNumber = rowIndex + 28; // Starting from row 28 as in reference
                const leftSeats = Math.floor(seatsPerRow / 2);
                const rightSeats = seatsPerRow - leftSeats;
                
                return (
                  <div key={rowNumber} className="flex items-center justify-center gap-2">
                    {/* Left section */}
                    <div className="flex gap-2">
                      {Array.from({ length: leftSeats }, (_, seatIndex) => (
                        <Seat
                          key={`${rowNumber}-${seatIndex}`}
                          row={rowNumber}
                          seatIndex={seatIndex}
                          status={getSeatStatus(rowNumber, seatIndex)}
                        />
                      ))}
                    </div>
                    
                    {/* Row number */}
                    <RowNumber number={rowNumber} />
                    
                    {/* Aisle */}
                    <Aisle />
                    
                    {/* Row number */}
                    <RowNumber number={rowNumber} />
                    
                    {/* Right section */}
                    <div className="flex gap-2">
                      {Array.from({ length: rightSeats }, (_, seatIndex) => (
                        <Seat
                          key={`${rowNumber}-${leftSeats + seatIndex}`}
                          row={rowNumber}
                          seatIndex={leftSeats + seatIndex}
                          status={getSeatStatus(rowNumber, leftSeats + seatIndex)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Facilities row */}
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="flex items-center justify-center gap-8">
                <div className="flex items-center gap-2 text-neutral-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <AircraftSection type="tail" />
        </div>
      </div>
      
      {/* Navigation arrows */}
      <div className="flex items-center justify-between mt-6">
        <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SeatMap;
