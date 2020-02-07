// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';
import { Exposure, AccountId } from '@polkadot/types/interfaces';

import React, { useState } from 'react';
// import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Option } from '@polkadot/types';
import { Button, HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { useCall, useAccounts, useApi } from '@polkadot/react-hooks';

import basicMd from './md/basic.md';
import Overview from './Overview';
// import Targets from './Targets';
import { useTranslation } from './translate';

import Offer from '@polkadot/app-accounts/modals/Offer';

const EMPY_ACCOUNTS: string[] = [];
const EMPTY_EXPOSURES: Exposure[] = [];
const EMPTY_ALL: [string[], Exposure[]] = [EMPY_ACCOUNTS, EMPTY_EXPOSURES];

function transformAllContracts ([contracts]: [AccountId[], Option<AccountId>[]]): string[] {
  return contracts.map((accountId): string => accountId.toString());
}

function transformStakedContracts ([contracts, exposures]: [AccountId[], Exposure[]]): [string[], Exposure[]] {
  return [contracts.map((accountId): string => accountId.toString()), exposures];
}

function StakingApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const { pathname } = useLocation();
  const allContractIds = (useCall<string[]>(api.query.operator?.contractHasOperator, [], {
    defaultValue: EMPY_ACCOUNTS,
    transform: transformAllContracts
  }) as string[]);
  const stakedContracts = (useCall<[string[], Exposure[]]>((api.derive as any).plasmStaking.stakedOperators, [], {
    defaultValue: EMPTY_ALL,
    transform: transformStakedContracts
  }) as [string[], Exposure[]]);
  const hasQueries = hasAccounts && !!(api.query.imOnline?.authoredBlocks);

  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const _toggleOffer = (): void => setIsOfferOpen(!isOfferOpen);

  return (
    <main className={`staking--App ${className}`}>
      <HelpOverlay md={basicMd} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={
            hasAccounts
              ? hasQueries
                ? []
                : ['query']
              : ['actions', 'query']
          }
          items={[
            {
              isRoot: true,
              name: 'overview',
              text: t('Trading overview')
            }
          ]}
        />
      </header>
      <Button.Group>
        <Button
          isPrimary
          key='new-offer'
          label={t('New offer')}
          icon='add'
          onClick={_toggleOffer}
        />
      </Button.Group>
      {isOfferOpen && (
        <Offer onClose={_toggleOffer} />
      )}
      <Overview
        hasQueries={hasQueries}
        isVisible={[basePath, `${basePath}/waiting`].includes(pathname)}
        allContracts={allContractIds}
        electedContracts={stakedContracts[0]}
      />
    </main>
  );
}

export default styled(StakingApp)`
  .staking--hidden {
    display: none;
  }

  .staking--queryInput {
    margin-bottom: 1.5rem;
  }

  .staking--Chart h1 {
    margin-bottom: 0.5rem;
  }

  .staking--Chart+.staking--Chart {
    margin-top: 1.5rem;
  }
`;
