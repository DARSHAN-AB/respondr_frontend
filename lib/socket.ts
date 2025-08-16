import { io, Socket } from 'socket.io-client';
import { ReportNotification } from './types';

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
    auth: { token },
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onNewReport = (callback: (report: ReportNotification) => void) => {
  if (socket) {
    socket.on('newReport', callback);
  }
};

export const sendLocationUpdate = (driverId: number, latitude: number, longitude: number) => {
  if (socket) {
    socket.emit('updateLocation', { driverId, latitude, longitude });
  }
};