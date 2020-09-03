import { Config } from 'linode-js-sdk/lib/linodes';
import * as React from 'react';
import {
  matchPath,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from 'react-router-dom';
import { compose } from 'recompose';
import AppBar from 'src/components/core/AppBar';
import Tab from 'src/components/core/Tab';
import Tabs from 'src/components/core/Tabs';
import SuspenseLoader from 'src/components/SuspenseLoader';
import TabLink from 'src/components/TabLink';
import VolumesLanding from 'src/features/Volumes/VolumesLanding';
import { withLinodeDetailContext } from './linodeDetailContext';

const LinodeSummary = React.lazy(() => import('./LinodeSummary'));
const LinodeSettings = React.lazy(() => import('./LinodeSettings'));
const LinodeResize = React.lazy(() => import('./LinodeResize'));
const LinodeRescue = React.lazy(() => import('./LinodeRescue'));
const LinodeRebuild = React.lazy(() => import('./LinodeRebuild'));
const LinodeNetworking = React.lazy(() => import('./LinodeNetworking'));
const LinodeActivity = React.lazy(() => import('./LinodeActivity'));
const LinodeAdvanced = React.lazy(() => import('./LinodeAdvanced'));
const LinodeBackup = React.lazy(() => import('./LinodeBackup'));

type CombinedProps = ContextProps &
  RouteComponentProps<{
    linodeId: string;
  }>;

const LinodesDetailNavigation: React.StatelessComponent<CombinedProps> = props => {
  const {
    match: { url },
    isMetal,
    linodeLabel,
    linodeConfigs,
    linodeId,
    linodeRegion,
    readOnly
  } = props;
  console.log(props);

  const protoTabs = [
    /* NB: These must correspond to the routes inside the Switch */
    {
      routeName: `${url}/summary`,
      title: 'Summary',
      show: true
    },
    {
      routeName: `${url}/volumes`,
      title: 'Volumes',
      show: !isMetal
    },
    {
      routeName: `${url}/networking`,
      title: 'Networking',
      show: true
    },
    {
      routeName: `${url}/resize`,
      title: 'Resize',
      show: !isMetal
    },
    {
      routeName: `${url}/rescue`,
      title: 'Rescue',
      show: !isMetal
    },
    {
      routeName: `${url}/rebuild`,
      title: 'Rebuild',
      show: true
    },
    {
      routeName: `${url}/backup`,
      title: 'Backups',
      show: !isMetal
    },
    {
      routeName: `${url}/activity`,
      title: 'Activity',
      show: true
    },
    {
      routeName: `${url}/settings`,
      title: 'Settings',
      show: true
    },
    {
      routeName: `${url}/advanced`,
      title: 'Disks/Configs',
      show: !isMetal
    }
  ];

  const tabs = protoTabs.filter((e, i, a) => e.show)

  const handleTabChange = (
    event: React.ChangeEvent<HTMLDivElement>,
    value: number
  ) => {
    const { history } = props;
    const routeName = tabs[value].routeName;
    history.push(`${routeName}`);
  };

  return (
    <>
      <AppBar position="static" color="default" role="tablist">
        <Tabs
          value={tabs.findIndex(tab => matches(tab.routeName))}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="on"
        >
          {tabs.map(tab => (
              <Tab
              key={tab.title}
              label={tab.title}
              data-qa-tab={tab.title}
              component={React.forwardRef((tabProps, ref) => (
                <TabLink
                  to={tab.routeName}
                  title={tab.title}
                  {...tabProps}
                  ref={ref}
                />
              ))}
            />
          ))}
        </Tabs>
      </AppBar>
      <React.Suspense fallback={<SuspenseLoader />}>
        <Switch>
          <Route
            exact
            path={`/linodes/:linodeId/summary`}
            component={LinodeSummary}
          />
          <Route
            exact
            path={`/linodes/:linodeId/volumes`}
            render={routeProps => (
              <div
                id="tabpanel-volumes"
                role="tabpanel"
                aria-labelledby="tab-volumes"
              >
                <VolumesLanding
                  linodeId={linodeId}
                  linodeLabel={linodeLabel}
                  linodeRegion={linodeRegion}
                  linodeConfigs={linodeConfigs}
                  readOnly={readOnly}
                  fromLinodes
                  removeBreadCrumb
                  {...routeProps}
                />
              </div>
            )}
          />
          <Route
            exact
            path={`/linodes/:linodeId/networking`}
            component={LinodeNetworking}
          />
          <Route
            exact
            path={`/linodes/:linodeId/resize`}
            component={LinodeResize}
          />
          <Route
            exact
            path={`/linodes/:linodeId/rescue`}
            component={LinodeRescue}
          />
          <Route
            exact
            path={`/linodes/:linodeId/rebuild`}
            component={LinodeRebuild}
          />
          <Route
            exact
            path={`/linodes/:linodeId/backup`}
            component={LinodeBackup}
          />
          <Route
            exact
            path={`/linodes/:linodeId/activity`}
            component={LinodeActivity}
          />
          <Route
            exact
            path={`/linodes/:linodeId/settings`}
            component={LinodeSettings}
          />
          <Route
            exact
            path={`/linodes/:linodeId/advanced`}
            component={LinodeAdvanced}
          />
          {/* 404 */}
          <Redirect to={`${url}/summary`} />
        </Switch>
      </React.Suspense>
    </>
  );
};

const matches = (p: string) => {
  return Boolean(matchPath(p, { path: location.pathname }));
};

interface ContextProps {
  linodeId: number;
  linodeConfigs: Config[];
  linodeLabel: string;
  linodeRegion: string;
  readOnly: boolean;
  isMetal?: boolean;
}

const enhanced = compose<CombinedProps, {}>(
  withRouter,
  withLinodeDetailContext<ContextProps>(({ linode }) => ({
    linodeId: linode.id,
    isMetal: linode.hypervisor == null,
    linodeConfigs: linode._configs,
    linodeLabel: linode.label,
    linodeRegion: linode.region,
    readOnly: linode._permissions === 'read_only'
  }))
);

export default enhanced(LinodesDetailNavigation);
