import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  const data = {
    url_format:
      'http://app.astrodao.com/dao/<dao_id>/proposals?action=create_proposal&variant=<selected_proposal_variant>&params=<initial_params_object>',
    example:
      'https://dev.app.astrodao.com/dao/aviarium.sputnikv2.testnet/proposals?action=create_proposal&variant=ProposeCustomFunctionCall&params={"details":"Proposal description here", "methodName": "create", "smartContractAddress": "sputnikv2.testnet", "json":{ "key": "{\\"somevalue\\":1}" }}',
    action: 'create_proposal',
    variant: {
      ProposeChangeDaoLegalInfo: {
        details: '',
        externalUrl: '',
        legalStatus: '',
        legalLink: '',
        gas: '',
      },
      ProposeAddMember: {
        details: '',
        externalUrl: '',
        group: '',
        memberName: '',
        gas: '',
      },
      ProposeCreateBounty: {
        details: '',
        externalUrl: '',
        token: 'NEAR',
        amount: '',
        slots: '',
        deadlineThreshold: '',
        gas: '',
      },
      ProposeTransfer: {
        details: '',
        externalUrl: '',
        token: 'NEAR',
        amount: '',
        target: '',
        gas: '',
      },
      ProposeChangeDaoName: {
        details: '',
        externalUrl: '',
        displayName: '',
        gas: '',
      },
      ProposeChangeDaoPurpose: {
        details: '',
        externalUrl: '',
        purpose: '',
        gas: '',
      },
      ProposeChangeDaoLinks: {
        details: '',
        externalUrl: '',
        links: [],
        gas: '',
      },
      ProposePoll: {
        details: '',
        externalUrl: '',
        gas: '',
      },
      ProposeCreateGroup: {
        details: '',
        externalUrl: '',
        group: '',
        memberName: '',
        gas: '',
      },
      ProposeRemoveMember: {
        details: '',
        externalUrl: '',
        group: '',
        memberName: '',
        gas: '',
      },
      ProposeChangeVotingPolicy: {
        details: '',
        externalUrl: '',
        amount: '',
        gas: '',
      },
      ProposeChangeBonds: {
        details: '',
        externalUrl: '',
        createProposalBond: '',
        claimBountyBond: '',
        proposalExpireTime: '',
        unclaimBountyTime: '',
        gas: '',
      },
      ProposeCustomFunctionCall: {
        details: '',
        externalUrl: '',
        smartContractAddress: '',
        methodName: '',
        json: '',
        deposit: '',
        token: 'NEAR',
        actionsGas: '',
        gas: '',
      },
    },
  };

  // http://localhost:8080/dao/voyager.sputnikv2.testnet/proposals/voyager.sputnikv2.testnet-38?action=create_proposal&variant=ProposeCustomFunctionCall&params={"smartContractAddress": "v1_02.multicall.testnet", "methodName": "create", "json":"{"multicall_init_args":{"admin_accounts":["voyager.sputnikv2.testnet"],"croncat_manager":"manager_v1.croncat.testnet","job_bond":"1000000000000000000000000"}}", "deposit": "1"}

  res.status(200).send(data);
}
