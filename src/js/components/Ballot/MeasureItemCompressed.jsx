import { ArrowForward } from '@mui/icons-material';
import { Card } from '@mui/material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import MeasureActions from '../../actions/MeasureActions';
import extractNumber from '../../common/utils/extractNumber';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';
import MeasureStore from '../../stores/MeasureStore';
import SupportStore from '../../stores/SupportStore';
import { capitalizeString, shortenText, stripHtmlFromString } from '../../utils/textFormat';

const BallotItemSupportOpposeCountDisplay = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeCountDisplay' */ '../Widgets/BallotItemSupportOpposeCountDisplay'));
const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));
const ShowMoreFooter = React.lazy(() => import(/* webpackChunkName: 'ShowMoreFooter' */ '../Navigation/ShowMoreFooter'));
const TopCommentByBallotItem = React.lazy(() => import(/* webpackChunkName: 'TopCommentByBallotItem' */ '../Widgets/TopCommentByBallotItem'));

class MeasureItemCompressed extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // componentDidMountFinished: false,
      externalUniqueId: '',
      measureSubtitle: '',
      measureText: '',
      measureWeVoteId: '',
      noVoteDescription: '',
      organizationWeVoteId: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
      showPositionStatement: false,
      // numberOfOpposePositionsForScore: 0,
      // numberOfSupportPositionsForScore: 0,
      voterOpposesBallotItem: false,
      voterSupportsBallotItem: false,
      yesVoteDescription: '',
    };
    this.getMeasureLink = this.getMeasureLink.bind(this);
    this.goToMeasureLink = this.goToMeasureLink.bind(this);
    this.togglePositionStatement = this.togglePositionStatement.bind(this);
  }

  componentDidMount () {
    const { externalUniqueId, measureWeVoteId, organization } = this.props;
    const measure = MeasureStore.getMeasure(measureWeVoteId);
    // console.log('componentDidMount, measureWeVoteId: ', measureWeVoteId);
    if (!measure.we_vote_id) {
      // If the measure isn't in the MeasureStore, retrieve it
      MeasureActions.measureRetrieve(measureWeVoteId);
    }
    if (measureWeVoteId &&
      !this.localPositionListHasBeenRetrievedOnce(measureWeVoteId) &&
      !BallotStore.positionListHasBeenRetrievedOnce(measureWeVoteId)
    ) {
      // console.log('componentDidMount positionListForBallotItemPublic', measureWeVoteId);
      MeasureActions.positionListForBallotItemPublic(measureWeVoteId);
      const { positionListHasBeenRetrievedOnce } = this.state;
      positionListHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListHasBeenRetrievedOnce,
      });
    }
    if (measureWeVoteId &&
      !this.localPositionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId) &&
      !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId)
    ) {
      // console.log('componentDidMount positionListForBallotItemPublic', measureWeVoteId);
      MeasureActions.positionListForBallotItemFromFriends(measureWeVoteId);
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      positionListFromFriendsHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListFromFriendsHasBeenRetrievedOnce,
      });
    }
    const organizationWeVoteId = (organization && organization.organization_we_vote_id) ? organization.organization_we_vote_id : this.props.organizationWeVoteId;
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      // componentDidMountFinished: true,
      externalUniqueId,
      localUniqueId: measureWeVoteId,
      // measure,
      measureSubtitle: measure.measure_subtitle,
      measureText: stripHtmlFromString(measure.measure_text),
      measureWeVoteId,
      noVoteDescription: stripHtmlFromString(measure.no_vote_description),
      yesVoteDescription: stripHtmlFromString(measure.yes_vote_description),
      organizationWeVoteId,
    });
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(measureWeVoteId);
    if (ballotItemStatSheet) {
      const {
        // numberOfOpposePositionsForScore, numberOfSupportPositionsForScore,
        voterOpposesBallotItem, voterSupportsBallotItem,
      } = ballotItemStatSheet;
      this.setState({
        // numberOfOpposePositionsForScore,
        // numberOfSupportPositionsForScore,
        voterOpposesBallotItem,
        voterSupportsBallotItem,
      });
    }
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
  //   if (this.state.componentDidMountFinished === false) {
  //     // console.log('shouldComponentUpdate: componentDidMountFinished === false');
  //     return true;
  //   }
  //   if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
  //     // console.log('this.state.organizationWeVoteId:', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId:', nextState.organizationWeVoteId);
  //     return true;
  //   }
  //   if (this.state.ballotItemDisplayName !== nextState.ballotItemDisplayName) {
  //     // console.log('this.state.ballotItemDisplayName:', this.state.ballotItemDisplayName, ', nextState.ballotItemDisplayName:', nextState.ballotItemDisplayName);
  //     return true;
  //   }
  //   if (JSON.stringify(this.state.measure) !== JSON.stringify(nextState.measure)) {
  //     // console.log('this.state.measure:', this.state.measure, ', nextState.measure:', nextState.measure);
  //     return true;
  //   }
  //   if (this.props.showPositionStatementActionBar !== nextProps.showPositionStatementActionBar) {
  //     // console.log('this.props.showPositionStatementActionBar change');
  //     return true;
  //   }
  //   if (this.state.showPositionStatement !== nextState.showPositionStatement) {
  //     // console.log('this.state.showPositionStatement change');
  //     return true;
  //   }
  //   if (this.state.numberOfOpposePositionsForScore !== nextState.numberOfOpposePositionsForScore) {
  //     // console.log('this.state.showPositionStatement change');
  //     return true;
  //   }
  //   if (this.state.numberOfSupportPositionsForScore !== nextState.numberOfSupportPositionsForScore) {
  //     // console.log('this.state.showPositionStatement change');
  //     return true;
  //   }
  //   if (this.state.voterOpposesBallotItem !== nextState.voterOpposesBallotItem) {
  //     // console.log('this.state.showPositionStatement change');
  //     return true;
  //   }
  //   if (this.state.voterSupportsBallotItem !== nextState.voterSupportsBallotItem) {
  //     // console.log('this.state.showPositionStatement change');
  //     return true;
  //   }
  //   // console.log('shouldComponentUpdate no change');
  //   return false;
  // }

  componentWillUnmount () {
    this.measureStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onMeasureStoreChange () {
    const { measureWeVoteId } = this.state;
    const measure = MeasureStore.getMeasure(measureWeVoteId);
    // console.log('MeasureItemCompressed, onMeasureStoreChange, measureWeVoteId:', measureWeVoteId);
    if (measureWeVoteId &&
      !this.localPositionListHasBeenRetrievedOnce(measureWeVoteId) &&
      !BallotStore.positionListHasBeenRetrievedOnce(measureWeVoteId)
    ) {
      // console.log('onMeasureStoreChange positionListForBallotItemPublic', measureWeVoteId);
      MeasureActions.positionListForBallotItemPublic(measureWeVoteId);
      const { positionListHasBeenRetrievedOnce } = this.state;
      positionListHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListHasBeenRetrievedOnce,
      });
    }
    if (measureWeVoteId &&
      !this.localPositionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId) &&
      !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId)
    ) {
      // console.log('componentDidMount positionListForBallotItemPublic', measureWeVoteId);
      MeasureActions.positionListForBallotItemFromFriends(measureWeVoteId);
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      positionListFromFriendsHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListFromFriendsHasBeenRetrievedOnce,
      });
    }
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      // measure,
      measureSubtitle: measure.measure_subtitle,
      measureText: stripHtmlFromString(measure.measure_text),
      noVoteDescription: stripHtmlFromString(measure.no_vote_description),
      yesVoteDescription: stripHtmlFromString(measure.yes_vote_description),
    });
  }

  onSupportStoreChange () {
    const { measureWeVoteId } = this.state;
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(measureWeVoteId);
    if (ballotItemStatSheet) {
      const {
        // numberOfOpposePositionsForScore, numberOfSupportPositionsForScore,
        voterOpposesBallotItem, voterSupportsBallotItem,
      } = ballotItemStatSheet;
      this.setState({
        // numberOfOpposePositionsForScore,
        // numberOfSupportPositionsForScore,
        voterOpposesBallotItem,
        voterSupportsBallotItem,
      });
    }
  }

  getMeasureLink (oneMeasureWeVoteId) {
    if (this.state.organizationWeVoteId) {
      // If there is an organizationWeVoteId, signal that we want to link back to voter_guide for that organization
      return `/measure/${oneMeasureWeVoteId}/btvg/${this.state.organizationWeVoteId}`;
    } else {
      // If no organizationWeVoteId, signal that we want to link back to default ballot
      return `/measure/${oneMeasureWeVoteId}/b/btdb`; // back-to-default-ballot
    }
  }

  goToMeasureLink (oneMeasureWeVoteId) {
    const measureLink = this.getMeasureLink(oneMeasureWeVoteId);
    historyPush(measureLink);
  }

  togglePositionStatement () {
    const { showPositionStatement } = this.state;
    this.setState({
      showPositionStatement: !showPositionStatement,
    });
  }

  localPositionListHasBeenRetrievedOnce (measureWeVoteId) {
    if (measureWeVoteId) {
      const { positionListHasBeenRetrievedOnce } = this.state;
      return positionListHasBeenRetrievedOnce[measureWeVoteId];
    }
    return false;
  }

  localPositionListFromFriendsHasBeenRetrievedOnce (measureWeVoteId) {
    if (measureWeVoteId) {
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      return positionListFromFriendsHasBeenRetrievedOnce[measureWeVoteId];
    }
    return false;
  }

  render () {
    renderLog('MeasureItemCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      externalUniqueId, localUniqueId, measureSubtitle, measureText,
      measureWeVoteId, noVoteDescription, voterOpposesBallotItem,
      voterSupportsBallotItem, yesVoteDescription,
    } = this.state;
    let { ballotItemDisplayName } = this.state;
    if (!measureWeVoteId) {
      return null;
    }
    const { classes } = this.props;
    let ballotDisplay = [];
    if (ballotItemDisplayName) {
      ballotDisplay = ballotItemDisplayName.split(':');
    }
    const measureSubtitleCapitalized = capitalizeString(measureSubtitle);
    ballotItemDisplayName = capitalizeString(ballotItemDisplayName);

    return (
      <Card classes={{ root: classes.cardRoot }}>
        <InfoRow>
          <MeasureInfoWrapper onClick={() => { this.goToMeasureLink(measureWeVoteId); }}>
            <Title>
              {ballotDisplay[0]}
              <ArrowForward
                className="u-show-desktop"
                classes={{ root: classes.cardHeaderIconRoot }}
              />
            </Title>
          </MeasureInfoWrapper>
          <BallotItemSupportOpposeCountDisplayWrapper>
            <Suspense fallback={<></>}>
              <BallotItemSupportOpposeCountDisplay
                ballotItemWeVoteId={measureWeVoteId}
                goToBallotItem={this.goToMeasureLink}
              />
            </Suspense>
          </BallotItemSupportOpposeCountDisplayWrapper>
        </InfoRow>
        <InfoDetailsRow onClick={() => { this.goToMeasureLink(measureWeVoteId); }}>
          <SubTitle>{measureSubtitleCapitalized}</SubTitle>
          <MeasureText>{shortenText(measureText, 200)}</MeasureText>
        </InfoDetailsRow>
        {(!voterOpposesBallotItem && !voterSupportsBallotItem) && (
          <ChoicesRow>
            <Choice
              id={`measureItemCompressedChoiceYes-${measureWeVoteId}`}
            >
              <ChoiceTitle
                onClick={() => { this.goToMeasureLink(measureWeVoteId); }}
              >
                {`Yes On ${extractNumber(ballotItemDisplayName)}`}
              </ChoiceTitle>
              <ChoiceInfo>
                {/* If there is a "yes vote" quote about the measure, show that. If not, show the yesVoteDescription */}
                <Suspense fallback={<></>}>
                  <DelayedLoad showLoadingText waitBeforeShow={500}>
                    <>
                      <Suspense fallback={<></>}>
                        <ItemActionBar
                          ballotItemDisplayName={ballotItemDisplayName}
                          ballotItemWeVoteId={measureWeVoteId}
                          commentButtonHide
                          commentButtonHideInMobile
                          externalUniqueId={`${externalUniqueId}-${localUniqueId}-MeasureItemCompressedVoteYes-${measureWeVoteId}`}
                          hideOpposeNo
                          shareButtonHide
                          hidePositionPublicToggle
                        />
                      </Suspense>
                      <TopCommentByBallotItem
                        ballotItemWeVoteId={measureWeVoteId}
                        childChangeIndicator={yesVoteDescription}
                        // learnMoreUrl={this.getMeasureLink(measureWeVoteId)}
                        limitToYes
                      >
                        <span>
                          {shortenText(yesVoteDescription, 200)}
                        </span>
                      </TopCommentByBallotItem>
                    </>
                  </DelayedLoad>
                </Suspense>
              </ChoiceInfo>
            </Choice>
            <Choice
              id={`measureItemCompressedChoiceNo-${measureWeVoteId}`}
            >
              <ChoiceTitle
                onClick={() => { this.goToMeasureLink(measureWeVoteId); }}
              >
                {`No On ${extractNumber(ballotItemDisplayName)}`}
              </ChoiceTitle>
              <ChoiceInfo>
                {/* If there is a "yes vote" quote about the measure, show that. If not, show the yesVoteDescription */}
                <Suspense fallback={<></>}>
                  <DelayedLoad showLoadingText waitBeforeShow={500}>
                    <>
                      <Suspense fallback={<></>}>
                        <ItemActionBar
                          ballotItemDisplayName={ballotItemDisplayName}
                          ballotItemWeVoteId={measureWeVoteId}
                          commentButtonHide
                          commentButtonHideInMobile
                          externalUniqueId={`${externalUniqueId}-${localUniqueId}-MeasureItemCompressedVoteNo-${measureWeVoteId}`}
                          hideSupportYes
                          shareButtonHide
                          hidePositionPublicToggle
                        />
                      </Suspense>
                      <TopCommentByBallotItem
                        ballotItemWeVoteId={measureWeVoteId}
                        childChangeIndicator={noVoteDescription}
                        // learnMoreUrl={this.getMeasureLink(measureWeVoteId)}
                        limitToNo
                      >
                        <span>
                          {shortenText(noVoteDescription, 200)}
                        </span>
                      </TopCommentByBallotItem>
                    </>
                  </DelayedLoad>
                </Suspense>
              </ChoiceInfo>
            </Choice>
          </ChoicesRow>
        )}
        {(!voterOpposesBallotItem && !voterSupportsBallotItem) && (
          <Suspense fallback={<></>}>
            <ShowMoreFooter showMoreId="measureItemCompressedShowMoreFooter" showMoreLink={() => this.goToMeasureLink(measureWeVoteId)} showMoreText="Learn more" />
          </Suspense>
        )}
      </Card>
    );
  }
}
MeasureItemCompressed.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  measureWeVoteId: PropTypes.string.isRequired,
  organization: PropTypes.object,
  organizationWeVoteId: PropTypes.string,
};

const styles = (theme) => ({
  buttonRoot: {
    padding: 4,
    fontSize: 12,
    minWidth: 60,
    height: 30,
    [theme.breakpoints.down('md')]: {
      minWidth: 60,
      height: 30,
    },
    [theme.breakpoints.down('sm')]: {
      width: 'fit-content',
      minWidth: 50,
      height: 30,
      padding: '0 8px',
      fontSize: 10,
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
  cardRoot: {
    padding: '16px 16px 8px 16px',
    [theme.breakpoints.down('lg')]: {
      padding: '16px 16px 0 16px',
    },
  },
  endorsementIconRoot: {
    fontSize: 14,
    margin: '.3rem .3rem 0 .5rem',
  },
  cardHeaderIconRoot: {
    marginTop: '-.3rem',
    fontSize: 20,
  },
  cardFooterIconRoot: {
    fontSize: 14,
    margin: '0 0 .1rem .4rem',
  },
});

const BallotItemSupportOpposeCountDisplayWrapper = styled('div')`
  cursor: pointer;
  float: right;
`;

const InfoRow = styled('div')`
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const InfoDetailsRow = styled('div')`
  cursor: pointer;
`;

const ChoicesRow = styled('div')`
  display: flex;
  flex-flow: row wrap;
`;

const Choice = styled('div')`
  cursor: pointer;
  display: flex;
  flex-flow: column;
  min-width: 47%;
  padding-right: 8px;
  transition: all 200ms ease-in;
  @media (min-width: 768px) {
    max-width: 47%;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 0 16px;
    margin-right: 10px;
    margin-bottom: 16px;
    &:hover {
      border: 1px solid ${({ theme }) => theme.palette.primary.main};
      box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
    }
  }
`;

const ChoiceTitle = styled('h1')`
  font-weight: bold;
  color: #4371cc;
`;

const ChoiceInfo = styled('span')`
  font-size: 12px;
  color: #777;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 140%;
  }
`;

const MeasureInfoWrapper = styled('div')`
  display: flex;
  flex-flow: column;
  max-width: 75%;
  cursor: pointer;
  user-select: none;
  padding-right: 8px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 70%;
  }
`;

const Title = styled('h1')`
  font-size: 18px;
  font-weight: bold;
  margin: .1rem 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 16px;
  }
`;

const SubTitle = styled('h3')`
  font-size: 16px;
  font-weight: 300;
  color: #555;
  margin-top: .6rem;
  width: 135%;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 13px;
  }
`;

const MeasureText = styled('div')`
  font-size: 13px;
  font-weight: 300;
  color: #777;
  width: 100%;
`;

export default withTheme(withStyles(styles)(MeasureItemCompressed));
