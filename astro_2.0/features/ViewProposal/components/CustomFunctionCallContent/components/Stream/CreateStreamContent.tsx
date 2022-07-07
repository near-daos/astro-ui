import React, { VFC } from 'react';
import prettyMilliseconds from 'pretty-ms';
import Decimal from 'decimal.js';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import { TokenFormatter } from '@roketo/sdk/ft';

import { StreamInfo } from 'astro_2.0/features/ViewProposal/components/CustomFunctionCallContent/components/helpers';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import styles from './CreateStreamContent.module.scss';

interface CreateStreamContentProps {
  stream: StreamInfo;
}

export const CreateStreamContent: VFC<CreateStreamContentProps> = ({
  stream,
}) => {
  const speed = new TokenFormatter(24).tokensPerMeaningfulPeriod(
    stream.tokensPerSec
  );

  return (
    <div className={styles.root}>
      <FieldWrapper className={styles.receiver} label="Receiver">
        <FieldValue value={stream.receiverId} />
      </FieldWrapper>
      <FieldWrapper className={styles.amount} label="Amount">
        <FieldValue
          value={
            <div>
              {formatNearAmount(stream.amount)}
              &nbsp;NEAR
            </div>
          }
        />
      </FieldWrapper>
      <FieldWrapper className={styles.speed} label="Speed">
        <FieldValue value={`${speed.formattedValue} NEAR / ${speed.unit}`} />
      </FieldWrapper>
      <FieldWrapper className={styles.duration} label="Duration">
        <FieldValue
          value={prettyMilliseconds(
            new Decimal(stream.amount)
              .minus(new Decimal(0.1).mul(10 ** 24))
              .div(stream.tokensPerSec)
              .mul(1000)
              .toNumber()
          )}
        />
      </FieldWrapper>
    </div>
  );
};
