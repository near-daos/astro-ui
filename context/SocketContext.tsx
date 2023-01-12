import io, { Socket as TSocket } from 'socket.io-client';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { useWalletContext } from 'context/WalletContext';
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

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { accountId, pkAndSignature } = useWalletContext();
  const isMounted = useMountedState();

  useEffect(() => {
    async function initSocket() {
      let socketIo: Socket;
      const { appConfig } = configService.get();

      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;

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
  }, [accountId, isMounted, pkAndSignature]);

  const contextValue = useMemo(() => {
    return { socket };
  }, [socket]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
