export type Flight = {
  flightId: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime?: string;
  arrivalTime?: string;
}

export type PassengerType = {
  passenger_id: number;
  name: string;
  seatNumber: number;
};

