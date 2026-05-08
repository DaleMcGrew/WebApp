import { Info } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import { TeamAccessSvg } from '../Icons/PoliticianSelfEditIcons';
import { HeaderContentContainer } from '../Style/pageLayoutStyles';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';


const useStyles = makeStyles(() => ({
  informationIcon: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginRight: 4,
  },
}));

function SettingsTeamAccess ({ externalUniqueId, politicianWeVoteId }) {
  const classes = useStyles();
  const politicianWeVoteIdRef = useRef(politicianWeVoteId);

  const onPoliticianStoreChange = useCallback(() => {
    const currentPoliticianWeVoteId = politicianWeVoteIdRef.current;
    if (currentPoliticianWeVoteId) {
      // setPolitician(PoliticianStore.getPoliticianByWeVoteId(currentPoliticianWeVoteId));
      // console.log('SettingsTeamAccess onPoliticianStoreChange politician:', PoliticianStore.getPoliticianByWeVoteId(currentPoliticianWeVoteId));
    }
  }, []);

  useEffect(() => {
    // console.log('VoterPositionEntryAndDisplay useEffect, politicianWeVoteId: ', politicianWeVoteId);
    politicianWeVoteIdRef.current = politicianWeVoteId;
    if (politicianWeVoteId) {
      onPoliticianStoreChange();
    }
  }, [onPoliticianStoreChange, politicianWeVoteId]);

  useEffect(() => {
    AnalyticsActions.saveActionAccountPage(VoterStore.electionId());
  }, []);

  renderLog('SettingsTeamAccess');  // Set LOG_RENDER_EVENTS to log all renders
  return (
    <HeaderContentContainer>
      <Helmet title="Name & Photo - WeVote" />
      <BrowserPushMessage incomingProps={{ externalUniqueId }} />
      <div className="card u-padding-bottom--lg">
        <div className="card-main">
          <HeaderContainer>
            <IconWrapper>
              <TeamAccessSvg />
            </IconWrapper>
            <h1 className="h2">Team Access</h1>
          </HeaderContainer>
          <IntroductionWrapper>
            <Info classes={{ root: classes.informationIcon }} />
            Coming soon, you will have the ability to invite team members to help manage your campaign.
          </IntroductionWrapper>
        </div>
      </div>
    </HeaderContentContainer>
  );
}
SettingsTeamAccess.propTypes = {
  externalUniqueId: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
};

const IconWrapper = styled('div')`
  display: flex;
  align-self: center;
  margin-right: 6px;

  svg {
    margin-top: 4px;
    color: black !important;
  }
`;

const IntroductionWrapper = styled('div')`
  margin-bottom: 12px;
`;

const HeaderContainer = styled('div')`
  display: flex;
  align-items: center;
`;

export default SettingsTeamAccess;
