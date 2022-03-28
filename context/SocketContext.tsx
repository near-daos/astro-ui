import io, { Socket as TSocket } from 'socket.io-client';
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuthContext } from 'context/AuthContext';
import { useMountedState } from 'react-use';
import { configService } from 'services/ConfigService';
import { WALLET_INIT_EVENT } from 'utils/init';

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

  const initSocket = useCallback(async () => {
    let socketIo: Socket;
    const { appConfig } = configService.get();

    const publicKey = await window.nearService.getPublicKey();
    const signature = await window.nearService.getSignature();

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
  }, [accountId, isMounted]);

  useEffect(() => {
    let socketIo: Socket;

    document.addEventListener(WALLET_INIT_EVENT, initSocket as EventListener);

    return () => {
      document.removeEventListener(
        WALLET_INIT_EVENT,
        initSocket as EventListener
      );

      if (socketIo) {
        socketIo.disconnect();
      }
    };
  }, [initSocket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
