import { useMemo } from 'react';
import { configService } from 'services/ConfigService';

export interface StreamInfo {
  amount: string;
  description: string;
  isAutoStartEnabled: boolean;
  ownerId: string;
  receiverId: string;
  tokensPerSec: string;
}

export function useRoketoStreamCheck(
  json: string
): { create: boolean; stream: StreamInfo } {
  const parsedJson = useMemo(() => JSON.parse(json), [json]);
  const message = useMemo(() => JSON.parse(parsedJson?.msg ?? '{}'), [
    parsedJson,
  ]);
  const config = configService.get();
  const streamingContract = config.appConfig.ROKETO_CONTRACT_NAME;

  const isStreaming = parsedJson.receiver_id === streamingContract;
  const request = message?.Create?.request;

  return {
    stream: {
      amount: parsedJson?.amount ?? '0',
      description: request?.description ?? '',
      isAutoStartEnabled: request?.is_auto_start_enabled ?? true,
      ownerId: request?.owner_id ?? '',
      receiverId: request?.receiver_id ?? '',
      tokensPerSec: request?.tokens_per_sec ?? '0',
    },
    create: isStreaming && typeof request !== 'undefined',
  };
}
