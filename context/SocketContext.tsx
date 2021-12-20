import io, { Socket as TSocket } from 'socket.io-client';
import { appConfig } from 'config';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import { useAuthContext } from 'context/AuthContext';
import { SputnikNearService } from 'services/sputnik';

type Socket = typeof TSocket;

interface ISocketContext {
  socket: Socket | null;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
});

export const useSocket = (): ISocketContext => useContext(SocketContext);

export const SocketProvider: FC = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { accountId } = useAuthContext();

  useEffect(() => {
    let socketIo: Socket;

    (async () => {
      const publicKey = await SputnikNearService.getPublicKey();
      const signature = await SputnikNearService.signMessage(accountId);

      if (accountId && publicKey) {
        socketIo = io(appConfig.socketUrl, {
          query: {
            accountId,
            publicKey,
            signature,
          },
        });

        socketIo.on('connect', () => {
          // eslint-disable-next-line no-console
          console.log('Socket connected: ', socketIo.id);
        });

        setSocket(socketIo);
      }
    })();

    return () => {
      if (socketIo) {
        // eslint-disable-next-line no-console
        console.log('Socket disconnected: ', socketIo.id);
        socketIo.disconnect();
      }
    };
  }, [accountId]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
