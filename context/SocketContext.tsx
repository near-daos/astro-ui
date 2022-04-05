import io, { Socket as TSocket } from 'socket.io-client';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import { useAuthContext } from 'context/AuthContext';
import { useMountedState } from 'react-use';
import { configService } from 'services/ConfigService';

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
  const { accountId, nearService } = useAuthContext();
  const isMounted = useMountedState();

  useEffect(() => {
    if (!nearService) {
      return;
    }

    async function initSocket() {
      let socketIo: Socket;
      const { appConfig } = configService.get();

      const publicKey = await nearService?.getPublicKey();
      const signature = await nearService?.getSignature();

      if (accountId && publicKey && isMounted() && appConfig) {
        socketIo = io(appConfig.API_URL, {
          query: {
            accountId,
            publicKey,
            signature,
          },
          transports: ['websocket'],
        });

        setSocket(socketIo);
      }
    }

    initSocket();
  }, [accountId, isMounted, nearService]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
