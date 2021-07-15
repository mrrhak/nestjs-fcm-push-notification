import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Inject, Logger } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import { FCM_PUSH_NOTIFICATION_OPTIONS } from './utils/fcm-push-notification.constants';
import { FcmPushNotificationOptions } from './interfaces/fcm-push-notification-options.interface';

@Injectable()
export class FcmPushNotificationService {
  constructor(
    @Inject(FCM_PUSH_NOTIFICATION_OPTIONS) private fcmPushNotificationOptionsProvider: FcmPushNotificationOptions,
    private readonly logger: Logger,
  ) {}

  async send(
    payload: firebaseAdmin.messaging.Message,
  ) {
    if (firebaseAdmin.apps.length === 0) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(
          this.fcmPushNotificationOptionsProvider.firebaseSpecsPath,
        ),
      });
    }

    let result = null;
    try {
      result = await firebaseAdmin.messaging().send(payload);
    } catch (error) {
      this.logger.error(error.message, error.stackTrace, 'nestjs-fcm-push-notification');
      throw error;
    }
    return result;
  }

  async sendToDevices(
    deviceTokens: string[],
    payload: firebaseAdmin.messaging.MessagingPayload,
    silent: boolean,
  ) {
    if (deviceTokens.length === 0) {
      throw new Error('You can not provide an empty token list!');
    }

    if (firebaseAdmin.apps.length === 0) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(
          this.fcmPushNotificationOptionsProvider.firebaseSpecsPath,
        ),
      });
    }

    const options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    };

    const optionsSilent = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
      content_available: true,
    };

    let result = null;
    try {
      result = await firebaseAdmin
        .messaging()
        .sendToDevice(deviceTokens, payload, silent ? optionsSilent : options);
    } catch (error) {
      this.logger.error(error.message, error.stackTrace, 'nestjs-fcm-push-notification');
      throw error;
    }
    return result;
  }
}
