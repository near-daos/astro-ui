import React, { useCallback, useState } from 'react';

import { Bounty } from 'types/bounties';

import { UserPermissions } from 'types/context';
import { Box, Flex, Spacer, Button, Input } from '@chakra-ui/react';
import { bountyApiService } from 'services/BountyService/BountyApiService';
import { useWalletContext } from 'context/WalletContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

export interface BountyEditorProps {
  bounty?: Bounty;
  permissions?: UserPermissions;
}

export const BountyEditor: React.FC<BountyEditorProps> = ({
  bounty,
  permissions,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagsText, setTagsText] = useState(bounty?.tags?.join(', ') || '');
  const walletContext = useWalletContext();
  const { accountId, pkAndSignature } = walletContext;

  const updateTags = useCallback(async () => {
    if (!pkAndSignature) {
      return;
    }

    const { publicKey, signature } = pkAndSignature;

    if (!publicKey || !signature) {
      return;
    }

    if (!bounty) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { daoId, entityId } = bounty;
      const bountyId = entityId.replace('Bounty:', '');

      const tags = tagsText.split(',').map(tag => tag.trim());

      await bountyApiService.updateTags({
        daoId,
        bountyId,
        tags,
        accountId,
        publicKey,
        signature,
      });

      setIsEditing(false);
      setTagsText(tags.join(', '));
    } catch (e) {
      showNotification({
        type: NOTIFICATION_TYPES.ERROR,
        lifetime: 20000,
        description: e?.message,
      });
    }

    setIsSubmitting(false);
  }, [accountId, pkAndSignature, tagsText, bounty]);

  if (!permissions?.allowedProposalsToCreate?.AddBounty) {
    return <></>;
  }

  return (
    <Box borderBottom="solid 0.5px gray" pb="10px" mb="10px">
      <Flex>
        {isEditing && (
          <Box color="gray.400" fontWeight="bold" fontSize="sm">
            Editing
          </Box>
        )}
        <Spacer />
        {isEditing ? (
          <Button
            variant="outline"
            size="md"
            w="100px"
            isLoading={isSubmitting}
            onClick={updateTags}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="outline"
            size="md"
            w="100px"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </Flex>
      <h3>Tags</h3>
      {isEditing ? (
        <Input
          variant="filled"
          value={tagsText}
          onChange={event => setTagsText(event.target.value)}
          placeholder="Add #custom #hashtags"
        />
      ) : (
        <Box color="gray">
          {tagsText
            ? tagsText
                .split(',')
                .map(tag => `#${tag.trim()}`)
                .join(', ')
            : 'No tags yet'}
        </Box>
      )}
    </Box>
  );
};
