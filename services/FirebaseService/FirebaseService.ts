/* eslint-disable @typescript-eslint/no-explicit-any */
import 'firebase/messaging';
import firebase from 'firebase/app';
import { firebaseConfig } from 'config';
import { httpService, HttpService } from 'services/HttpService';
import { SputnikNearService } from 'services/sputnik';

export class FirebaseService {
  private config: Record<string, string | undefined>;

  private messaging!: firebase.messaging.Messaging;

  private readonly httpService: HttpService = httpService;

  constructor(config: Record<string, string | undefined>) {
    this.config = config;
  }

  init(): void {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }

    if (firebase.messaging.isSupported()) {
      this.messaging = firebase.messaging();
      this.messaging.onMessage(this.handleMessage);
    }
  }

  public requestPermission(): void {
    if (Notification.permission === 'granted') {
      return;
    }

    Notification.requestPermission(async permission => {
      if (permission === 'granted') {
        const token = await this.getToken();
        const accountId = SputnikNearService.getAccountId();
        const publicKey = await SputnikNearService.getPublicKey();
        const signature = await SputnikNearService.signMessage(
          'notification token'
        );

        if (!signature || !publicKey) {
          return;
        }

        this.httpService.post('/accounts', {
          token,
          accountId,
          publicKey,
          signature,
        });
      }
    });
  }

  private handleMessage = (payload: any): void => {
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.image,
    };

    const notification = new Notification(
      payload.notification.title,
      notificationOptions
    );

    // eslint-disable-next-line no-console
    console.log(notification);
  };

  public async getToken(): Promise<string> {
    return this.messaging.getToken({
      vapidKey: this.config.vapidKey,
    });
  }
}

export const firebaseService = new FirebaseService(firebaseConfig);
