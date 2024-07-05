import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import CampaignActions from '../../../actions/CampaignActions';
import CampaignStore from '../../../stores/CampaignStore';
import OrganizationStore from '../../../../stores/OrganizationStore';
import VoterStore from '../../../../stores/VoterStore';
import AppObservableStore from '../../../stores/AppObservableStore';
import CampaignSupporterStore from '../../../stores/CampaignSupporterStore';
// import apiCalming from '../../../utils/apiCalming';
import initializejQuery from '../../../utils/initializejQuery';
import CampaignSupporterActions from '../../../actions/CampaignSupporterActions';
import OrganizationActions from '../../../../actions/OrganizationActions';
import { renderLog } from '../../../utils/logging';

const HeartFavoriteToggleBase = React.lazy(() => import(/* webpackChunkName: 'HeartFavoriteToggleBase' */ './HeartFavoriteToggleBase'));

class HeartFavoriteToggleLive extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      politicianWeVoteId: '',
      voterOpposesCampaignX: false,
      voterSupportsCampaignX: false,
      supportersCount: 0,
      voterCanVoteForPoliticianInCampaign: false,
      voterFirstName: '',
      voterLastName: '',
      voterSignedInWithEmail: false,
    };
    this.functionToUseWhenProfileComplete = this.functionToUseWhenProfileComplete.bind(this);
    this.submitOpposeClick = this.submitOpposeClick.bind(this);
    this.submitStopOpposingClick = this.submitStopOpposingClick.bind(this);
    this.submitStopSupportingClick = this.submitStopSupportingClick.bind(this);
    this.submitSupportClick = this.submitSupportClick.bind(this);
  }

  componentDidMount () {
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignSupporterStoreListener = CampaignStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.onOrganizationStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
      }
    }
  }

  componentWillUnmount () {
    // console.log('SupportButton componentWillUnmount');
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    if (campaignXWeVoteId) {
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      // console.log('HeartFavoriteToggleLive onCampaignStoreChange campaignX:', campaignX);
      const {
        campaignx_we_vote_id: campaignXWeVoteIdFromDict,
        final_election_date_in_past: finalElectionDateInPast,
        linked_politician_we_vote_id: politicianWeVoteId,
        supporters_count: supportersCount,
        supporters_count_next_goal: supportersCountNextGoal,
        voter_campaignx_supporter: voterCampaignXSupporter,
      } = campaignX;
      const supportersCountNextGoalWithFloor = supportersCountNextGoal || CampaignStore.getCampaignXSupportersCountNextGoalDefault();
      const voterCanVoteForPoliticianInCampaign = CampaignStore.getVoterCanVoteForPoliticianInCampaign(campaignXWeVoteId);
      if (campaignXWeVoteIdFromDict && politicianWeVoteId) {
        //
        const { politicianWeVoteId: politicianWeVoteIdPrevious } = this.state;
        if (politicianWeVoteId !== politicianWeVoteIdPrevious) {
          this.setState({
            politicianWeVoteId,
            supportersCount,
            supportersCountNextGoal: supportersCountNextGoalWithFloor,
          }, () => this.onOrganizationStoreChange());
        }
      } else if (campaignXWeVoteIdFromDict && !politicianWeVoteId) {
        // console.log('HeartFavoriteToggleLive onCampaignStoreChange voterCampaignXSupporter:', voterCampaignXSupporter);
        if (voterCampaignXSupporter && 'campaign_supported' in voterCampaignXSupporter) {
          const {
            campaign_opposed: voterOpposesCampaignX,
            campaign_supported: voterSupportsCampaignX,
            organization_we_vote_id: organizationWeVoteId,
          } = voterCampaignXSupporter;
          this.setState({
            organizationWeVoteId,
            voterOpposesCampaignX,
            voterSupportsCampaignX,
          });
        }
        // console.log('HeartFavoriteToggleLive onCampaignStoreChange campaignXWeVoteIdFromDict:', campaignXWeVoteIdFromDict);
        this.setState({
          finalElectionDateInPast,
          politicianWeVoteId,
          supportersCount,
          supportersCountNextGoal: supportersCountNextGoalWithFloor,
          voterCanVoteForPoliticianInCampaign,
        });
      }
    }
  }

  onCampaignSupporterStoreChange () {
    // When campaignSupporterSave happens which is related to this campaignX, refresh data
    const { campaignXWeVoteId } = this.props;
    const { politicianWeVoteId } = this.state;
    const pigsCanFly = false;
    if (pigsCanFly && !politicianWeVoteId) {
      const {
        voterOpposesCampaignX: voterOpposesCampaignXPrevious,
        voterSupportsCampaignX: voterSupportsCampaignXPrevious,
      } = this.state;
      if (campaignXWeVoteId) {
        const voterCampaignXSupporter = CampaignSupporterStore.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
        // console.log('HeartFavoriteToggleLive onCampaignSupporterStoreChange voterCampaignXSupporter:', voterCampaignXSupporter)
        if (voterCampaignXSupporter && 'campaign_supported' in voterCampaignXSupporter) {
          const {
            campaign_opposed: voterOpposesCampaignX,
            campaign_supported: voterSupportsCampaignX,
            organization_we_vote_id: organizationWeVoteId,
          } = voterCampaignXSupporter;
          if ((voterOpposesCampaignX !== voterOpposesCampaignXPrevious) || (voterSupportsCampaignX !== voterSupportsCampaignXPrevious)) {
            // If this voter's support/oppose status has changed, refresh data
            this.setState({
              organizationWeVoteId,
              voterOpposesCampaignX,
              voterSupportsCampaignX,
            }, () => {
              // TODO: Needs to be figured out in bulk -- not in this component
              // if (apiCalming(`campaignRetrieveAsOwner-${campaignXWeVoteId}`, 500)) {
              //   CampaignActions.campaignRetrieveAsOwner(campaignXWeVoteId);
              // }
            });
          }
        }
      }
    }
  }

  onOrganizationStoreChange () {
    // Lookup Organization data by politicianWeVoteId, so we can get the number of followers
    const { politicianWeVoteId } = this.state;
    // console.log('HeartFavoriteToggleLive onOrganizationStoreChange politicianWeVoteId:', politicianWeVoteId);
    if (politicianWeVoteId) {
      // console.log('voterOpposesCampaignX: ', OrganizationStore.isVoterDislikingThisPolitician(politicianWeVoteId));
      // console.log('voterSupportsCampaignX: ', OrganizationStore.isVoterFollowingThisPolitician(politicianWeVoteId));
      this.setState({
        voterOpposesCampaignX: OrganizationStore.isVoterDislikingThisPolitician(politicianWeVoteId),
        voterSupportsCampaignX: OrganizationStore.isVoterFollowingThisPolitician(politicianWeVoteId),  // A variation on isVoterFollowingThisOrganization
      });
    }
  }

  onVoterStoreChange () {
    // const { campaignXWeVoteId } = this.props;
    const { voterSignedInWithEmail: voterSignedInWithEmailPrevious } = this.state;
    const voterFirstName = VoterStore.getFirstName();
    const voterLastName = VoterStore.getLastName();
    const voterSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    this.setState({
      voterFirstName,
      voterLastName,
      voterSignedInWithEmail,
    }, () => {
      if (voterSignedInWithEmail !== voterSignedInWithEmailPrevious) {
        // TODO: Needs to be figured out in bulk -- not in this component
        // if (apiCalming(`campaignRetrieveAsOwner-${campaignXWeVoteId}`, 500)) {
        //   CampaignActions.campaignRetrieveAsOwner(campaignXWeVoteId);
        // }
      }
    });
  }

  functionToUseWhenProfileComplete (support = true, oppose = false, stopSupporting = false, stopOpposing = false) {
    // console.log('HeartFavoriteToggleLive functionToUseWhenProfileComplete');
    const { campaignXWeVoteId } = this.props;
    const { organizationWeVoteId, politicianWeVoteId } = this.state;
    const campaignSupportedChanged = true;
    // From this page we always send value for 'visibleToPublic'
    let visibleToPublic = CampaignSupporterStore.getVisibleToPublic(campaignXWeVoteId);
    const visibleToPublicChanged = CampaignSupporterStore.getVisibleToPublicQueuedToSaveSet();
    if (visibleToPublicChanged) {
      // If it has changed, use new value
      visibleToPublic = CampaignSupporterStore.getVisibleToPublicQueuedToSave();
    }
    // console.log('HeartFavoriteToggleLive functionToUseWhenProfileComplete, politicianWeVoteId:', politicianWeVoteId);
    let campaignSupported = true;
    const saveVisibleToPublic = true;
    initializejQuery(() => {
      if (support) {
        if (politicianWeVoteId) {
          OrganizationActions.organizationFollow('', politicianWeVoteId);
        } else if (organizationWeVoteId) {
          OrganizationActions.organizationFollow(organizationWeVoteId);
        } else {
          CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
        }
      } else if (stopSupporting) {
        if (politicianWeVoteId) {
          OrganizationActions.organizationStopFollowing('', politicianWeVoteId);
        } else if (organizationWeVoteId) {
          OrganizationActions.organizationStopFollowing(organizationWeVoteId);
        } else {
          campaignSupported = false;
          // TODO: Needs "stop campaign save" method
          CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
        }
      } else if (oppose) {
        if (politicianWeVoteId) {
          // Create organizationDislike
          OrganizationActions.organizationDislike('', politicianWeVoteId);
        } else if (organizationWeVoteId) {
          // Create organizationDislike
          OrganizationActions.organizationDislike(organizationWeVoteId);
        } else {
          // TODO: Needs "oppose" method
          campaignSupported = false;
          CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
        }
      } else if (stopOpposing) {
        if (politicianWeVoteId) {
          // Create organizationStopDisliking
          OrganizationActions.organizationStopDisliking('', politicianWeVoteId);
        } else if (organizationWeVoteId) {
          // Create organizationStopDisliking
          OrganizationActions.organizationStopDisliking(organizationWeVoteId);
        } else {
          // TODO: Needs "stop opposing" method
          campaignSupported = false;
          CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
        }
      }
      AppObservableStore.setShowCompleteYourProfileModal(false);
      AppObservableStore.setShowSignInModal(false);
    });
  }

  submitOpposeClick () {
    const oppose = true;
    const support = false;
    const stopOpposing = false;
    const stopSupporting = false;
    this.submitActionClick(support, oppose, stopSupporting, stopOpposing);
  }

  submitStopOpposingClick () {
    const oppose = false;
    const support = false;
    const stopOpposing = true;
    const stopSupporting = false;
    this.submitActionClick(support, oppose, stopSupporting, stopOpposing);
  }

  submitStopSupportingClick () {
    const oppose = false;
    const support = false;
    const stopOpposing = false;
    const stopSupporting = true;
    this.submitActionClick(support, oppose, stopSupporting, stopOpposing);
  }

  submitSupportClick () {
    const oppose = false;
    const support = true;
    const stopOpposing = false;
    const stopSupporting = false;
    this.submitActionClick(support, oppose, stopSupporting, stopOpposing);
  }

  submitActionClick (support = true, oppose = false, stopSupporting = false, stopOpposing = false) {
    const { campaignXWeVoteId } = this.props;
    const { voterFirstName, voterLastName, voterSignedInWithEmail } = this.state;
    // console.log('HeartFavoriteToggleLive submitActionClick');
    if (!campaignXWeVoteId) {
      console.log('HeartFavoriteToggleLive submitActionClick: missing campaignXWeVoteId:', campaignXWeVoteId);
    } else if (!voterFirstName || !voterLastName || !voterSignedInWithEmail) {
      // Open complete your profile modal
      AppObservableStore.setShowCompleteYourProfileModal(true);
    } else {
      // Mark that voter supports this campaign
      AppObservableStore.setBlockCampaignXRedirectOnSignIn(false);
      this.functionToUseWhenProfileComplete(support, oppose, stopSupporting, stopOpposing);
    }
  }

  render () {
    renderLog('HeartFavoriteToggleLive');  // Set LOG_RENDER_EVENTS to log all renders

    const { campaignXWeVoteId } = this.props;
    const { supportersCount, voterSignedInWithEmail, voterOpposesCampaignX, voterSupportsCampaignX } = this.state;
    // console.log('HeartFavoriteToggleLive voterSupportsCampaignX: ', voterSupportsCampaignX, ' voterOpposesCampaignX: ', voterOpposesCampaignX);
    // console.log('HeartFavoriteToggleLive supportersCount: ', supportersCount);
    return (
      <HeartFavoriteToggleLiveContainer>
        <Suspense fallback={<HeartFavoriteToggleBase />}>
          <HeartFavoriteToggleBase
            campaignXOpposersCount={0}
            campaignXSupportersCount={supportersCount}
            campaignXWeVoteId={campaignXWeVoteId}
            submitOppose={this.submitOpposeClick}
            submitStopOpposing={this.submitStopOpposingClick}
            submitStopSupporting={this.submitStopSupportingClick}
            submitSupport={this.submitSupportClick}
            voterOpposes={voterOpposesCampaignX}
            voterSignedInWithEmail={voterSignedInWithEmail}
            voterSupports={voterSupportsCampaignX}
          />
        </Suspense>
      </HeartFavoriteToggleLiveContainer>
    );
  }
}

HeartFavoriteToggleLive.propTypes = {
  campaignXWeVoteId: PropTypes.string,
};

const HeartFavoriteToggleLiveContainer = styled.div`
`;

export default HeartFavoriteToggleLive;
