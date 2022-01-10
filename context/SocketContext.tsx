import io, { Socket as TSocket } from 'socket.io-client';
import { appConfig } from 'config';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import { useAuthContext } from 'context/AuthContext';
import { SputnikNearService } from 'services/sputnik';
import { useMountedState } from 'react-use';

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
  const isMounted = useMountedState();

  useEffect(() => {
    let socketIo: Socket;

    (async () => {
      const publicKey = await SputnikNearService.getPublicKey();
      const signature = await SputnikNearService.getSignature();

      if (accountId && publicKey && isMounted()) {
        socketIo = io(appConfig.socketUrl, {
          query: {
            accountId,
            publicKey,
            signature,
          },
          transports: ['websocket'],
        });

        setSocket(socketIo);
      }
    })();

    return () => {
      if (socketIo) {
        socketIo.disconnect();
      }
    };
  }, [accountId, isMounted]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
